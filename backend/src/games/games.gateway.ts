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
};

type BallDir = {
  x: number;
  y: number;
}

const lenghtBar = 7;
const border = 3.2;
const ballSize = 1;
const goal = 44.7;
const arenaWidth = 50 - border * 2;

const TOKEN_SECRET = process.env.JWT_Secret;

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
  ) {}

  @WebSocketServer()
  server: Server;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  afterInit() {}


  private socketToPlayer = new Map<string, UsersEntity>();

  private queue = new Map<string, Socket>();
  private games = new Map<number, GameProps>();
  private socketGames = new Map<string, number>();

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
  }

  private getCookieValueByName = (cookies, cookieName) => {
    if (!cookies) cookies = '';
    const match = cookies.match(new RegExp('(^| )' + cookieName + '=([^;]+)'));
    return match ? match[2] : '';
  };

  async handleConnection(client: Socket) {
    const token: string = this.getCookieValueByName(
      client.handshake.headers.cookie,
      'jwt',
    );

    try {
      const idFromToken = <number>jwt.verify(
          token,
          TOKEN_SECRET,
      );
      if (idFromToken <= 0) return;

      const user = await this.usersRepository.findOne({
        where: { id: idFromToken },
      });

      this.socketToPlayer.set(client.id, user);

      console.log(user);
    } catch (error) {
      console.log('Invalid token ' + error);
      return;
    }

    this.queue.set(client.id, client);

    if (this.queue.size >= 2) {
      console.log('Starting Match!');
      const entries = this.queue.entries();
      const id = Date.now();
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
      };
      this.queue.delete(game.userA.id);
      this.queue.delete(game.userB.id);
      this.games.set(id, game);
      this.socketGames.set(game.userA.id, id);
      this.socketGames.set(game.userB.id, id);

      const bd = this.getRandomBallDir();

      this.server
        .to(game.userA.id)
        .emit('gameStarted', 0, arenaWidth / 2, bd.x, bd.y, game.infoA.username, game.infoA.avatar, game.infoB.username, game.infoB.avatar);
      this.server
        .to(game.userB.id)
        .emit('gameStarted', 0, arenaWidth / 2, -bd.x, -bd.y, game.infoB.username, game.infoB.avatar, game.infoA.username, game.infoA.avatar);
    }
  }

  async handleDisconnect(client: Socket) {
    console.log('Disconnected');

    const game = this.getUserGame(client.id);
    if (game) {
      this.server.to(game.userA.id).disconnectSockets(true);
      this.server.to(game.userB.id).disconnectSockets(true);
    }

    this.queue.delete(client.id);
  }

  @SubscribeMessage('hitBall')
  handleHitBall(client: Socket, { ballX, ballY, velX, velY }) {
    const opponent = this.getOpponent(client.id);
    if (!opponent) return;
    this.server
      .to(opponent.id)
      .emit('ball', -ballX, arenaWidth - ballY, -velX, -velY);
  }

  @SubscribeMessage('move')
  handleMove(client: Socket, { localX }) {
    const opponent = this.getOpponent(client.id);
    if (!opponent) return;
    this.server.to(opponent.id).emit('opoMove', arenaWidth - localX);
  }

  @SubscribeMessage('tookGoal')
  handleTookGoal(client: Socket) {
    const game = this.getUserGame(client.id);
    if (game) {
      const opponent = this.getOpponent(client.id);

      if (client.id == game.userA.id) game.scoreB++;
      else game.scoreA++;

      this.server.to(opponent.id).emit('receivePoint');
      this.server.to(opponent.id).emit('ball', 0, arenaWidth / 2, 0, 0);

      setTimeout(() => {
        if (game.scoreA >= 3 || game.scoreB >= 3)
        {
          this.server.to(game.userA.id).emit('gameover');
          this.server.to(game.userB.id).emit('gameover');
          this.server.to(game.userA.id).disconnectSockets(true);
          this.server.to(game.userB.id).disconnectSockets(true);
        }
        else
        {
          const bd = this.getRandomBallDir();

          this.server.to(game.userA.id).emit('ball', 0, arenaWidth / 2, bd.x, bd.y);
          this.server.to(game.userB.id).emit('ball', 0, arenaWidth / 2, -bd.x, -bd.y);
        }
      }, 2000);
    }
  }
}
