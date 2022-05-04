import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesEntity } from 'src/messages/messages.entity';
import { MessagesService } from 'src/messages/messages.service';
import { RoomsEntity } from 'src/rooms/rooms.entity';
import { RoomsModule } from 'src/rooms/rooms.module';
import { RoomsService } from 'src/rooms/rooms.service';
import { UsersController } from './users.controller';
import { UsersEntity } from './users.entity';
import { UsersService } from './users.service';

@Module({
  imports: [
	forwardRef(() => RoomsModule),
    TypeOrmModule.forFeature([UsersEntity, RoomsEntity, MessagesEntity])
  ],
  controllers: [UsersController],
  providers: [UsersService, RoomsService, MessagesService],
})
export class UsersModule {}
