import {
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsInt()
  readonly id: number;
  @IsNotEmpty()
  @IsString()
  readonly username: string;
  @IsNotEmpty()
  @IsBoolean()
  readonly doublefa: boolean;
  @IsNotEmpty()
  @IsInt()
  readonly lvl: number;
  @IsDate()
  @IsOptional()
  readonly createdAt: Date;
  @IsDate()
  @IsOptional()
  readonly updatedAt: Date;
  @IsString()
  @IsOptional()
  readonly avatar: string;
  @IsString()
  @IsOptional()
  readonly email: string;
  @IsArray()
  @IsOptional()
  readonly friendsList: number[];
  @IsArray()
  @IsOptional()
  readonly blockedUsers: number[];
}
