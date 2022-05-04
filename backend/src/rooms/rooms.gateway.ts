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

@WebSocketGateway({ cors: { origin: '*' } })
export class RoomsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly roomsService: RoomsService,
    private readonly usersService: RoomsService,
  ) {}

  @WebSocketServer()
  server: Server;

  private users = [];
  private logger: Logger = new Logger(RoomsGateway.name);
//   private count: number = 0;

  private addUser = (userId: string, socketId: string) => {
    !this.users.some((user) => user.userId === userId) &&
      this.users.push({ userId, socketId });
  };

  private removeUser = (socketId: string) => {
    this.users = this.users.filter((user) => user.socketId !== socketId);
  };

  private getUser = (userId: string) => {
    return this.users.find((user) => user.userId == userId);
  };

  afterInit() {
    this.logger.log('Websocket Server Started, Listening on Port: 5050');
  }

  async handleConnection(socket: Socket) {
    // this.count += 1;
    // console.log(`connected ${socket.id}`);
    this.logger.log(`Connected ${socket.id}`);
    // socket.emit('message', 'Server sending message to the client :)');
    // clients.push(socket);
  }

  async handleDisconnect(socket: Socket) {
    // this.count -= 1;
    // console.log(`disconnected ${socket.id}`);
    this.removeUser(socket.id);
    this.server.emit('getUsers', this.users, 'online');
    this.logger.log(`Disconnected ${socket.id}`);
  }

  @SubscribeMessage('addUser')
  handleAddUser(socket: Socket, userId: string) {
    this.addUser(userId, socket.id);
    // this.users.forEach((u) => u.emit('getUsers', String(this.users), "online"));
    this.server.emit('getUsers', this.users, 'online');
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(senderId: string, receiverId: string, text: string) {
    // this.addUser(userId, socket.id);
    // this.users.forEach((u) => u.emit('getUsers', String(this.users), "online"));
    // this.server.emit('getUsers', this.users, 'online');
    const user = this.getUser(receiverId);
    this.server.to(user.socketId).emit('getMessage', { senderId, text });
  }

  //   @SubscribeMessage('sendMessagee')
  //   handleMessageTuto(socket: Socket, message: string) {
  //     this.server.emit('newMessage', message);
  //   }

  //   @SubscribeMessage('message')
  //   handleMessage(@MessageBody() message: string): void {
  //     this.server.emit('message', message);
  //     console.log('Hey Bro');
  //   }

  //   @SubscribeMessage('createRoom')
  //   create(@MessageBody() createRoomDto: CreateRoomDTO) {
  //     return this.roomsService.create(createRoomDto);
  //   }

  //   @SubscribeMessage('findAllRoom/:id')
  //   findAll(@Param() params) {
  //     return this.roomsService.findAll();
  //   }

  //   @SubscribeMessage('joinRoom')
  //   joinRoom() {
  //     console.log('heyo');
  //     //TODO
  //   }
}
