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

@WebSocketGateway({
  //   cors: { origin: 'http://localhost:3000', credentials: true },
  namespace: 'chat',
  cors: true,
})
export class RoomsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
//   constructor(
//     private readonly roomsService: RoomsService,
//     private readonly usersService: RoomsService,
//   ) {}

  @WebSocketServer()
  server: Server;

  private session = [];
  private logger: Logger = new Logger(RoomsGateway.name);

  afterInit() {
    this.logger.log('Websocket Server Started, Listening on Port: 5050');
  }

  async handleConnection(socket: Socket) {
    console.log('Socket Connection', socket.id, socket.handshake.query.id);
    console.log('Other Socket', this.session);
    // console.log(socket);
    this.session.push([socket.id, socket.handshake.query.id]);
  }

  async handleDisconnect(socket: Socket) {
    this.session = this.session.filter((u) => u[0] !== socket.id);
    console.log('Disconnected', socket.id);
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
