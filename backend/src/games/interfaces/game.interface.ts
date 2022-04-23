export interface Game {
  id: number;
  status: string;
  user1?: number;
  user2?: number;
  score1?: number;
  score2?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
