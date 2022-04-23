export interface User {
  id: number;
  username: string;
  avatar?: string;
  email?: string;
  doublefa: boolean;
  lvl: number;
  createdAt?: Date;
  updatedAt?: Date;
  friendsList?: number[]
  blockedUsers?: number[]
}
//? avant les ?: pour les champs optionnels
