import BanInterface from './BanInterface';
import BaseInterface from './BaseInterface';
import MessageInterface from './MessageInterface';
import MuteInterface from './MuteInterface';
import UserInterface from './UserInterface';

interface RoomInterface extends BaseInterface {
	channelName: string;
	password: string;
	category: string;
	isDm: boolean;

	muteList?: MuteInterface[];
	banList?: BanInterface[];
	messagesList?: MessageInterface[];
	accessList?: UserInterface[];
	owner?: UserInterface;
	admins?: UserInterface[];
}

export default RoomInterface;
