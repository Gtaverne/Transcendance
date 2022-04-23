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
  async login(@Query('code') code: Promise<string>) : Promise<string> {

    //On recupere le code, il faut maintenant s'en servir pour obtenir un token
    console.log(code)

    const data = qs.stringify({
      'client_id': Client_ID,
      'client_secret': Client_Secret,
      'code': code,
      'grant_type': 'authorization_code',
      'redirect_uri': 'http://localhost:5050/users/callback' 
    });

    const config: AxiosRequestConfig = {
      method: 'post',
      url: Access_Token_URL,
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded', 
      },
      data : data,
    };
    
    const token = await axios(config)
    .then(function (response: AxiosResponse) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });

    return 'Called by the intra 42'
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
