import { Module } from '@nestjs/common';
import { TutoService } from './tuto.service';
import { TutoGateway } from './tuto.gateway';

@Module({
  providers: [TutoGateway, TutoService]
})
export class TutoModule {}
