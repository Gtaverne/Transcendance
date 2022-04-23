import { MessagesEntity } from "src/messages/messages.entity";
import { UsersEntity } from "../users.entity";

export interface User {
  id: number;
  username: string;
  avatar?: string;
  email?: string;
  doublefa: boolean;
  lvl: number;
  createdAt?: Date;
  updatedAt?: Date;
  iFollowList?: UsersEntity[]
  followingMeList?: UsersEntity[]
  iBlockedList?: UsersEntity[]
  blockedMeList?: UsersEntity[]
  messagesList?: MessagesEntity[]
}
//? avant les ?: pour les champs optionnels
