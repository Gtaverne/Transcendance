import { IsArray, IsBoolean, IsDate, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { MessagesEntity } from 'src/messages/messages.entity';
import { UsersEntity } from 'src/users/users.entity';
import { BanEntity } from '../ban.entity';
import { MuteEntity } from '../mute.entity';

export class RoomDTO {
  @IsNotEmpty()
  @IsInt()
  readonly id: number;
  @IsOptional()
  @IsString()
  readonly channelName: string;
  @IsOptional()
  @IsBoolean()
  readonly password: string;
  @IsNotEmpty()
  @IsString()
  readonly category: string;
  @IsDate()
  @IsOptional()
  readonly createdAt: Date;
  @IsDate()
  @IsOptional()
  readonly updatedAt: Date;
  @IsBoolean()
  @IsNotEmpty()
  readonly isDm: boolean;
  @IsArray()
  @IsOptional()
  readonly muteList: MuteEntity[];
  @IsArray()
  @IsOptional()
  readonly banList: BanEntity[];
  @IsArray()
  @IsOptional()
  readonly messagesList: MessagesEntity[];
  @IsArray()
  @IsOptional()
  readonly accessList: UsersEntity[];
  @IsOptional()
  readonly owner: UsersEntity;
  @IsArray()
  @IsOptional()
  readonly admins: UsersEntity[];
}
