import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/users/users.entity';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { BanEntity } from './ban.entity';
import { MuteEntity } from './mute.entity';
import { RoomsController } from './rooms.controller';
import { RoomsEntity } from './rooms.entity';
import { RoomsGateway } from './rooms.gateway';
import { RoomsService } from './rooms.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomsEntity, BanEntity, MuteEntity, UsersEntity]),
    forwardRef(() => UsersModule),
  ],
  controllers: [RoomsController],
  providers: [RoomsService, UsersService, RoomsGateway],
})
export class RoomsModule {}
