import { Module } from '@nestjs/common';
import { MicrocdnController } from './microcdn.controller';
import { MicrocdnService } from './microcdn.service';

@Module({
  imports: [],
  controllers: [MicrocdnController],
  providers: [MicrocdnService],
})
export class MicrocdnModule {}
