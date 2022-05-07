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
import { useNavigate } from 'react-router-dom';

function Chat() {
  const [conversations, setConversations] = useState<RoomInterface[]>([]);
  const [conversationsCanJoin, setConversationsCanJoin] = useState<
    RoomInterface[]
  >([]);
  const [currentChat, setCurrentChat] = useState<RoomInterface[]>([]);
  const [currentChatAdmins, setCurrentChatAdmins] = useState<number[]>([]);
  const [currentUser, setCurrentUser] = useState<UserInterface[]>([]);
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [arrivalMessage, setArrivalMessage] = useState<MessageInterface>({
    id: -1,
    message: '',
  });
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
  const { user } = useSelector((state: RootStateOrAny) => state.auth);
  const scrollRef = useRef<HTMLDivElement>(null);
  const socket = useRef(io());
  const [conversationType, setConversationType] = useState('directMessage');
  const [convName, setConvName] = useState<string>('');
  const [convPassword, setConvPassword] = useState('');
  const [convDm, setConvDm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      socket.current = io('ws://localhost:5050', {
        // withCredentials: true,
        query: { id: user.id },
      });
    }
    socket.current.on('getTransmitMessage', (data) => {
      console.log(
        'Socket message detected',
        data.room.id,
        currentChat[0]?.id,
        data,
      );
      console.log('getTransmitMessage', currentChat[0]);
      setArrivalMessage(data);
      if (currentChat[0] && currentChat[0].id === data.room.id) {
        console.log('Message in the current room');
      }
    });
    socket.current.on('getNewRoom', (data) => {
      console.log('Socket getNewRoom detected');
      if (data.message === user.username) setTimeout(getConversations, 250);
      if (data.message === 'no') setTimeout(getConversationsCanJoin, 250);
    });
    if (currentChat[0] && currentChat[0]?.admins?.length) {
      let admins = [];
      for (let i = 0; i < currentChat[0]?.admins?.length!; i++) {
        admins.push(currentChat[0]?.admins[i].id);
      }
      setCurrentChatAdmins(admins);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChat, user]);

  useEffect(() => {
    if (arrivalMessage) {
      if (
        arrivalMessage.id !== -1 &&
        arrivalMessage.room?.id === currentChat[0]?.id
      ) {
        let foundId = false;
        for (let i = 0; i < messages.length; i++) {
          if (messages[i].id === arrivalMessage.id) {
            foundId = true;
          }
        }
        if (!foundId) {
          setMessages([...messages, arrivalMessage]);
        }
      }
    }
  }, [arrivalMessage, currentChat, messages]);

  useEffect(() => {
    socket.current.emit('addUser', user.id);
    socket.current.on('getUsers', (u) => {
      setOnlineUsers(u);
    });
  }, [user]);

  if (!user) {
    console.log("Don't forget to login");
  }

  const getConversations = async () => {
    try {
      let convLen = conversations.length;
      const res = await axios.get(
        process.env.REACT_APP_URL_BACK + 'rooms/user/' + user.id,
      );
      console.log('updatingConv');
      setConversations(res.data);
      if (currentChat[0]) {
        for (let i = 0; i < res.data.length!; i++) {
          if (res.data[i].id === currentChat[0]?.id) {
            setCurrentChat([res.data[i]]);
            console.log('UPDATING CURRENT CHAT', res.data[i].owner?.id);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getConversationsCanJoin = async () => {
    try {
      const res = await axios.get(
        process.env.REACT_APP_URL_BACK + 'rooms/canjoin/' + user.id,
      );
      setConversationsCanJoin(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getConversations();
    getConversationsCanJoin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

    if (!newMessage.length) return;

    const msg = {
      owner: user.id,
      channelId: currentChat[0].id,
      message: newMessage,
    };

    const res = await axios.post(
      process.env.REACT_APP_URL_BACK + 'messages/',
      msg,
    );

    socket.current.emit('transmitMessage', res.data);
    console.log('handleSubmit', currentChat[0]?.id);

    setMessages([...messages, res.data]);
    setNewMessage('');
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView(); // { behavior: 'smooth' }
  }, [messages]);

  const handleSubmitConv = async (e: React.FormEvent) => {
    e.preventDefault();

    const room = {
      owner: user.id,
      isDm: conversationType === 'directMessage',
      secondMemberDm: convDm,
      category: conversationType,
      channelName: convName ? convName : '-',
      password: convPassword,
    };

    const res = await axios.post(
      process.env.REACT_APP_URL_BACK + 'rooms/',
      room,
    );

    socket.current.emit('newRoom', {
      owner: user.id,
      channelId: 0,
      message: conversationType === 'directMessage' ? convDm : 'no',
    });

    if (res.data) {
      console.log('Updating conv after join');
      setTimeout(getConversations, 250);
      setTimeout(getConversationsCanJoin, 250);
    }
  };

  const handleJoin = async (convId: number, privatePassword: string) => {
    console.log(convId);

    const joinDTO = {
      owner: user.id,
      convId,
      password: privatePassword,
      private: privatePassword && privatePassword !== '' ? true : false,
    };

    const res = await axios.post(
      process.env.REACT_APP_URL_BACK + 'rooms/join/',
      joinDTO,
    );

    if (res.data) {
      console.log('Updating conv after join');
      setTimeout(getConversations, 250);
      setTimeout(getConversationsCanJoin, 250);
    }
  };

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/userprofile/' + currentUser[0]?.id);
  };

  const handleUpdateOwner = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      user,
      channelId: currentChat[0].id,
      appointedId: currentUser[0].id,
      role: 'owner',
    };

    const res = await axios.post(
      process.env.REACT_APP_URL_BACK + 'rooms/changeowner/',
      data,
    );

    if (res) {
      console.log('You are not owner anymore');
      setTimeout(getConversations, 250);
    }
  };

  return (
    <>
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <div className="chatMenuTop">
              <h3>My Conversations</h3>
              {/* <input
                placeholder="Search For Friends"
                className="chatMenuInput"
              /> */}
              {conversations.map((c, i) => (
                <div
                  onClick={() => {
                    setCurrentChat([c]);
                    setCurrentUser([]);
                  }}
                  key={i}
                >
                  <Conversation
                    key={i}
                    conversation={c}
                    currentUser={user}
                    join={false}
                    handleJoin={handleJoin}
                    currentChat={currentChat}
                  />
                </div>
              ))}
            </div>
            <div className="chatMenuMiddle">
              <h3>Join Conversations</h3>
              {/* <input
                placeholder="Search For Friends"
                className="chatMenuInput"
              /> */}
              {conversationsCanJoin.map((c, i) => (
                <div key={i}>
                  <Conversation
                    key={i}
                    conversation={c}
                    currentUser={user}
                    join={true}
                    handleJoin={handleJoin}
                    currentChat={currentChat}
                  />
                </div>
              ))}
            </div>
            <div className="chatMenuBottom">
              <h3>Create a New Conversation</h3>
              <div className="chatNewWrapper">
                <div className="chatMenuBottomLeft">
                  <div>
                    <select
                      className="conversationType"
                      value={conversationType}
                      onChange={(e) => {
                        setConversationType(e.target.value);
                      }}
                    >
                      <option value="directMessage">Direct Message</option>
                      <option value="public">Public</option>
                      <option value="passwordProtected">
                        Password Protected
                      </option>
                    </select>
                  </div>
                  {conversationType === 'public' ||
                  conversationType === 'passwordProtected' ? (
                    <div>
                      <div className="conversationNameBox">
                        <input
                          placeholder="Conversation Name"
                          id="convName"
                          value={convName}
                          onChange={(e) => {
                            setConvName(e.target.value);
                          }}
                        />
                      </div>
                      {conversationType === 'passwordProtected' && (
                        <div className="convPassword">
                          <input
                            placeholder="Conversation Password"
                            id="convPassword"
                            value={convPassword}
                            onChange={(e) => {
                              setConvPassword(e.target.value);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="convDm">
                      <input
                        placeholder="Username"
                        id="convDm"
                        value={convDm}
                        onChange={(e) => {
                          setConvDm(e.target.value);
                        }}
                      />
                    </div>
                  )}
                </div>
                <button className="convSubmitButton" onClick={handleSubmitConv}>
                  Create
                </button>
              </div>
            </div>
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
                        imageURL={m.owner?.avatar}
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
            <div className="chatOnlineTopWrapper">
              <ChatOnline
                onlineUsers={onlineUsers}
                currentId={user.id}
                setCurrentUser={setCurrentUser}
                currentUser={currentUser}
                accessList={currentChat[0]?.accessList}
                owner={currentChat[0]?.owner}
                currentChat={currentChat}
              />
            </div>
            {currentChat.length ? (
              <div className="chatOnlineBottom">
                <h3>User Informations | id{currentChat[0]?.id}</h3>
                <p>
                  {currentChatAdmins.length} admins: {currentChatAdmins}
                </p>
                {currentUser.length ? (
                  <>
                    <button
                      className="chatOnlineBottomButton"
                      onClick={handleNavigate}
                    >
                      View Profile
                    </button>
                    {!currentChat[0]?.isDm &&
                      currentChat[0]?.owner?.id === user.id &&
                      currentChat[0]?.owner?.id !== currentUser[0]?.id && (
                        <button
                          className="chatOnlineBottomButton"
                          onClick={handleUpdateOwner}
                        >
                          Set as Owner
                        </button>
                      )}
                    {!currentChat[0]?.isDm &&
                      currentChat[0]?.owner?.id === user.id &&
                      currentChat[0]?.owner?.id !== currentUser[0]?.id && (
                        <button className="chatOnlineBottomButton">
                          Set as Admin
                        </button>
                      )}
                    {currentUser[0]?.id === user.id &&
                      currentChat[0]?.owner?.id !== user.id &&
                      !currentChat[0]?.isDm && (
                        <button className="chatOnlineBottomButton">
                          Leave Room
                        </button>
                      )}
                    {currentUser[0]?.id !== user.id && (
                      <button className="chatOnlineBottomButton">
                        Block User
                      </button>
                    )}
                    <div className="contentBox">
                      <input
                        className="editPassword"
                        placeholder="Set Password"
                        id="convName"
                        // value={convName}
                        // onChange={(e) => {
                        //   setConvName(e.target.value);
                        // }}
                      />
                      <button>Validate</button>
                    </div>
                    <div className="contentBox">
                      <input
                        placeholder="Mute _ Minutes"
                        id="convName"
                        type="number"
                        // value={convName}
                        // onChange={(e) => {
                        //   setConvName(e.target.value);
                        // }}
                      />
                      <button>Mute</button>
                    </div>
                    <div className="contentBox">
                      <input
                        className="contentBox"
                        placeholder="Ban _ Minutes"
                        id="convName"
                        type="number"
                        // value={convName}
                        // onChange={(e) => {
                        //   setConvName(e.target.value);
                        // }}
                      />
                      <button>Ban</button>
                    </div>
                  </>
                ) : (
                  <span className="noUserText">
                    Select a user to view his informations.
                  </span>
                )}
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export default Chat;
