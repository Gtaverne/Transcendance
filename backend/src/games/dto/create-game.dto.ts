import {
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UsersEntity } from 'src/users/users.entity';

export class GameDTO {
  @IsNotEmpty()
  @IsInt()
  readonly id: number;
  @IsNotEmpty()
  @IsString()
  readonly status: string;
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
  @IsDate()
  @IsOptional()
  readonly createdAt: Date;
  @IsDate()
  @IsOptional()
  readonly updatedAt: Date;
}
