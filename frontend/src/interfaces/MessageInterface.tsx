import BaseInterface from './BaseInterface';
import UserInterface from './UserInterface';
import RoomInterface from './RoomInterface';

interface MessageInterface extends BaseInterface {
	message: string;

	owner?: UserInterface;
	room?: RoomInterface;
}

export default MessageInterface;
