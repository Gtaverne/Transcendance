import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

type GameProps = {
  id: number;
  userA: Socket;
  userB: Socket;
  scoreA: number;
  scoreB: number;
};

const lenghtBar = 7;
const border = 3.2;
const ballSize = 1;
const goal = 44.7;
const arenaWidth = 50 - border * 2;

@WebSocketGateway({
  namespace: 'games',
  cors: true,
})
export class GamesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  afterInit() {}

  private queue = new Map<string, Socket>();
  private games = new Map<number, GameProps>();
  private socketGames = new Map<string, number>();

  private getUserGame = (user: string) =>
  {
    const gameId = this.socketGames.get(user);
    return this.games.get(gameId);
  }

  private getOpponent = (user: string) =>
  {
    const currentGame = this.getUserGame(user);
    const opponent = currentGame.userA.id === user ? currentGame.userB : currentGame.userA;
    return opponent;
  }

  async handleConnection(client: Socket, query: string) {
    console.log('Connected ' + client.id);
    this.queue.set(client.id, client);

    if (this.queue.size >= 2)
    {
      console.log('Starting Match!');
      const entries = this.queue.entries();
      const id = Date.now();
      const game: GameProps = {
        id: id,
        userA: entries.next().value[1],
        userB: entries.next().value[1],
        scoreA: 0,
        scoreB: 0,
      };
      this.queue.delete(game.userA.id);
      this.queue.delete(game.userB.id);
      this.games.set(id, game);
      this.socketGames.set(game.userA.id, id);
      this.socketGames.set(game.userB.id, id);

      this.server.to(game.userA.id).emit('gameStarted', 0, arenaWidth/2, 0.4, 0.4);
      this.server.to(game.userB.id).emit('gameStarted', 0, arenaWidth/2, -0.4, -0.4);
    }
  }

  async handleDisconnect(client: Socket) {
    console.log('Disconnected');
    this.queue.delete(client.id);
  }

  @SubscribeMessage('hitBall')
  handleHitBall(client: Socket, { ballX, ballY, velX, velY }) {
    const opponent = this.getOpponent(client.id);
    this.server.to(opponent.id).emit('ball', -ballX, arenaWidth - ballY, -velX, -velY);
  }

  @SubscribeMessage('move')
  handleMove(client: Socket, { localX }) {
    const opponent = this.getOpponent(client.id);
    this.server.to(opponent.id).emit('opoMove', arenaWidth - localX);
  }

  @SubscribeMessage('tookGoal')
  handleTookGoal(client: Socket) {
    const game = this.getUserGame(client.id);
    if (game)
    {
        const opponent = this.getOpponent(client.id);

        if (client.id == game.userA.id)
            game.scoreB++;
        else
            game.scoreA++;

        this.server.to(opponent.id).emit('receivePoint');
        this.server.to(opponent.id).emit('ball', 0, arenaWidth/2, 0, 0);

        setTimeout(() => {
            this.server.to(game.userA.id).emit('ball', 0, arenaWidth/2, 0.4, 0.4);
            this.server.to(game.userB.id).emit('ball', 0, arenaWidth/2, -0.4, -0.4);
        }, 2000);

    }
  }


}
