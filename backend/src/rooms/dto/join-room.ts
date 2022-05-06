import {
  IsInt,
  IsNotEmpty,
} from 'class-validator';

export class JoinRoomDTO {
  @IsNotEmpty()
  @IsInt()
  readonly owner: number;
  @IsNotEmpty()
  @IsInt()
  readonly convId: string;
}
