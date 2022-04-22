import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  //app.setGlobalPrefix('api'); //rajouter le prefix api devant toutes les routes
  await app.listen(5050);
}
bootstrap();
