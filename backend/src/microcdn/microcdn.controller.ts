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
  StreamableFile,
  Req,
  Res,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { query, Request, response, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { MicrocdnService } from './microcdn.service';
import * as fs from 'fs';
import { Readable } from 'typeorm/platform/PlatformTools';
var jwt = require('jsonwebtoken');
const Token_Secret = process.env.JWT_Secret;

@Controller('microcdn')
export class MicrocdnController {
  constructor(private microcdnService: MicrocdnService) {}

  @Get('/avatar/:id')
  async getAvatar(@Param() params, @Res() response: Response) {
    const path = this.microcdnService.getAvatarPath(params.id);

    const data = fs.createReadStream(path);
    response.type('image/png');
    data.pipe(response);
  }

  @Post('upload/:id')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file: any,
    @Param() params: any,
    @Query('jwt') token: string,
  ) {
    const idFromToken = jwt.verify(token, Token_Secret);
    if (params.id === idFromToken) {
      const path = this.microcdnService.getAvatarPath(params.id);
      fs.writeFileSync(path, file.buffer);
    } else {
      console.log('Unauthorized to edit avatar');
    }
  }
}
