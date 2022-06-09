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
// import cookieParser from 'cookie-parser';
// import * as cookie from 'cookie';
import { query, Request, response, Response } from 'express';
import { ChangeRoleDTO } from 'src/rooms/dto/change-status.dto';
import { EditorDTO } from './dto/editor.dto';
import { UserDTO } from './dto/user.dto';
import { UsersEntity } from './users.entity';
import { UsersService } from './users.service';

var jwt = require('jsonwebtoken');
const Token_Secret = process.env.JWT_Secret;
const FRONT_DOMAIN = process.env.FRONT_DOMAIN || 'http://localhost:3000';

//retourne le premier endpoint qui match la route
@Controller('users')
export class UsersController {
  constructor(private usersServices: UsersService) {}

  //Terminologie ambigue, ce sont des followers ou des following
  @Get('/friends/:id')
  findFriends(@Param() params): Promise<number[]> {
    return this.usersServices.findFriends(params.id);
  }

  @Get('/followers/:id')
  findFollowers(@Param() params): Promise<number[]> {
    return this.usersServices.findFollowers(params.id);
  }

  @Get('/following/:id')
  findFollowing(@Param() params): Promise<number[]> {
    return this.usersServices.findFollowing(params.id);
  }

  @Get('/blocked/:id')
  findBlocked(@Param() params): Promise<number[]> {
    console.log('Find Blocked by id', params.id)
    return this.usersServices.findBlocked(params.id);
  }

  @Get('/seed')
  async seed(): Promise<string> {
    console.log('Seeding');
    await this.usersServices.seed();
    return 'Seeding';
  }

  //Pour le login depuis l'intra 42
  @Get('/callback')
  async callback(
    @Res() response: Response,
    @Query('code') code: Promise<string>,
  ): Promise<any> {
    const cd = await code;
    console.log('callback, code: ', code);
    try {
      const user = await this.usersServices.login(cd);
      response.header({
        'Access-Control-Allow-Origin': FRONT_DOMAIN,
      });
      response.json(user);
    } catch (error) {
      console.log('Crash in the login function');
      response.header({
        'Access-Control-Allow-Origin': FRONT_DOMAIN,
      });
      response.json({});
    }
    // response.setHeader('Set-Cookie', cookie.serialize('jwtbck', user.jwt) )  ;
    // response.cookie('jwt_meh', user.jwt, {domain: 'http://localhost:3000',sameSite: 'none', secure: false});
    return 'It should be ok';
  }

  @Get('/mfasetup')
  async mfa(
    @Req() request: Request,
    @Res() response: Response,
    @Query('jwt') token: string,
  ): Promise<string> {
    console.log('params', token);

    const secret = await this.usersServices.secret(token);
    response.json({ secret: secret });
    return secret;
  }

  @Get('/mfaverify')
  async mfaverify(
    @Req() request: Request,
    @Res() response: Response,
    @Query('jwt') token: string,
    @Query('code') code: string,
  ): Promise<Boolean> {
    // console.log('token: ', token, '  code: ', code)
    const verification = await this.usersServices.verificationMFA(token, code);
    response.json({ mfaverification: verification });
    return verification;
  }

  @Get('/login2fa')
  async logind2fa(
    @Req() request: Request,
    @Res() response: Response,
    @Query('jwt') token: string,
    @Query('code') code: string,
  ): Promise<any> {
    const user = await this.usersServices.login2fa(token, code);

    console.log('In the controller, user is: ', JSON.stringify(user.user));
    response.header({ 'Access-Control-Allow-Origin': FRONT_DOMAIN });
    response.json(user);
    return user;
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

  @Get('/allusers')
  async accessAllUsers(@Param() params): Promise<UsersEntity[]> {
    // return this.usersServices.findAll();
    return this.usersServices.accessAllUsers();
  }

  //les param sont ceux du chemin de la requete
  //ATTENTION, CETTE ROUTE DEVRA ETRE NETTOYEE
  @Get('/profile/:id')
  async findOneForFront(
    @Param() params,
    @Query('jwt') token: string,
  ): Promise<UsersEntity> {
    const idFromToken = jwt.verify(token, Token_Secret)
    return this.usersServices.findOneForFront(params.id, +idFromToken);
  }

  @Get('/:id')
  async findOne(@Param() params): Promise<UsersEntity> {
    return this.usersServices.findOne(params.id);
  }

  @Get()
  async findAll(@Param() params): Promise<UsersEntity[]> {
    return this.usersServices.findAll();
  }

  @Post('/blockuser/')
  async blockUser(@Body() data: ChangeRoleDTO): Promise<boolean> {
    return this.usersServices.blockUser(data);
  }

  @Post('/editprofile/')
  async editprofile(@Body() data: EditorDTO): Promise<any> {
    return this.usersServices.editprofile(data);
  }

  @Post()
  //   @HttpCode(204)
  //   @Header('Authorization', 'Bearer XAOIFUAOSijfoIJASF')
  async create(@Body() user: UserDTO): Promise<UsersEntity> {
    return this.usersServices.create(user);
  }

  @Put('/:id')
  update(@Param() params, @Body() user: UserDTO): Promise<UsersEntity> {
    return this.usersServices.updateUser(params.id, user);
  }

  @Delete('/:id')
  async delete(@Param() params): Promise<any> {
    return this.usersServices.delete(params.id);
  }
}
