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

@Controller('microcdn')
export class MicrocdnController {
  constructor(private microcdnService: MicrocdnService) {}

  @Get('/avatar/:id')
  async getAvatar(
    @Param() params,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    const user = await this.microcdnService.getAvatar(params.id);

    response.set({
      'Content-Type': 'image/png',
    });
    response.header({ 'Access-Control-Allow-Origin': 'http://localhost:3000' });
    response.json(user);

    return this.microcdnService.getAvatar(params.id);
  }

  @Post('uploadpic/:id')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }
}
