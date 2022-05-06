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
  cors: { origin: '*' },
})
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

  private addUser = (socket: Socket, userId: number) => {
    let userFound = false;
    let index = 0;
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].userId === userId) {
        userFound = true;
        index = i;
      }
    }
    if (userFound) {
      this.users[index].socket.disconnect();
      this.users.splice(index, 1);
    }
    this.users.push({ userId, socket });
    // !this.users.some((u) => u.userId === userId) &&
    //   this.users.push({ userId, socket });
    console.log(
      'Just updated userId:',
      userId,
      'Total users:',
      this.users.length,
      socket.id,
    );
    // console.log(this.users.length);
  };

  private removeUser = (socketId: string) => {
    const a = this.users.length;
    this.users = this.users.filter((user) => user.socketId === socketId);
    console.log(111, a, this.users.length);
  };

  private getUser = (userId: string) => {
    return this.users.find((user) => user.userId == userId);
  };

  afterInit() {
    this.logger.log('Websocket Server Started, Listening on Port: 5050');
  }

  async handleConnection(socket: Socket, id: number) {
    // if (socket.handshake.auth.id) {
    //   this.addUser(socket, socket.handshake.auth.id);
    //   // console.log('what', socket.handshake.auth.id);
    //   console.log('whatttt', socket.handshake.auth.id);
    // }
    // this.count += 1;
    // console.log(`connected ${socket.id}`);
    // this.logger.log(`Connected ${socket.id}`);
    // socket.emit('message', 'Server sending message to the client :)');
    // const a = this.users.length;
    // this.users.push(socket);
    // this.users.push("userid", socket.handshake.auth.id);
    // console.log('Connected', a, this.users.length, socket.id);
    // this.users.forEach(function (user) {user.emit()})
  }

  async handleDisconnect(socket: Socket) {
    // this.count -= 1;
    // console.log(`disconnected ${socket.id}`);

    // this.removeUser(socket.id);
    const a = this.users.length;
    this.users = this.users.filter((u) => u.socket.id !== socket.id);

    // this.server.emit('getUsers', this.users, 'online');
    // this.logger.log(`Disconnected`, a, this.users.length, socket.id);
    console.log(`Disconnected`, a, this.users.length, socket.id);
  }

  @SubscribeMessage('transmitMessage')
  handleTransmitMessage(socket: Socket, msg: MessagesEntity) {
    console.log('New message detected:', msg.message);
    for (let i = 0; i < this.users.length; i++) {
      this.server.to(this.users[i].socket.id).emit('getTransmitMessage', msg);
    }
    // this.server.emit('getTransmitMessage', msg);
  }

  @SubscribeMessage('addUser')
  handleAddUser(socket: Socket, userId: number) {
    let userCounter = this.users.length;
    this.addUser(socket, userId);
    if (userCounter !== this.users.length || true) { //always true for testing
      let usersList = [];
      for (let i = 0; i < this.users.length; i++) {
        usersList.push(this.users[i].userId);
      }
      usersList.push(-100);
    //   console.log('NEW USER', usersList);
      for (let i = 0; i < this.users.length; i++) {
        this.server.to(this.users[i].socket.id).emit('getUsers', usersList);
      }
    }
    // this.users.forEach((u) => u.emit('getUsers', String(this.users), "online")); //20:34

    // this.server.emit('getUsers', this.users, 'online'); //!\ ligne qui fait planter
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(senderId: string, receiverId: string, text: string) {
    // this.addUser(userId, socket.id);
    // this.users.forEach((u) => u.emit('getUsers', String(this.users), "online"));
    // this.server.emit('getUsers', this.users, 'online');
    const user = this.getUser(receiverId);
  }
}
