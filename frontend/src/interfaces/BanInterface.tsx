import BaseInterface from './BaseInterface';
import RoomInterface from './RoomInterface';
import UserInterface from './UserInterface';

interface BanInterface extends BaseInterface {
  timestamp: Date;

  baned?: RoomInterface;
  banedUser?: UserInterface;
}

export default BanInterface;
