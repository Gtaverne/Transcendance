import { Logger, Param } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { CreateRoomDTO } from './dto/create-room.dto';
import { RoomsService } from './rooms.service';
import { Server, Socket } from 'socket.io';
import { MessagesEntity } from 'src/messages/messages.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from '../users/users.entity';
import { Repository } from 'typeorm';

const jwt = require('jsonwebtoken');

const TOKEN_SECRET = process.env.JWT_Secret;

@WebSocketGateway({
  //   cors: { origin: 'http://localhost:3000', credentials: true },
  namespace: 'chat',
  cors: true,
})
export class RoomsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) {}

  @WebSocketServer()
  server: Server;

  private session = [];
  private logger: Logger = new Logger(RoomsGateway.name);
  private socketToPlayer = new Map<string, UsersEntity>();

  afterInit() {
    this.logger.log('Websocket Server Started, Listening on Port: 5050');
  }

  private getCookieValueByName = (cookies, cookieName) => {
    if (!cookies) cookies = '';
    const match = cookies.match(new RegExp('(^| )' + cookieName + '=([^;]+)'));
    return match ? match[2] : '';
  };

  async handleConnection(socket: Socket) {
    console.log('Socket Connection', socket.id, socket.handshake.query.id);
    console.log('Other Socket', this.session);

    const token: string = this.getCookieValueByName(
      socket.handshake.headers.cookie,
      'jwt',
    );
    try {
      const idFromToken = <number>jwt.verify(token, TOKEN_SECRET);
      if (idFromToken <= 0) throw Error();
      const user = await this.usersRepository.findOne({
        where: { id: idFromToken },
      });
      if (!user) throw Error();
      this.socketToPlayer.set(socket.id, user);
      await this.usersRepository.update(user.id!, { isOnline: true });
    } catch (error) {
      console.log('Invalid token ' + error);
      this.server.to(socket.id).disconnectSockets(true);
      return;
    }

    this.session.push([socket.id, socket.handshake.query.id]);
  }

  async handleDisconnect(socket: Socket) {
    this.session = this.session.filter((u) => u[0] !== socket.id);
    console.log('Disconnected', socket.id);

    const user = this.socketToPlayer.get(socket.id);
    this.socketToPlayer.delete(socket.id);
    if (user && !this.socketToPlayer.get(socket.id))
      await this.usersRepository.update(user.id!, { isOnline: false });
  }

  @SubscribeMessage('transmitMessage')
  handleTransmitMessage(socket: Socket, msg: MessagesEntity) {
    if (msg.message.length >= 300) return;
    console.log('New message detected:', msg.message);
    // this.server.broadcast.emit('getTransmitMessage', msg);
    this.broadcast(socket.id, 'getTransmitMessage', msg);
  }

  @SubscribeMessage('newInfo')
  handleNewInfo(socket: Socket, msg: any) {
    this.broadcast(socket.id, 'getNewInfo', msg);
  }

  private broadcast(senderSocket: string, codeName: string, info: any) {
    this.session.forEach((u) => {
      if (u[0] !== senderSocket) this.server.to(u[0]).emit(codeName, info);
    });
  }
}
