import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BanEntity } from 'src/rooms/ban.entity';
import { MuteEntity } from 'src/rooms/mute.entity';
import { RoomsEntity } from 'src/rooms/rooms.entity';
import { RoomsModule } from 'src/rooms/rooms.module';
import { RoomsService } from 'src/rooms/rooms.service';
import { UsersEntity } from 'src/users/users.entity';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { MessagesController } from './messages.controller';
import { MessagesEntity } from './messages.entity';
import { MessagesService } from './messages.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MessagesEntity,
      UsersEntity,
      RoomsEntity,
      MuteEntity,
      BanEntity,
    ]),
    UsersModule,
    RoomsModule,
  ],
  controllers: [MessagesController],
  providers: [MessagesService, RoomsService, UsersService],
})
export class MessagesModule {}
