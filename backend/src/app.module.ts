import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomsController } from './rooms/rooms.controller';
import { MessagesController } from './messages/messages.controller';
import { GamesController } from './games/games.controller';
import { UsersModule } from './users/users.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { UsersController } from './users/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './orm.config';
import { RoomsService } from './rooms/rooms.service';
import { MessagesService } from './messages/messages.service';
import { GamesService } from './games/games.service';
import { GamesModule } from './games/games.module';
import { RoomsModule } from './rooms/rooms.module';
import { MessagesModule } from './messages/messages.module';
import { TutoModule } from './tuto/tuto.module';

@Module({
  imports: [
    UsersModule,
    GamesModule,
    RoomsModule,
    MessagesModule,
    TypeOrmModule.forRoot(config),
    TutoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(UsersController);
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'products', method: RequestMethod.GET });
    consumer
      .apply(LoggerMiddleware)
      //Exclure le callback de Login
      //.exclude({ path: 'users', method: RequestMethod.POST });
      .exclude({ path: 'users/callback', method: RequestMethod.POST });

      

      


  }
}
