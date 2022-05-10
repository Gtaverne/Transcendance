import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class JoinRoomDTO {
  @IsNotEmpty()
  @IsInt()
  readonly owner: number;
  @IsNotEmpty()
  @IsInt()
  readonly convId: number;
  @IsOptional()
  @IsString()
  readonly password: string;
  @IsNotEmpty()
  @IsBoolean()
  readonly private: boolean;
}
