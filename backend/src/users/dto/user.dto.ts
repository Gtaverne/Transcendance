import {
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { GamesEntity } from 'src/games/games.entity';
import { MessagesEntity } from 'src/messages/messages.entity';
import { AchievementsEntity } from 'src/achievements/achievements.entity';
import { BanEntity } from 'src/rooms/ban.entity';
import { MuteEntity } from 'src/rooms/mute.entity';
import { RoomsEntity } from 'src/rooms/rooms.entity';
import { UsersEntity } from '../users.entity';

export class UserDTO {
  @IsNotEmpty()
  @IsInt()
  readonly id: number;
  @IsNotEmpty()
  @IsString()
  readonly username: string;
  @IsNotEmpty()
  @IsInt() //Modified
  readonly doublefa: number;
  @IsString()
  @IsOptional()
  readonly secret: string;
  @IsNotEmpty()
  @IsInt()
  readonly lvl: number;
  @IsNotEmpty()
  @IsInt()
  readonly currentGame: number;
  @IsNotEmpty()
  @IsBoolean()
  readonly isOnline: boolean;
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
  @IsArray()
  @IsOptional()
  readonly achievementsList: AchievementsEntity[];
  @IsArray()
  @IsOptional()
  readonly accessToList: RoomsEntity[];
  @IsArray()
  @IsOptional()
  readonly gamePlayer1: GamesEntity[];
  @IsArray()
  @IsOptional()
  readonly gamePlayer2: GamesEntity[];
  @IsArray()
  @IsOptional()
  readonly ownedRooms: RoomsEntity[];
  @IsArray()
  @IsOptional()
  readonly administratingRooms: RoomsEntity[];
  @IsArray()
  @IsOptional()
  readonly mutedInARoom: MuteEntity[];
  @IsArray()
  @IsOptional()
  readonly bannedInARoom: BanEntity[];
}
