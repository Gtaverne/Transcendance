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
import { ChangeRoleDTO } from 'src/rooms/dto/change-status.dto';
import { UserDTO } from './dto/user.dto';
import { UsersEntity } from './users.entity';
import { UsersService } from './users.service';

//retourne le premier endpoint qui match la route
@Controller('users')
export class UsersController {
  constructor(private usersServices: UsersService) {}

  @Get('/friends')
  findFriend(): string {
    console.log('findFriends activated');
    return 'Friends in users';
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


    // response.cookie('jwt', user.jwt)
    response.header({ 'Access-Control-Allow-Origin': 'http://localhost:3000' });

    response.json(user);

    return 'It should be ok';
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
