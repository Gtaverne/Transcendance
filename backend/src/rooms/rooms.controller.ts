import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UsersEntity } from 'src/users/users.entity';
import { ChangeRoleDTO } from './dto/change-status.dto';
import { CreateRoomDTO } from './dto/create-room.dto';
import { JoinRoomDTO } from './dto/join-room';
import { MuteBanDTO } from './dto/mute-ban.dto';
import { RoomsEntity } from './rooms.entity';
import { RoomsService } from './rooms.service';

var jwt = require('jsonwebtoken');
const TOKEN_SECRET = process.env.JWT_Secret;

@Controller('rooms')
export class RoomsController {
  constructor(private roomsServices: RoomsService) {}

  @Post('/invite/')
  async invite(
    @Body() data: ChangeRoleDTO,
    @Query('jwt') token: string,
  ): Promise<boolean> {
    return this.roomsServices.invite(data, token);
  }

  @Post('/join/')
  async join(
    @Body() join: JoinRoomDTO,
    @Query('jwt') token: string,
  ): Promise<RoomsEntity> {
    return this.roomsServices.join(join, token);
  }

  @Post('/mute/')
  async mute(
    @Body() data: MuteBanDTO,
    @Query('jwt') token: string,
  ): Promise<boolean> {
    return this.roomsServices.mute(data, token);
  }

  @Post('/ban/')
  async ban(
    @Body() data: MuteBanDTO,
    @Query('jwt') token: string,
  ): Promise<boolean> {
    return this.roomsServices.ban(data, token);
  }

  @Post('/changepassword/')
  async changePassword(
    @Body() data: ChangeRoleDTO,
    @Query('jwt') token: string,
  ): Promise<boolean> {
    return this.roomsServices.changePassword(data, token);
  }

  @Post('/leaveroom/')
  async leaveRoom(
    @Body() data: ChangeRoleDTO,
    @Query('jwt') token: string,
  ): Promise<boolean> {
    if (jwt.verify(token, TOKEN_SECRET) != data.user.id) return false;
    return this.roomsServices.leaveRoom(data);
  }

  @Post('/changeowner/')
  async changeOwner(
    @Body() data: ChangeRoleDTO,
    @Query('jwt') token: string,
  ): Promise<boolean> {
    return this.roomsServices.changeOwner(data, token);
  }

  @Post('/changeadmin/')
  async changeAdmin(
    @Body() data: ChangeRoleDTO,
    @Query('jwt') token: string,
  ): Promise<boolean> {
    return this.roomsServices.changeAdmin(data, token);
  }

  @Post()
  async create(
    @Body() room: CreateRoomDTO,
    @Query('jwt') token: string,
  ): Promise<RoomsEntity> {
    if (jwt.verify(token, TOKEN_SECRET) != room.owner) return;
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
