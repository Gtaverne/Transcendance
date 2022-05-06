import { useEffect } from 'react';
import RoomInterface from '../interfaces/RoomInterface';
import UserInterface from '../interfaces/UserInterface';
import './chatOnline.css';
const imageURL = 'https://cdn.intra.42.fr/users/small_ttranche.jpg';

type ChatOnlineProps = {
  onlineUsers: number[];
  currentId: number;
  setCurrentChat: React.Dispatch<React.SetStateAction<RoomInterface[]>>;
  accessList: UserInterface[] | undefined;
};

function ChatOnline({
  onlineUsers,
  currentId,
  setCurrentChat,
  accessList,
}: ChatOnlineProps) {
//   useEffect(() => {
//     console.log(accessList);
//   }, [accessList]);

  return (
    <div className="chatOnline">
      {accessList?.map((a, key) => (
        <div className="chatOnlineFriend" key={key}>
          <div className="chatOnlineImgContainer">
            <img className="chatOnlineImg" src={a.avatar} alt="" />
            <div className={(onlineUsers.includes(a.id)) ? "chatOnlineBadge" : ""}></div>
          </div>
          <span className="chatOnlineName">{a.username} | id{a.id}</span>
        </div>
      ))}
    </div>
  );
}
export default ChatOnline;
