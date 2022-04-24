import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesController } from './games.controller';
import { GamesEntity } from './games.entity';
import { GamesService } from './games.service';

@Module({
	imports: [TypeOrmModule.forFeature([GamesEntity])],
	controllers: [GamesController],
	providers: [GamesService],
})
export class GamesModule {}
