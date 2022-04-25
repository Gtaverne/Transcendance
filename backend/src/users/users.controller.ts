import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Redirect,
  Req,
  Res,
} from '@nestjs/common';
import { strictEqual } from 'assert';
import { query, Request, Response } from 'express';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './interfaces/user.interface';
import { UsersEntity } from './users.entity';
import { UsersService } from './users.service';

import axios, {AxiosRequestConfig, AxiosResponse,
  AxiosError,} from 'axios'
import * as qs from 'qs'

//On rangera tout ça plus proprement
const INTRA_API = 'https://api.intra.42.fr/oauth/token'
const Auth_URL = 'https://api.intra.42.fr/oauth/authorize'
const Access_Token_URL = 'https://api.intra.42.fr/oauth/token'
const Client_ID ='f950eb9f6505f95fd8146faeb36d1706ceda488419c445ab4fa7485903463bd6'
const Client_Secret = '1b5f67e46005d92cc5bac66cbaa79a6c133e37fea09ce10df2950ff85625e2cf'

//retourne le premier endpoint qui match la route
@Controller('users')
export class UsersController {
  constructor(private usersServices: UsersService) {}


  @Get('/friends')
  findFriend(): string {
    console.log('findFriends activated')
    return 'Friends in users';
  }


  //Pour le login depuis l'intra 42
  @Get('/callback')
  async callback(@Query('code') code: Promise<string>) : Promise<string> {
    const cd = await code

    return this.usersServices.login(cd)
  }


  @Get('aCleanPlusTard')
  findAllTEST(
    @Req()
    request: Request,
    @Res()
    response: Response,
    @Query() query,
  ): any {
    console.log(request);
    return response.json({ msg: 'Find All in users' });
  }
  
  @Get('docs') //ce bloc est juste un bloc demo a retirer
  @Redirect('https://docs.nestjs.com', 302)
  getDocs(@Query('version') version) {
    if (version && version === '5') {
      return { url: 'https://docs.nestjs.com/v5/' };
    }
  }
  
  //les param sont ceux du chemin de la requete
  @Get('/:id')
  async findOne(@Param() params): Promise<User> {
    return this.usersServices.findOne(params.id);
  }
  
  @Get()
  async findAll(@Param() params): Promise<User[]> {
    return this.usersServices.findAll();
  }

  @Post()
  //   @HttpCode(204)
  //   @Header('Authorization', 'Bearer XAOIFUAOSijfoIJASF')
  async create(@Body() user: CreateUserDTO): Promise<UsersEntity> {
    return this.usersServices.create(user);
  }

  @Put('/:id')
  update(@Param() params, @Body() user: CreateUserDTO): Promise<UsersEntity> {
	return this.usersServices.updatePost(params.id, user);
  }

  @Delete('/:id')
  async delete(@Param() params): Promise<any> {
    return this.usersServices.delete(params.id);
  }
}
