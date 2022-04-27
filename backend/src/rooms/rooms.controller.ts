import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateRoomDTO } from './dto/create-room.dto';
import { RoomsEntity } from './rooms.entity';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private roomsServices: RoomsService) {}

  @Post()
  async create(@Body() room: CreateRoomDTO): Promise<RoomsEntity> {
    return this.roomsServices.create(room);
  }

  //Return the rooms of one user
  @Get('/user/:id')
  async findRooms(@Param() params): Promise<RoomsEntity[]> {
    return this.roomsServices.findRooms(params.id);
  }
}
