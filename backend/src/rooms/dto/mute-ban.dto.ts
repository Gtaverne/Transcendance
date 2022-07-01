import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { UsersEntity } from 'src/users/users.entity';

export class MuteBanDTO {
  @IsNotEmpty()
  readonly user: UsersEntity;
  @IsInt()
  @IsNotEmpty()
  readonly channelId: number;
  @IsInt()
  @IsNotEmpty()
  readonly appointedId: number;
  @IsString()
  @IsNotEmpty()
  readonly role: string;
  @IsInt()
  @IsNotEmpty()
  readonly time: number;
}
