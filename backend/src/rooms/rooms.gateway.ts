import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesEntity } from 'src/messages/messages.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from '../users/users.entity';
import { Repository } from 'typeorm';
import { RoomsService } from './rooms.service';

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
    private roomsService: RoomsService,
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

    const onlineList = this.usersOnlineList();
    this.session.push([socket.id, socket.handshake.query.id]);
    if (!onlineList.includes(+socket.handshake.query.id))
      this.server.emit('getUsers', this.usersOnlineList());
  }

  async handleDisconnect(socket: Socket) {
    const onlineList = this.usersOnlineList();
    this.session = this.session.filter((u) => u[0] !== socket.id);
    console.log('Disconnected', socket.id);
    const newOnlineList = this.usersOnlineList();
    if (onlineList != newOnlineList)
      this.server.emit('getUsers', newOnlineList);

    const user = this.socketToPlayer.get(socket.id);
    this.socketToPlayer.delete(socket.id);
    if (user && !this.socketToPlayer.get(socket.id))
      await this.usersRepository.update(user.id!, { isOnline: false });
  }

  @SubscribeMessage('transmitMessage')
  async handleTransmitMessage(socket: Socket, msg: MessagesEntity) {
    if (msg.message.length >= 300) return;
    console.log('New message detected:', msg.message);
    const muteList = await this.roomsService.muteList(msg.room.id);
    const list = await this.roomsService.findRoomUsersId(msg.room.id);
    if (muteList.includes(+msg.owner.id)) return;
    this.broadcast(socket.id, 'getTransmitMessage', msg, true, list);
  }

  @SubscribeMessage('transmitOnline')
  async handleTransmitOnline(socket: Socket) {
    this.server.to(socket.id).emit('getUsers', this.usersOnlineList());
  }

  @SubscribeMessage('newInfo')
  handleNewInfo(socket: Socket, msg: any) {
    this.broadcast(socket.id, 'getNewInfo', msg, false, undefined);
  }

  usersOnlineList(): number[] {
    const list: number[] = [];
    this.session.forEach((u) => {
      if (!list.includes(+u[1])) list.push(+u[1]);
    });
    return list.sort();
  }

  private broadcast(
    senderSocket: string,
    codeName: string,
    info: any,
    security: boolean,
    list: number[] | undefined,
  ) {
    this.session.forEach((u) => {
      if (u[0] !== senderSocket)
        if (!security || list.includes(+u[1]))
          this.server.to(u[0]).emit(codeName, info);
    });
  }
}
