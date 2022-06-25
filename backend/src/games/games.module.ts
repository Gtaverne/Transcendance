import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesController } from './games.controller';
import { GamesEntity } from './games.entity';
import { GamesService } from './games.service';
import { GamesGateway } from './games.gateway';

@Module({
	imports: [TypeOrmModule.forFeature([GamesEntity])],
	controllers: [GamesController],
	providers: [GamesService, GamesGateway],
})
export class GamesModule {}
