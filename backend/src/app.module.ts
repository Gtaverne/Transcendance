import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomsController } from './rooms/rooms.controller';
import { MessagesController } from './messages/messages.controller';
import { GamesController } from './games/games.controller';
import { UsersModule } from './users/users.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { UsersController } from './users/users.controller';

@Module({
  imports: [UsersModule],
  controllers: [
    AppController,
    RoomsController,
    MessagesController,
    GamesController,
  ],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware).forRoutes(UsersController);
    // consumer
    //   .apply(LoggerMiddleware)
    //   .forRoutes({ path: 'products', method: RequestMethod.GET });
    consumer
      .apply(LoggerMiddleware)
      //Exclure le callback de Login
      .exclude({ path: 'users', method: RequestMethod.POST });
  }
}
