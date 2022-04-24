import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesController } from './messages.controller';
import { MessagesEntity } from './messages.entity';
import { MessagesService } from './messages.service';

@Module({
	imports: [TypeOrmModule.forFeature([MessagesEntity])],
	controllers: [MessagesController],
	providers: [MessagesService],
})
export class MessagesModule {}
