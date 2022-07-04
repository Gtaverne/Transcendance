import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import express, { urlencoded, json } from 'express';
import * as cookieParser from 'cookie-parser';

const BACKEND_PORT = process.env.BACKEND_PORT || 5050;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.use(json({ limit: '5mb' }));
  app.use(urlencoded({ extended: true, limit: '5mb' }));

  //rajoute le prefixe api devant toutes les routes
  app.setGlobalPrefix('/api');
  app.use(cookieParser());

  await app.listen(BACKEND_PORT);
}
bootstrap();
