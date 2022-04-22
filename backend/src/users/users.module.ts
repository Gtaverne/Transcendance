import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersEntity } from './users.entity';
import { UsersService } from './users.service';

@Module({
  //besoin de la ligne du dessous ? A/B test
  imports: [TypeOrmModule.forFeature([UsersEntity])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
