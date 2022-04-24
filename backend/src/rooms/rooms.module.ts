import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BanEntity } from './ban.entity';
import { MuteEntity } from './mute.entity';
import { RoomsController } from './rooms.controller';
import { RoomsEntity } from './rooms.entity';
import { RoomsService } from './rooms.service';

@Module({
	imports: [TypeOrmModule.forFeature([RoomsEntity, BanEntity, MuteEntity])],
	controllers: [RoomsController],
	providers: [RoomsService],
})
export class RoomsModule {}
