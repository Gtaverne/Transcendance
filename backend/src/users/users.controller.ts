import {
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
import { query, Request, Response } from 'express';

//retourne le premier endpoint qui match la route
@Controller('users')
export class UsersController {
  @Get()
  findAll(
    @Req()
    request: Request,
    @Res()
    response: Response,
    @Query() query,
  ): any {
    console.log(request);
    return response.json({ msg: 'Find All in users' });
  }

  @Get('docs')
  @Redirect('https://docs.nestjs.com', 302)
  getDocs(@Query('version') version) {
	if (version && version === '5') {
	  return { url: 'https://docs.nestjs.com/v5/' };
	}
  }
  
  //les param sont ceux du chemin de la requete
  @Get('/:id')
  findOne(@Param() params): string {
    return params;
  }

  @Get('/friends')
  findFriend(): string {
    return 'Friends in users';
  }

  @Post()
  @HttpCode(204)
  @Header('Authorization', 'Bearer XAOIFUAOSijfoIJASF')
  create(): string {
    return 'Post Stuff in users';
  }

  @Put()
  update(): string {
    return 'Update stuff in users';
  }

  @Delete()
  delete(): string {
    return 'Delete garbage in users';
  }
}
