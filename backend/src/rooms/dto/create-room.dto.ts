import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRoomDTO {
  @IsNotEmpty()
  @IsInt()
  readonly owner: number;
  @IsBoolean()
  @IsNotEmpty()
  readonly isDm: boolean;
  @IsOptional()
  @IsInt()
  readonly secondMemberDm: number;
  @IsNotEmpty()
  @IsString()
  readonly category: string;
  @IsNotEmpty()
  @IsString()
  readonly channelName: string;
}
