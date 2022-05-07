import RoomInterface from '../interfaces/RoomInterface';
import UserInterface from '../interfaces/UserInterface';
import './chatOnline.css';

type ChatOnlineProps = {
  onlineUsers: number[];
  currentId: number;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserInterface[]>>;
  accessList: UserInterface[] | undefined;
  currentUser: UserInterface[];
  owner: UserInterface | undefined;
  currentChat: RoomInterface[];
};

function ChatOnline({
  onlineUsers,
  currentId,
  setCurrentUser,
  accessList,
  currentUser,
  owner,
  currentChat,
}: ChatOnlineProps) {
  //   useEffect(() => {
  //     console.log(accessList);
  //   }, [accessList]);

  return (
    <div className="chatOnline">
      {accessList?.map((a, key) => (
        <div
          className={
            currentUser[0]?.id === a.id
              ? 'chatOnlineFriend chatOnlineFriendSelected'
              : 'chatOnlineFriend'
          }
          onClick={() => {
            setCurrentUser([a]);
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
            {a.username} | id{a.id}{' '}
            {owner?.id === a.id && !currentChat[0]?.isDm && '| owner'}
          </span>
        </div>
      ))}
    </div>
  );
}
export default ChatOnline;
