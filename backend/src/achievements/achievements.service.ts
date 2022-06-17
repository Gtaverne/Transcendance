import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateAchievementDTO } from './dto/create-achievement.dto';
import { AchievementsEntity } from './achievements.entity';

const CDN_PATH = '/app/microcdn';

@Injectable()
export class AchievementsService {
  constructor(
    @InjectRepository(AchievementsEntity)
    private achievementsRepository: Repository<AchievementsEntity>,
    private usersService: UsersService,
  ) {}

  async create(createAchievement: CreateAchievementDTO) {
    const newAchievement = this.achievementsRepository.create(
      createAchievement,
    );
    await this.achievementsRepository.save(newAchievement);
    return newAchievement;
  }

  async getAchievement(num: number) {
    try {
      const res = await this.achievementsRepository.findOne(num);
      return res;
    } catch (error) {
      return null;
    }
  }

  async seedAchievements() {
    var newAch = new AchievementsEntity();

    //1 - a test on level
    newAch.achievementName = 'Level 1';
    newAch.achievemenDescription = 'You reached level 1';
    newAch.achievementLogo = CDN_PATH + '/siteimage/default.jpg';
    newAch = this.achievementsRepository.create(newAch);
    console.log('Seeding successful');
    // await this;

    //2 - a test on number of followed people
  }

  async updateAchievements(userid: number) {
    console.log('Trying to update achievements');
    var numOfAchievements = await this.achievementsRepository.count();

    console.log('Number of different achievements: ', numOfAchievements);

    if (numOfAchievements == 0) {
      console.log('Ooops, you have not initiated the achievement table');
      await this.seedAchievements();
    }
    
    console.log('Fetching a full user');
    const user = await this.usersService.findUserForAchievementUpdate(userid);
    console.log(user);
    let userAchievementsID: number[] = [];
    for (let i = 0; i < user.achievementsList.length; i++)
      userAchievementsID.push(user.achievementsList[i].id);
    //Every achievement should be tested...

    if (user.lvl >= 1 && !userAchievementsID.includes(1)) {
      console.log('Adding an achievement');
    }

    return [];
  }
}
