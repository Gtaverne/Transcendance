import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as cookieParser from 'cookie-parser';

const FRONT_DOMAIN = process.env.FRONT_DOMAIN || 'http://localhost:3000';
const BACKEND_PORT = process.env.BACKEND_PORT || 5050;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: FRONT_DOMAIN });
  app.useGlobalPipes(new ValidationPipe());
  //rajouter le prefix api devant toutes les routes
  //app.setGlobalPrefix('/api'); 
  app.use(cookieParser()); //Checker la necessite des parentheses

  await app.listen(BACKEND_PORT);

}
bootstrap();
