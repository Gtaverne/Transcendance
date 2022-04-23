import {
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { MessagesEntity } from 'src/messages/messages.entity';
import { UsersEntity } from '../users.entity';

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
  readonly iFollowList: UsersEntity[];
  @IsArray()
  @IsOptional()
  readonly followingMeList: UsersEntity[];
  @IsArray()
  @IsOptional()
  readonly iBlockedList: UsersEntity[];
  @IsArray()
  @IsOptional()
  readonly blockedMeList: UsersEntity[];
  @IsArray()
  @IsOptional()
  readonly messagesList: MessagesEntity[];
}
