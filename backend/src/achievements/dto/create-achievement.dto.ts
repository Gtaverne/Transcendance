import { IsInt, IsArray, IsString, IsNotEmpty, IsOptional} from 'class-validator';
import { UsersEntity } from 'src/users/users.entity';


export class CreateAchievementDTO {
  @IsNotEmpty()
  @IsInt()
  readonly id: number;
  @IsNotEmpty()
  @IsString()
  readonly achievementName: string;
  @IsOptional()
  @IsString()
  readonly achievementDescription: string;
  @IsNotEmpty()
  @IsString()
  readonly achievementLogo: string;
  @IsArray()
  @IsOptional()
  readonly achieversList: UsersEntity[];
}
