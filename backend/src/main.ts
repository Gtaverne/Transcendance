import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as cookieParser from 'cookie-parser';

const FRONT_DOMAIN = 'http://localhost:3000'


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({origin : FRONT_DOMAIN})
  app.useGlobalPipes(new ValidationPipe());
  //app.setGlobalPrefix('api'); //rajouter le prefix api devant toutes les routes

  

  await app.listen(5050);
  
  app.use(cookieParser());

}
bootstrap();
