import RoomInterface from '../interfaces/RoomInterface';
import UserInterface from '../interfaces/UserInterface';
import './chatOnline.css';
const imageURL = 'https://cdn.intra.42.fr/users/small_ttranche.jpg';

type ChatOnlineProps = {
  onlineUsers: UserInterface[];
  currentId: number;
  setCurrentChat: React.Dispatch<React.SetStateAction<RoomInterface[]>>;
};

function ChatOnline({ onlineUsers, currentId, setCurrentChat }: ChatOnlineProps) {

  return (
    <div className="chatOnline">
      <div className="chatOnlineFriend">
        <div className="chatOnlineImgContainer">
          <img className="chatOnlineImg" src={imageURL} alt="" />
          <div className="chatOnlineBadge"></div>
        </div>
        <span className="chatOnlineName">ttranche</span>
      </div>
      <div className="chatOnlineFriend">
        <div className="chatOnlineImgContainer">
          <img className="chatOnlineImg" src={imageURL} alt="" />
          <div className="chatOnlineBadge"></div>
        </div>
        <span className="chatOnlineName">ttranche</span>
      </div>
      <div className="chatOnlineFriend">
        <div className="chatOnlineImgContainer">
          <img className="chatOnlineImg" src={imageURL} alt="" />
          <div className="chatOnlineBadge"></div>
        </div>
        <span className="chatOnlineName">ttranche</span>
      </div>
    </div>
  );
}
export default ChatOnline;
