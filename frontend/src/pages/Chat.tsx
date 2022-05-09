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

declare var global: any;

function Chat() {
  const [conversations, setConversations] = useState<RoomInterface[]>([]);
  const [conversationsCanJoin, setConversationsCanJoin] = useState<
    RoomInterface[]
  >([]);
  const [currentChat, setCurrentChat] = useState<RoomInterface[]>([]);
  const [currentChatAdmins, setCurrentChatAdmins] = useState<number[]>([]);
  const [currentChatMute, setCurrentChatMute] = useState<number[]>([]);
  const [currentChatBan, setCurrentChatBan] = useState<number[]>([]);
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
  const [changePassword, setChangePassword] = useState('');
  const [usernameInvite, setUsernameInvite] = useState('');
  const [ban, setBan] = useState(0);
  const [mute, setMute] = useState(0);
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
      setArrivalMessage(data);
      if (currentChat[0] && currentChat[0].id === data.room.id) {
        console.log('Message in the current room');
      }
    });
    socket.current.on('getNewInfo', (data) => {
      console.log('Socket getNewInfo detected', currentChat.length);
      setTimeout(getConversations, 250);
      setTimeout(getConversationsCanJoin, 250);
    });
    if (currentChat[0] && currentChat[0]?.admins?.length) {
      setAdmins(currentChat[0]);
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
      const res = await axios.get(
        process.env.REACT_APP_URL_BACK + 'rooms/user/' + user.id,
      );
      setConversations(res.data);
      if (currentChat[0]) {
        console.log(1, 'updating current chat infos');
        for (let i = 0; i < res.data.length!; i++) {
          console.log(1.5, 'updating current chat infos');
          if (res.data[i].id === currentChat[0]?.id) {
            setCurrentChat([res.data[i]]);
            global.currentChat = res.data[i];
            setAdmins(res.data[i]);
            console.log(2, 'updating current chat infos', res.data[i].id);
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

    if (!newMessage.length || newMessage.length >= 300) return;

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

    setMessages([...messages, res.data]);
    setNewMessage('');
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView(); // { behavior: 'smooth' }
  }, [messages]);

  const refreshOthers = async () => {
    socket.current.emit('newInfo', {
      owner: user.id,
      channelId: 0,
      message: '-',
    });
  };

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

    socket.current.emit('newInfo', {
      owner: user.id,
      channelId: 0,
      message: conversationType === 'directMessage',
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

  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      user,
      channelId: currentChat[0].id,
      appointedId: currentUser[0].id,
      role: 'admin',
    };

    const res = await axios.post(
      process.env.REACT_APP_URL_BACK + 'rooms/changeadmin/',
      data,
    );

    if (res) {
      console.log('Admin list updated');
      setTimeout(getConversations, 250);
    }
  };

  const setAdmins = (c: RoomInterface) => {
    if (!currentChat[0]) return;
    let now = new Date();
    let adminList: number[] = [];
    let muteList: number[] = [];
    let banList: number[] = [];
    c.admins?.forEach((a) => adminList.push(a.id));
    c.muteList?.forEach((a) => {
      if (now < new Date(a.timestamp)) muteList.push(a.mutedUser?.id!);
    });
    c.banList?.forEach((a) => {
      if (now < new Date(a.timestamp)) banList.push(a.banedUser?.id!);
    });
    setCurrentChatAdmins(adminList);
    setCurrentChatMute(muteList);
    setCurrentChatBan(banList);
  };

  const handleLeaveRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await axios.post(
      process.env.REACT_APP_URL_BACK + 'rooms/leaveroom/',
      {
        user,
        channelId: currentChat[0].id,
        appointedId: 0,
        role: 'leave',
      },
    );
    if (res) {
      console.log('successfully left the room');
      setTimeout(getConversations, 250);
      setTimeout(getConversationsCanJoin, 250);
	  global.currentChat = [];

    }
  };

  const handleBlockUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await axios.post(
      process.env.REACT_APP_URL_BACK + 'users/blockuser/',
      {
        user,
        channelId: 0,
        appointedId: currentUser[0].id,
        role: 'block',
      },
    );
    if (res) {
      console.log('successfully blocked user');
      setTimeout(getConversations, 250);
      setTimeout(getConversationsCanJoin, 250);
      //update current chat ? & blocked list ? a partir de user ?
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await axios.post(
      process.env.REACT_APP_URL_BACK + 'rooms/changepassword/',
      {
        user,
        channelId: currentChat[0].id,
        appointedId: changePassword ? 0 : -1,
        role: changePassword ? changePassword : '-',
      },
    );
    if (res) {
      setTimeout(getConversations, 250);
      setChangePassword('Success');
    } else {
      setChangePassword('Fail');
    }
  };

  const handleMute = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await axios.post(
      process.env.REACT_APP_URL_BACK + 'rooms/mute/',
      {
        user,
        channelId: currentChat[0].id,
        appointedId: currentUser[0].id,
        role: 'mute',
        time: mute ? mute : 0,
      },
    );
    if (res) {
      console.log('successfully muted');
      setTimeout(getConversations, 250);
    }
  };

  const handleBan = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await axios.post(
      process.env.REACT_APP_URL_BACK + 'rooms/ban/',
      {
        user,
        channelId: currentChat[0].id,
        appointedId: currentUser[0].id,
        role: 'ban',
        time: ban ? ban : 0,
      },
    );
    if (res) {
      console.log('successfully band');
      setTimeout(getConversations, 250);
    }
  };

  const handleUsernameInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await axios.post(
      process.env.REACT_APP_URL_BACK + 'rooms/invite/',
      {
        user,
        channelId: currentChat[0].id,
        appointedId: 0,
        role: usernameInvite ? usernameInvite : '',
      },
    );
    if (res) {
      console.log('successfully invited');
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
                    setAdmins(c);
                    setChangePassword('');
                    setUsernameInvite('');
                    setMute(0);
                    setBan(0);
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
                      <option value="private">Private</option>
                      <option value="passwordProtected">
                        Password Protected
                      </option>
                    </select>
                  </div>
                  {conversationType !== 'directMessage' ? (
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
                {!currentChatMute.includes(user.id) && (
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
                )}
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
              {currentChat.length ? (
                <div className="buttonOnlineTopWrapper">
                  <button
                    className="chatOnlineBottomButton"
                    onClick={getConversations}
                  >
                    Refresh Roles
                  </button>
                </div>
              ) : (
                ''
              )}
              <ChatOnline
                onlineUsers={onlineUsers}
                currentId={user.id}
                setCurrentUser={setCurrentUser}
                currentUser={currentUser}
                accessList={currentChat[0]?.accessList}
                owner={currentChat[0]?.owner}
                currentChat={currentChat}
                currentChatAdmins={currentChatAdmins}
                currentChatMute={currentChatMute}
                currentChatBan={currentChatBan}
              />
            </div>
            {currentChat.length ? (
              <div className="chatOnlineBottom">
                <h3>User Informations | id{currentChat[0]?.id}</h3>
                {/* <p>
                  {currentChatAdmins.length} admins: {currentChatAdmins}
                </p>
                <p>
                  {currentChatMute.length} mute: {currentChatMute}
                </p>
                <p>
                  {currentChatBan.length} ban: {currentChatBan}
                </p> */}
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
                      currentChat[0]?.owner?.id === user.id && (
                        <button
                          className="chatOnlineBottomButton"
                          onClick={handleUpdateAdmin}
                        >
                          {currentChatAdmins.includes(currentUser[0]?.id)
                            ? 'Remove from Admin'
                            : 'Set as Admin'}
                        </button>
                      )}
                    {currentUser[0]?.id === user.id &&
                      currentChat[0]?.owner?.id !== user.id &&
                      !currentChat[0]?.isDm && (
                        <button
                          className="chatOnlineBottomButton"
                          onClick={handleLeaveRoom}
                        >
                          Leave Room
                        </button>
                      )}
                    {currentUser[0]?.id !== user.id && (
                      <button className="chatOnlineBottomButton">
                        Block User
                      </button>
                    )}
                    {(currentChatAdmins.includes(user.id) ||
                      currentChat[0]?.owner?.id === user.id) &&
                      !currentChatAdmins.includes(currentUser[0]?.id) &&
                      currentChat[0]?.owner?.id !== currentUser[0]?.id &&
                      !currentChat[0]?.isDm && (
                        <>
                          <div className="contentBox">
                            <input
                              placeholder="Minutes"
                              id="mute"
                              type="number"
                              value={mute === 0 ? '' : mute}
                              onChange={(e) => {
                                setMute(e.target.valueAsNumber);
                              }}
                            />
                            <button onClick={handleMute}>Mute</button>
                          </div>
                          <div className="contentBox" onClick={handleBan}>
                            <input
                              className="contentBox"
                              placeholder="Minutes"
                              id="ban"
                              type="number"
                              value={ban === 0 ? '' : ban}
                              onChange={(e) => {
                                setBan(e.target.valueAsNumber);
                              }}
                            />
                            <button>Ban</button>
                          </div>
                        </>
                      )}
                  </>
                ) : (
                  <span className="noUserText">
                    Select a user to view his informations.
                  </span>
                )}
                {user.id === currentChat[0].owner?.id &&
                  !currentChat[0]?.isDm &&
                  currentChat[0].category !== 'private' && (
                    <div className="contentBox">
                      <input
                        className="editPassword"
                        placeholder="Password"
                        id="changePassword"
                        value={changePassword}
                        onChange={(e) => {
                          setChangePassword(e.target.value);
                        }}
                      />
                      <button onClick={handleChangePassword}>Validate</button>
                    </div>
                  )}
                {!currentChat[0]?.isDm && (
                  <div className="contentBox">
                    <input
                      className="editPassword"
                      placeholder="Username"
                      id="usernameInvite"
                      value={usernameInvite}
                      onChange={(e) => {
                        setUsernameInvite(e.target.value);
                      }}
                    />
                    <button onClick={handleUsernameInvite}>Invite</button>
                  </div>
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
