import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from '../users/users.entity';
import { Repository } from 'typeorm';
import { GamesEntity } from './games.entity';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require('jsonwebtoken');

type GameProps = {
  id: number;
  userA: Socket;
  userB: Socket;
  scoreA: number;
  scoreB: number;
  infoA: UsersEntity;
  infoB: UsersEntity;
  spectators: string[];
};

type BallDir = {
  x: number;
  y: number;
};

const ARENA_BORDER = 3.2;
const ARENA_WIDTH = 50 - ARENA_BORDER * 2;

const TOKEN_SECRET = process.env.JWT_Secret;

let lastIntSocket = 1000;

const WIN_SCORE = 3;

@WebSocketGateway({
  namespace: 'games',
  cors: true,
})
export class GamesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
    @InjectRepository(GamesEntity)
    private gamesRepository: Repository<GamesEntity>,
  ) {}

  @WebSocketServer()
  server: Server;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  afterInit() {}

  private socketToPlayer = new Map<string, UsersEntity>();

  private queue = new Map<string, Socket>();
  private games = new Map<number, GameProps>();
  private socketGames = new Map<string, number>();

  private listen = new Map<string, Socket>();

  private getUserGame = (user: string) => {
    const gameId = this.socketGames.get(user);
    return this.games.get(gameId);
  };

  private getOpponent = (user: string) => {
    const currentGame = this.getUserGame(user);
    if (!currentGame) return null;
    const opponent =
      currentGame.userA.id === user ? currentGame.userB : currentGame.userA;
    return opponent;
  };

  private getRandomBallDir = (): BallDir => {
    const y = 0.6 - Math.random() * 1.2;
    const x = 0.5 * (Math.random() > 0.5 ? 1 : -1);
    return { x: x, y: y };
  };

  private getCookieValueByName = (cookies, cookieName) => {
    if (!cookies) cookies = '';
    const match = cookies.match(new RegExp('(^| )' + cookieName + '=([^;]+)'));
    return match ? match[2] : '';
  };

  private sendToSpectator = (game: GameProps, name: string, ...args: any[]) => {
    game.spectators.forEach((client) => {
      this.server.to(client).emit(name, ...args);
    });
  };

  async handleConnection(client: Socket) {
    const token: string = this.getCookieValueByName(
      client.handshake.headers.cookie,
      'jwt',
    );
    try {
      const idFromToken = <number>jwt.verify(token, TOKEN_SECRET);
      if (idFromToken <= 0) throw Error();
      const user = await this.usersRepository.findOne({
        where: { id: idFromToken },
      });
      if (!user) throw Error();
      this.socketToPlayer.set(client.id, user);
    } catch (error) {
      console.log('Invalid token ' + error);
      this.server.to(client.id).disconnectSockets(true);
      return;
    }
  }

  async handleDisconnect(client: Socket) {
    console.log('Disconnected');

    const game = this.getUserGame(client.id);
    if (game) {
      this.server.to(game.userA.id).disconnectSockets(true);
      this.server.to(game.userB.id).disconnectSockets(true);
      this.games.delete(game.id);
      this.sendToSpectator(game, 'gameover');
      this.listen.forEach((value, key) => {
        this.server.to(key).emit('gameRemove', game.id);
      });
    }

    const user = this.socketToPlayer.get(client.id);
    if (user) await this.usersRepository.update(user.id!, { currentGame: 0 });

    this.queue.delete(client.id);
    this.listen.delete(client.id);
  }

  @SubscribeMessage('spectate')
  handleSpectate(client: Socket, { gameId }) {
    const game = this.games.get(parseInt(gameId));
    console.log('spectate! ' + game + ' ' + gameId);
    if (game && !game.spectators.includes(client.id)) {
      game.spectators.push(client.id);
      this.games.set(parseInt(gameId), game);
      /* eslint-disable */
      this.server.to(client.id).emit('gameStarted', 0, ARENA_WIDTH / 2, 0, 0, game.infoA.username, game.infoA.avatar, game.infoB.username, game.infoB.avatar)
      this.server.to(client.id).emit('setScore', game.scoreA, game.scoreB);
      /* eslint-enable */
    }
  }

  @SubscribeMessage('listen')
  handleListen(client: Socket) {
    this.listen.set(client.id, client);
    this.games.forEach((game) => {
      /* eslint-disable */
      this.server.to(client.id).emit('gameInfo', game.id, game.infoA.username, game.infoA.avatar, game.infoB.username, game.infoB.avatar);
      /* eslint-enable */
    });
  }

  @SubscribeMessage('joinQueue')
  handleJoinQueue(client: Socket) {
    this.queue.set(client.id, client);

    if (this.queue.size >= 2) {
      console.log('Starting Match!');
      const entries = this.queue.entries();
      const id = lastIntSocket++;
      const playerA = entries.next().value[1];
      const playerB = entries.next().value[1];
      const game: GameProps = {
        id: id,
        userA: playerA,
        userB: playerB,
        scoreA: 0,
        scoreB: 0,
        infoA: this.socketToPlayer.get(playerA.id),
        infoB: this.socketToPlayer.get(playerB.id),
        spectators: [],
      };
      this.queue.delete(game.userA.id);
      this.queue.delete(game.userB.id);
      this.games.set(id, game);
      this.listen.forEach((value, key) => {
        /* eslint-disable */
        this.server.to(key).emit('gameInfo', id, game.infoA.username, game.infoA.avatar, game.infoB.username, game.infoB.avatar);
      });
      this.socketGames.set(game.userA.id, id);
      this.socketGames.set(game.userB.id, id);

      const user = this.socketToPlayer.get(client.id);
      if (user) this.usersRepository.update(user.id!, { currentGame: id });

      const bd = this.getRandomBallDir();

      this.server.to(game.userA.id).emit('gameStarted', 0, ARENA_WIDTH / 2, bd.x, bd.y, game.infoA.username, game.infoA.avatar, game.infoB.username, game.infoB.avatar);
      this.server.to(game.userB.id).emit('gameStarted', 0, ARENA_WIDTH / 2, -bd.x, -bd.y, game.infoB.username, game.infoB.avatar, game.infoA.username, game.infoA.avatar);
    }
  }

  @SubscribeMessage('hitBall')
  handleHitBall(client: Socket, { ballX, ballY, velX, velY }) {
    const opponent = this.getOpponent(client.id);
    if (!opponent) return;
    this.server
      .to(opponent.id)
      .emit('ball', -ballX, ARENA_WIDTH - ballY, -velX, -velY);
    const game = this.getUserGame(client.id);
    /* eslint-disable */
    if (client.id == game.userA.id)
      this.sendToSpectator(game, 'ball', ballX, ballY, velX, velY);
    else
      this.sendToSpectator(game, 'ball', -ballX, ARENA_WIDTH - ballY, -velX, -velY);
    /* eslint-enable */
  }

  @SubscribeMessage('move')
  handleMove(client: Socket, { localX }) {
    const opponent = this.getOpponent(client.id);
    if (!opponent) return;
    this.server.to(opponent.id).emit('opoMove', ARENA_WIDTH - localX);
    const game = this.getUserGame(client.id);

    /* eslint-disable */
    if (client.id == game.userA.id)
      this.sendToSpectator(game, 'meMove', localX);
    else
      this.sendToSpectator(game, 'opoMove', ARENA_WIDTH - localX);
    /* eslint-enable */
  }

  @SubscribeMessage('tookGoal')
  handleTookGoal(client: Socket) {
    const game = this.getUserGame(client.id);
    if (game) {
      const opponent = this.getOpponent(client.id);

      if (client.id == game.userA.id) game.scoreB++;
      else game.scoreA++;

      this.server.to(opponent.id).emit('receivePoint');
      this.server.to(opponent.id).emit('ball', 0, ARENA_WIDTH / 2, 0, 0);
      this.sendToSpectator(game, 'ball', 0, ARENA_WIDTH / 2, 0, 0);
      this.sendToSpectator(game, 'setScore', game.scoreA, game.scoreB);

      setTimeout(() => {
        if (game.scoreA >= WIN_SCORE || game.scoreB >= WIN_SCORE) {
          this.sendToSpectator(game, 'gameover');
          this.server.to(game.userA.id).emit('gameover');
          this.server.to(game.userB.id).emit('gameover');
          this.server.to(game.userA.id).disconnectSockets(true);
          this.server.to(game.userB.id).disconnectSockets(true);

          const userA = this.socketToPlayer.get(game.userA.id);
          const userB = this.socketToPlayer.get(game.userB.id);
          if (userA) this.usersRepository.update(userA.id!, { currentGame: 0 });
          if (userB) this.usersRepository.update(userB.id!, { currentGame: 0 });

          if (game.scoreA >= WIN_SCORE)
            this.usersRepository.update(userA.id!, { lvl: userA.lvl + 1 });
          else if (game.scoreB >= WIN_SCORE)
            this.usersRepository.update(userB.id!, { lvl: userB.lvl + 1 });

          if (userA && userB) {
            const gameEntity = new GamesEntity();
            gameEntity.user1 = userA;
            gameEntity.user2 = userB;
            gameEntity.score1 = game.scoreA;
            gameEntity.score2 = game.scoreB;
            gameEntity.levelA = userA.lvl;
            gameEntity.levelB = userB.lvl;

            const newGame = this.gamesRepository.create(gameEntity);
            this.gamesRepository.save(newGame).then(() => {
              console.log("Saved!");
            });
          }

          this.games.delete(game.id);
          this.listen.forEach((value, key) => {
            this.server.to(key).emit('gameRemove', game.id);
          });
        } else {
          const bd = this.getRandomBallDir();

          this.sendToSpectator(game, 'ball', 0, ARENA_WIDTH / 2, bd.x, bd.y);
          /* eslint-disable */
          this.server.to(game.userA.id).emit('ball', 0, ARENA_WIDTH / 2, bd.x, bd.y);
          this.server.to(game.userB.id).emit('ball', 0, ARENA_WIDTH / 2, -bd.x, -bd.y);
          /* eslint-enable */
        }
      }, 2000);
    }
  }
}
