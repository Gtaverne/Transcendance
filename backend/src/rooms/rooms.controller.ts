import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersEntity } from 'src/users/users.entity';
import { ChangeRoleDTO } from './dto/change-status.dto';
import { CreateRoomDTO } from './dto/create-room.dto';
import { JoinRoomDTO } from './dto/join-room';
import { MuteBanDTO } from './dto/mute-ban.dto';
import { RoomsEntity } from './rooms.entity';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private roomsServices: RoomsService) {}

  @Post('/invite/')
  async invite(@Body() data: ChangeRoleDTO): Promise<boolean> {
    return this.roomsServices.invite(data);
  }

  @Post('/join/')
  async join(@Body() join: JoinRoomDTO): Promise<RoomsEntity> {
    return this.roomsServices.join(join);
  }

  @Post('/mute/')
  async mute(@Body() data: MuteBanDTO): Promise<boolean> {
    return this.roomsServices.mute(data);
  }

  @Post('/ban/')
  async ban(@Body() data: MuteBanDTO): Promise<boolean> {
    return this.roomsServices.ban(data);
  }

  @Post('/changepassword/')
  async changePassword(@Body() data: ChangeRoleDTO): Promise<boolean> {
    return this.roomsServices.changePassword(data);
  }

  @Post('/leaveroom/')
  async leaveRoom(@Body() data: ChangeRoleDTO): Promise<boolean> {
    return this.roomsServices.leaveRoom(data);
  }

  @Post('/changeowner/')
  async changeOwner(@Body() data: ChangeRoleDTO): Promise<boolean> {
    return this.roomsServices.changeOwner(data);
  }

  @Post('/changeadmin/')
  async changeAdmin(@Body() data: ChangeRoleDTO): Promise<boolean> {
    return this.roomsServices.changeAdmin(data);
  }

  @Post()
  async create(@Body() room: CreateRoomDTO): Promise<RoomsEntity> {
    return this.roomsServices.create(room);
  }

  //Return the rooms of one user
  @Get('/user/:id')
  async findRooms(@Param() params): Promise<RoomsEntity[]> {
    return this.roomsServices.findRooms(params.id);
  }

  @Get('/canjoin/:id')
  async findRoomsCanJoin(@Param() params): Promise<RoomsEntity[]> {
    return this.roomsServices.findRoomsCanJoin(params.id);
  }

  //Return the users in one room
  @Get('/users/:id')
  async findRoomUsers(@Param() params): Promise<UsersEntity[]> {
    return this.roomsServices.findRoomUsers(params.id);
  }

  @Get('/:id')
  async findOne(@Param() params): Promise<RoomsEntity> {
    return this.roomsServices.findOne(params.id);
  }
}
