import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesEntity } from 'src/messages/messages.entity';
import { BanEntity } from 'src/rooms/ban.entity';
import { MuteEntity } from 'src/rooms/mute.entity';
import { RoomsEntity } from 'src/rooms/rooms.entity';
import { RoomsService } from 'src/rooms/rooms.service';
import { UsersEntity } from 'src/users/users.entity';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { AchievementsController } from './achievements.controller';
import { AchievementsEntity } from './achievements.entity';
import { AchievementsService } from './achievements.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AchievementsEntity,
      UsersEntity,
      RoomsEntity,
      MessagesEntity,
      BanEntity,
      MuteEntity,

    ]),
    UsersModule,
  ],
  controllers: [AchievementsController],
  providers: [AchievementsService, RoomsService,UsersService],
})
export class AchievementsModule {}
