import {
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateGameDTO {
  @IsNotEmpty()
  @IsInt()
  readonly id: number;
  @IsNotEmpty()
  @IsString()
  readonly status: string;
  @IsNotEmpty()
  @IsInt()
  readonly user1: number;
  @IsNotEmpty()
  @IsInt()
  readonly user2: number;
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
