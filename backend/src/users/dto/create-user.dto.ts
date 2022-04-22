import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  readonly id: number;
  @IsNotEmpty()
  @IsString()
  readonly username: string;
  @IsNotEmpty()
  @IsBoolean()
  readonly admin: boolean;
  @IsNotEmpty()
  @IsInt()
  readonly lvl: number;
}
