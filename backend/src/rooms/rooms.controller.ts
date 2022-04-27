import { Body, Controller, Post } from '@nestjs/common';
import { RoomDTO } from './dto/room.dto';
import { RoomsEntity } from './rooms.entity';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private roomsServices: RoomsService) {}

  @Post()
  async create(@Body() room: RoomDTO): Promise<RoomsEntity> {
    return this.roomsServices.create(room);
  }
}
