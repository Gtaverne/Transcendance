import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { RoomsController } from './rooms/rooms.controller';
import { MessagesController } from './messages/messages.controller';
import { GamesController } from './games/games.controller';

@Module({
  imports: [],
  controllers: [AppController, UsersController, RoomsController, MessagesController, GamesController],
  providers: [AppService],
})
export class AppModule {}
