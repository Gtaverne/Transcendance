import axios from 'axios';
import { FormEvent, useEffect, useState } from 'react';
import RoomInterface from '../interfaces/RoomInterface';
import UserInterface from '../interfaces/UserInterface';
import './conversation.css';
const imageURL =
  'https://thumbs.dreamstime.com/b/people-talking-icon-one-set-web-icons-vector-people-talking-icon-one-set-web-vector-icons-137796837.jpg';

type ConversationProps = {
  conversation: RoomInterface;
  currentUser: UserInterface;
  join: Boolean;
  handleJoin: any;
  currentChat: RoomInterface[];
};

function Conversation({
  conversation,
  currentUser,
  join,
  handleJoin,
  currentChat,
}: ConversationProps) {
  const [users, setUsers] = useState<UserInterface[]>([]);
  const [image, setImage] = useState<string>(imageURL);
  const [userDm, setUserDm] = useState('');
  const [conversationName, setConversationName] = useState<string>('');

  useEffect(() => {
    const getUsers = async () => {
      const res = await axios.get(
        process.env.REACT_APP_URL_BACK + 'rooms/users/' + conversation.id,
      );
      setUsers(res.data);
      //   console.log(res.data);
    };
    getUsers();
  }, [conversation, currentUser]);

  useEffect(() => {
    if (users.length == 2 && conversation.isDm === true) {
      if (users[0].username === currentUser.username) {
        setConversationName(users[1].username);
        if (users[1].avatar !== 'oui') setImage(users[1].avatar);
      } else {
        setConversationName(users[0].username);
        if (users[0].avatar !== 'oui') setImage(users[0].avatar);
      }
    } else {
      setConversationName(conversation.channelName);
      setImage(imageURL);
    }
  }, [users]);

  const handleJoinTemp = async (e: React.FormEvent) => {
    e.preventDefault();
    handleJoin(conversation.id);
  };

  return (
    <div
      className={
        join
          ? 'conversationJoin'
          : currentChat[0]?.id === conversation.id
          ? 'conversationIn'
          : 'conversation'
      }
    >
      <img className="conversationImg" src={image} />
      <span className="conversationName">{conversationName}</span>
      {join && (
        <button
          className="joinConvButton"
          value={conversation.id}
          onClick={handleJoinTemp}
        >
          Join
        </button>
      )}
    </div>
  );
}
export default Conversation;
