import { Controller, Get, Param } from '@nestjs/common';
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
  constructor(private gamesServices: GamesService) {}

  @Get('/history/:id')
  findFriends(@Param() params): Promise<any[]> {
    return this.gamesServices.getUserMatches(params.id);
  }
}
