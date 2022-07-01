import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from '../users/users.entity';
import { Repository } from 'typeorm';
import { GamesEntity } from './games.entity';

type UserInfoProps = {
  score: number;
  level: number;
  id: number;
  username: string;
  avatar: string;
};

type GameCleanInfo = {
  userA: UserInfoProps;
  userB: UserInfoProps;
};

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
    @InjectRepository(GamesEntity)
    private gamesRepository: Repository<GamesEntity>,
  ) {}

  async getUserMatches(userid: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userid },
    });
    if (!user) return [];
    const games = await this.gamesRepository.find({
      where: [{ user1: user }, { user2: user }],
      relations: ['user1', 'user2'],
    });

    const retGames: GameCleanInfo[] = [];
    games.forEach((game) => {
      if (!game.user1 || !game.user2) return;
      retGames.push({
        userA: {
          score: game.score1,
          level: game.levelA,
          id: game.user1.id,
          username: game.user1.username,
          avatar: game.user1.avatar,
        },
        userB: {
          score: game.score2,
          level: game.levelB,
          id: game.user2.id,
          username: game.user2.username,
          avatar: game.user2.avatar,
        },
      });
    });
    return retGames;
  }
}
