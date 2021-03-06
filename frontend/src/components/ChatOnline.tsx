import RoomInterface from '../interfaces/RoomInterface';
import UserInterface from '../interfaces/UserInterface';
import './chatOnline.css';

type ChatOnlineProps = {
  onlineUsers: number[];
  setCurrentUser: React.Dispatch<
    React.SetStateAction<UserInterface | undefined>
  >;
  accessList: UserInterface[] | undefined;
  currentUser: UserInterface | undefined;
  owner: UserInterface | undefined;
  currentChat: RoomInterface | undefined;
  currentChatAdmins: number[];
  currentChatMute: number[];
  currentChatBan: number[];
  iBlockList: number[];
};

function ChatOnline({
  onlineUsers,
  setCurrentUser,
  accessList,
  currentUser,
  owner,
  currentChat,
  currentChatAdmins,
  currentChatMute,
  currentChatBan,
  iBlockList,
}: ChatOnlineProps) {
  return (
    <div className="chatOnline">
      {accessList?.map((a, key) => (
        <div
          className={
            currentUser?.id === a.id
              ? 'chatOnlineFriend chatOnlineFriendSelected'
              : 'chatOnlineFriend'
          }
          onClick={() => {
            setCurrentUser(a);
          }}
          key={key}
        >
          <div className="chatOnlineImgContainer">
            <img className="chatOnlineImg" src={a.avatar} alt="" />
            <div
              className={onlineUsers.includes(a.id) ? 'chatOnlineBadge' : ''}
            ></div>
          </div>
          <span className="chatOnlineName">
            {a.username}
            {owner?.id === a.id && !currentChat?.isDm && ' | owner'}
            {currentChatAdmins.includes(a.id) &&
              !currentChat?.isDm &&
              ' | admin'}
            {currentChatMute.includes(a.id) && !currentChat?.isDm && ' | mute'}
            {currentChatBan.includes(a.id) && !currentChat?.isDm && ' | ban'}
            {iBlockList.includes(a.id) && ' | blocked'}
          </span>
        </div>
      ))}
    </div>
  );
}
export default ChatOnline;
