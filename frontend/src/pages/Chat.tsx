import axios from 'axios';
import { useEffect, useState } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import ChatOnline from '../components/ChatOnline';
import Conversation from '../components/Conversation';
import Message from '../components/Message';
import './chat.css';

function Chat() {
  const [conversations, setConversations] = useState([]);
  const { user } = useSelector((state: RootStateOrAny) => state.auth);

  if (!user) {
    console.log("Don't forgot to login");
  }

  useEffect(() => {
    // const getConversations = async () => {
    //   const res = await axios.get(
    //     process.env.REACT_APP_URL_BACK + 'rooms/user/' + user.id,
    //   );
    // };
    // getConversations();
  }, [user]);

  return (
    <>
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input placeholder="Search For Friends" className="chatMenuInput" />
            <Conversation />
            <Conversation />
            <Conversation />
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            <div className="chatBoxTop">
              <Message />
              <Message own={true} />
              <Message />
            </div>
            <div className="chatBoxBottom">
              <textarea
                className="chatMessageInput"
                placeholder="write something..."
              ></textarea>
              <button className="chatSubmitButton">Send</button>
            </div>
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline />
          </div>
        </div>
      </div>
    </>
  );
}
export default Chat;
