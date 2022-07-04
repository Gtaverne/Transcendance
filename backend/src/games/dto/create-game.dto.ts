import { IsDate, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { UsersEntity } from 'src/users/users.entity';

export class GameDTO {
  @IsNotEmpty()
  @IsInt()
  readonly id: number;
  @IsNotEmpty()
  readonly user1: UsersEntity;
  @IsNotEmpty()
  readonly user2: UsersEntity;
  @IsOptional()
  @IsInt()
  readonly score1: number;
  @IsOptional()
  @IsInt()
  readonly score2: number;
  @IsOptional()
  @IsInt()
  readonly levelA: number;
  @IsOptional()
  @IsInt()
  readonly levelB: number;
  @IsDate()
  @IsOptional()
  readonly createdAt: Date;
  @IsDate()
  @IsOptional()
  readonly updatedAt: Date;
}
