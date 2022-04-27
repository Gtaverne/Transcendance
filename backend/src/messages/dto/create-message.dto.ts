import { IsInt, IsString, IsNotEmpty } from 'class-validator';

export class CreateMessageDTO {
  @IsNotEmpty()
  @IsInt()
  readonly owner: number;
  @IsNotEmpty()
  @IsInt()
  readonly channelId: number;
  @IsNotEmpty()
  @IsString()
  readonly message: string;
}
