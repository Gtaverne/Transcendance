import BaseInterface from './BaseInterface';
import RoomInterface from './RoomInterface';
import GameInterface from './GameInterface';
import MessageInterface from './MessageInterface';
import MuteInterface from './MuteInterface';
import BanInterface from './BanInterface';

interface UserInterface extends BaseInterface {
  username: string;
  avatar: string;
  email: string;
  doublefa: number; //C'est important
  lvl: number;
  isOnline: boolean;
  currentGame: number;

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
  mutedInARoom?: MuteInterface[];
  bannedInARoom?: BanInterface[];
}

export default UserInterface;
