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

//retourne le premier endpoint qui match la route
@Controller('users')
export class UsersController {
  constructor(private usersServices: UsersService) {}

  @Get('/friends/:id')
  findFriends(@Param() params): Promise<number[]> {
    return this.usersServices.findFriends(params.id);
  }

  @Get('/blocked/:id')
  findBlocked(@Param() params): Promise<number[]> {
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
  //Replace it by site address
  // @Redirect('http://localhost:3000', 302)
  async callback(
    @Req() request: Request,
    @Res() response: Response,
    @Query('code') code: Promise<string>,
  ): Promise<any> {
    const cd = await code;
    const user = await this.usersServices.login(cd);
    console.log('callback');
    // response.setHeader('Set-Cookie', cookie.serialize('jwtbck', user.jwt) )  ;
    // response.cookie('jwt_meh', user.jwt, {domain: 'http://localhost:3000',sameSite: 'none', secure: false});
    response.header({ 'Access-Control-Allow-Origin': 'http://localhost:3000' });
    response.json(user);
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
    ): Promise<Boolean>  {
      
      // console.log('token: ', token, '  code: ', code)
      const verification = await this.usersServices.verificationMFA(token, code)
      response.json({mfaverification : verification})
      return verification
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
