import BaseInterface from './BaseInterface';
import UserInterface from './UserInterface';

interface GameInterface extends BaseInterface {
  status: string;
  score1: number;
  score2: number;

  user1?: UserInterface;
  user2?: UserInterface;
}

export default GameInterface;
