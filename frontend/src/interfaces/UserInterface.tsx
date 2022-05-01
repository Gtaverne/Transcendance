import BaseInterface from './BaseInterface';
import RoomInterface from './RoomInterface';
import GameInterface from './GameInterface';
import MessageInterface from './MessageInterface';

interface UserInterface extends BaseInterface {
  username: string;
  avatar: string;
  email: string;
  doublefa: boolean;
  lvl: number;

  iFollowList?: UserInterface[];
  followingMeList?: UserInterface[];
  iBlockedList?: UserInterface[];
  blockedMeList?: UserInterface[];
  messagesList?: MessageInterface[];
  accessToList?: RoomInterface[];
  gamePlayer1?: GameInterface[];
  gamePlayer2?: GameInterface[];
  ownedRooms?: RoomInterface[];
  administratingRooms?: RoomInterface[];
}

export default UserInterface;
