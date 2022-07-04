import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { ListCollectionsOptions, Repository } from 'typeorm';
import { CreateAchievementDTO } from './dto/create-achievement.dto';
import { AchievementsEntity } from './achievements.entity';


// A modifier
// const CDN_PATH = 'http://localhost:3000/api/microcdn/content';
const FRONT_DOMAIN = process.env.FRONT_DOMAIN;

const CDN_PATH = FRONT_DOMAIN+'/api/microcdn/content';


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
    //DROP TABLE OF ACHIEVEMENTS IF THE RIGHT NUMBER OF ACHIEVEMENTS IS NOT PRESENT

    //1 - a test on level
    var newAch = await this.achievementsRepository.create();
    newAch.achievementName = 'Level 1';
    newAch.achievementDescription = 'You reached level 1';
    newAch.achievementLogo = CDN_PATH + '/achievementdefault';
    newAch = await this.achievementsRepository.save(newAch);

    //2 - a test on high level
    newAch = await this.achievementsRepository.create();
    newAch.achievementName = 'Level 10';
    newAch.achievementDescription = 'You reached level 10';
    newAch.achievementLogo = CDN_PATH + '/achievementdefault';
    newAch = await this.achievementsRepository.save(newAch);

    //3 - a test on number of followed people
    newAch = await this.achievementsRepository.create();
    newAch.achievementName = '1 Following';
    newAch.achievementDescription = 'You follow one person, are you a stalker?';
    newAch.achievementLogo = CDN_PATH + '/achievementdefault';
    newAch = await this.achievementsRepository.save(newAch);

    //4 - Test on messages sent
    newAch = await this.achievementsRepository.create();
    newAch.achievementName = '10 messages';
    newAch.achievementDescription = 'You sent 10 messages';
    newAch.achievementLogo = CDN_PATH + '/achievementdefault';
    newAch = await this.achievementsRepository.save(newAch);
  }

  async updateAchievements(userid: number) {
    var numOfAchievements = await this.achievementsRepository.count();

    if (numOfAchievements == 0) {
      console.log('Ooops, you have not initiated the achievement table');
      const res = await this.seedAchievements();
      console.log(res);
    }

    const user = await this.usersService.findUserForAchievementUpdate(userid);
    let userAchievementsID: number[] = [];
    for (let i = 0; i < user.achievementsList.length; i++)
      userAchievementsID.push(user.achievementsList[i].id);

    //Every achievement should be tested. It depends on the seeding
    if (user.lvl >= 1 && !userAchievementsID.includes(1)) {
      userAchievementsID.push(1);
      const ach = await this.achievementsRepository.findOne(1, {
        relations: ['achievers'],
      });
      ach.achievers.push(user);
      await this.achievementsRepository.save(ach);
    }

    if (user.lvl >= 10 && !userAchievementsID.includes(2)) {
      userAchievementsID.push(2);
      const ach = await this.achievementsRepository.findOne(2, {
        relations: ['achievers'],
      });
      ach.achievers.push(user);
      await this.achievementsRepository.save(ach);
    }

    if (user.iFollowList.length >= 1 && !userAchievementsID.includes(3)) {
      userAchievementsID.push(3);
      const ach = await this.achievementsRepository.findOne(3, {
        relations: ['achievers'],
      });
      ach.achievers.push(user);
      await this.achievementsRepository.save(ach);
    }

    if (user.messagesList.length >= 10 && !userAchievementsID.includes(4)) {
      userAchievementsID.push(4);
      const ach = await this.achievementsRepository.findOne(4, {
        relations: ['achievers'],
      });

      ach.achievers.push(user);
      await this.achievementsRepository.save(ach);
    }

    const update = await this.usersService.findUserForAchievementUpdate(userid);

    return update.achievementsList;
  }
}
