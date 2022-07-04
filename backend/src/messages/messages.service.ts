import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomsService } from 'src/rooms/rooms.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateMessageDTO } from './dto/create-message.dto';
import { MessagesEntity } from './messages.entity';

var jwt = require('jsonwebtoken');
const TOKEN_SECRET = process.env.JWT_Secret;

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessagesEntity)
    private messagesRepository: Repository<MessagesEntity>,
    private usersService: UsersService,
    private roomsService: RoomsService,
  ) {}

  async create(createMessage: CreateMessageDTO, token: String) {
    if (jwt.verify(token, TOKEN_SECRET) != createMessage.owner) return;
    const newMessage = await this.messagesRepository.create();

    const owner = await this.usersService.findOne(createMessage.owner);
    const room = await this.roomsService.findOne(createMessage.channelId);
    newMessage.owner = owner;
    newMessage.room = room;
    if (createMessage.message.length >= 300 || !owner || !room) return;
    const muteList = await this.roomsService.muteList(room.id);
    const banList = await this.roomsService.banList(room.id);
    const accessList = await this.roomsService.findRoomUsersId(owner.id);
    if (
      muteList.includes(owner.id) ||
      banList.includes(owner.id) ||
      !accessList.includes(+createMessage.channelId)
    )
      return;
    newMessage.message = createMessage.message;

    await this.messagesRepository.save(newMessage);
    return newMessage;
  }

  async findMessages(roomId: number) {
    const room = await this.roomsService.findOne(roomId);
    const res = await this.messagesRepository.find({
      where: { room: room },
      relations: ['owner'],
    });
    return res.sort((a, b) => a.id - b.id);
  }
}
