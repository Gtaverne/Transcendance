import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateAchievementDTO } from './dto/create-achievement.dto';
import { AchievementsEntity } from './achievements.entity';
import { AchievementsService } from './achievements.service';

@Controller('achievements')
export class AchievementsController {
  constructor(private achievementsServices: AchievementsService) {}

  @Get('/:name')
  findDescription(@Param() params): AchievementsEntity {
    // return this.messagesServices.findMessages(params.roomId);
    console.log('Trying to get details of an achievement: ', params.name);
    return new AchievementsEntity();
  }

  @Get('/update/:userid')
  async updateAchievements(@Param() params): Promise<number[]> {
    const achievementList = await this.achievementsServices.updateAchievements(
      params.userid,
    );

    return achievementList;
  }

  // @Post()
  // async create(@Body() achievement: CreateAchievementDTO): Promise<AchievementsEntity> {
  //   return this.AchievementsServices.create(achievement);
  // }

  // @Get('/:roomId')
  // async findAchievements(@Param() params): Promise<AchievementsEntity[]> {
  //   return this.AchievementsServices.findAchievements(params.roomId);
  // }
}
