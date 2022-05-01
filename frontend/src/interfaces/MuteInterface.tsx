import BaseInterface from './BaseInterface';
import RoomInterface from './RoomInterface';
import UserInterface from './UserInterface';

interface MuteInterface extends BaseInterface {
  timestamp: Date;

  muted?: RoomInterface;
  mutedUser?: UserInterface;
}

export default MuteInterface;
