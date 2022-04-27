import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateMessageDTO } from './dto/create-message.dto';
import { MessagesEntity } from './messages.entity';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
	constructor(private messagesServices: MessagesService) {}


  @Post()
  async create(@Body() message: CreateMessageDTO): Promise<MessagesEntity> {
    return this.messagesServices.create(message);
  }

  @Get('/:roomId')
  async findMessages(@Param() params): Promise<MessagesEntity[]> {
    return this.messagesServices.findMessages(params.roomId);
  }
}
