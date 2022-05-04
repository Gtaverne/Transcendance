import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import ChatOnline from '../components/ChatOnline';
import Conversation from '../components/Conversation';
import Message from '../components/Message';
import MessageInterface from '../interfaces/MessageInterface';
import RoomInterface from '../interfaces/RoomInterface';
import './chat.css';
import { io } from 'socket.io-client';
import UserInterface from '../interfaces/UserInterface';

// export type Abc = {
//   userId: number;
//   socketId: string;
// };

function Chat() {
  const [conversations, setConversations] = useState<RoomInterface[]>([]);
  const [currentChat, setCurrentChat] = useState<RoomInterface[]>([]);
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [arrivalMessage, setArrivalMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<UserInterface[]>([]);
  const { user } = useSelector((state: RootStateOrAny) => state.auth);
  const scrollRef = useRef<HTMLDivElement>(null);
  const socket = useRef(io());

  useEffect(() => {
    socket.current = io('ws://localhost:5050');
    socket.current.on('getMessage', (data) => {
      setArrivalMessage(data);
    });
  }, []);

  useEffect(() => {
    // arrivalMessage &&
    //   currentChat?.members.include(arrivalMessage.sender) &&
    //   setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit('addUser', user.id);
    socket.current.on('getUsers', (users) => {
      setOnlineUsers(users);
    });
  }, [user]);

  //   const [socket, setSocket] = useState<any>(null);
  //   useEffect(() => {
  //     setSocket(io('ws://localhost:5050'));
  //   }, []);

  //   useEffect(() => {
  //     socket?.on('message', (message: any) => {
  //       console.log(message);
  //     });
  //   }, [socket]);
  //   console.log(socket);

  if (!user) {
    console.log("Don't forget to login");
  }

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(
          process.env.REACT_APP_URL_BACK + 'rooms/user/' + user.id,
        );
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user.id]);

  useEffect(() => {
    const getMessages = async () => {
      if (currentChat.length > 0) {
        try {
          const res = await axios.get(
            process.env.REACT_APP_URL_BACK + 'messages/' + currentChat[0].id,
          );
          setMessages(res.data);
        } catch (err) {
          console.log(err);
        }
      }
    };
    getMessages();
  }, [currentChat]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const msg = {
      owner: user.id,
      channelId: currentChat[0].id,
      message: newMessage,
    };

    // const receiverIds = currentChat[0].accessList;

    // socket.current.emit("sendMessage", {
    // 	senderId: user.id,
    // 	receiverId:
    // })

    const res = await axios.post(
      process.env.REACT_APP_URL_BACK + 'messages/',
      msg,
    );
    setMessages([...messages, res.data]);
    setNewMessage('');
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input placeholder="Search For Friends" className="chatMenuInput" />
            {conversations.map((c, i) => (
              <div onClick={() => setCurrentChat([c])} key={i}>
                <Conversation key={i} conversation={c} currentUser={user} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat.length ? (
              <>
                <div className="chatBoxTop">
                  {messages.map((m, i) => (
                    <div ref={scrollRef} key={i}>
                      <Message
                        key={i}
                        message={m}
                        own={m.owner?.id === user.id}
                      />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="write something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button className="chatSubmitButton" onClick={handleSubmit}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat.
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline onlineUsers={onlineUsers} currentId={user.id} setCurrentChat={setCurrentChat}/>
          </div>
        </div>
      </div>
    </>
  );
}
export default Chat;
