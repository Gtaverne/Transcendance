import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomsService } from 'src/rooms/rooms.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateMessageDTO } from './dto/create-message.dto';
import { MessagesEntity } from './messages.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessagesEntity)
    private messagesRepository: Repository<MessagesEntity>,
    private usersService: UsersService,
    private roomsService: RoomsService,
  ) {}

  async create(createMessage: CreateMessageDTO) {
    const newMessage = await this.messagesRepository.create();

    const owner = await this.usersService.findOne(createMessage.owner);
    const room = await this.roomsService.findOne(createMessage.channelId);
    newMessage.owner = owner;
    newMessage.room = room;
    if (createMessage.message.length >= 300) return;
    const muteList = await this.roomsService.muteList(room.id);
    const banList = await this.roomsService.banList(room.id);
    if (muteList.includes(owner.id) || banList.includes(owner.id)) return;
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
