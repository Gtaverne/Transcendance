import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { MicrocdnService } from './microcdn.service';
import * as fs from 'fs';
import { Readable } from 'typeorm/platform/PlatformTools';
import { type } from 'os';
const imageType = require('image-type');

var jwt = require('jsonwebtoken');
const TOKEN_SECRET = process.env.JWT_Secret;
const CDN_PATH = '/app/microcdn';

@Controller('microcdn')
export class MicrocdnController {
  constructor(private microcdnService: MicrocdnService) {}

  @Get('/content/:reference')
  async getContent(@Param() params, @Res() response: Response) {
    console.log('CDN: Trying to get content ', params.reference);
    try {
      const path = this.microcdnService.getContentPath(params.reference);
      // console.log('Microcdn path: ', path)
      const data = fs.createReadStream(path);
      response.type('image/png');
      data.pipe(response);
      return;
    } catch (error) {
      console.log('No content found');
      return;
    }
  }

  @Get('/avatar/:id')
  async getAvatar(@Param() params, @Res() response: Response) {
    console.log('THe CDN received a request, id= ', params.id);
    try {
      const path = this.microcdnService.getAvatarPath(params.id);
      // console.log('Microcdn path: ', path)
      const data = fs.createReadStream(path);

      response.type('image/png');
      data.pipe(response);
      return;
    } catch (error) {
      console.log('No avatar found');
      return;
    }
  }

  @Post('upload/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: any,
    @Param() params: any,
    @Query('jwt') token: string,
  ) {
    const idFromToken = jwt.verify(token, TOKEN_SECRET);
    console.log('Post received something from id: ', idFromToken);
    if (params.id === idFromToken) {
      try {
        const previous = this.microcdnService.getAvatarPath(params.id);
        if (!previous.endsWith('default.jpg')) {
          console.log('Deleting previous picture');
          fs.unlinkSync(previous);
        }
        const incomming = await imageType(file.buffer);
        console.log('File Type: ', incomming);
        if (incomming.ext !== '') {
          const path = CDN_PATH + `/avatar/${params.id}.${incomming.ext}`;

          console.log('Here we write the file: ', path);
          fs.writeFileSync(path, file.buffer);
        }
      } catch (error) {
        console.log('Upload error');
      }
    } else {
      console.log('Unauthorized to edit avatar');
    }
  }
}
