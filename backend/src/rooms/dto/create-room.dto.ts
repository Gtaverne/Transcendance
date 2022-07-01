import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoomDTO {
  @IsNotEmpty()
  @IsInt()
  readonly owner: number;
  @IsBoolean()
  @IsNotEmpty()
  readonly isDm: boolean;
  @IsOptional()
  @IsString()
  readonly secondMemberDm: string;
  @IsOptional()
  @IsString()
  readonly password: string;
  @IsNotEmpty()
  @IsString()
  readonly category: string;
  @IsNotEmpty()
  @IsString()
  readonly channelName: string;
}
