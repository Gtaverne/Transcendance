import axios from 'axios';
import apiGetter from '../features/apicalls/apiGetter';
import apiPoster from '../features/apicalls/apiPoster';
import React, { useEffect, useRef, useState } from 'react';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import ChatOnline from '../components/ChatOnline';
import Conversation from '../components/Conversation';
import Message from '../components/Message';
import MessageInterface from '../interfaces/MessageInterface';
import RoomInterface from '../interfaces/RoomInterface';
import './chat.css';
import { io } from 'socket.io-client';
import UserInterface from '../interfaces/UserInterface';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

declare var global: { currentChat: RoomInterface | undefined };

function Chat() {
  const [conversations, setConversations] = useState<RoomInterface[]>([]);
  const [conversationsCanJoin, setConversationsCanJoin] = useState<
    RoomInterface[]
  >([]);
  const [currentChat, setCurrentChat] = useState<RoomInterface | undefined>(
    undefined,
  );
  const [currentChatAdmins, setCurrentChatAdmins] = useState<number[]>([]);
  const [currentChatMute, setCurrentChatMute] = useState<number[]>([]);
  const [currentChatBan, setCurrentChatBan] = useState<number[]>([]);
  const [currentUser, setCurrentUser] = useState<UserInterface | undefined>(
    undefined,
  );
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [arrivalMessage, setArrivalMessage] = useState<MessageInterface>({
    id: -1,
    message: '',
  });
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
  const { user, iBlockList: iBlockListAuth } = useSelector(
    (state: RootStateOrAny) => state.auth,
  );
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
  const [iBlockList, setIBlockList] = useState<number[]>([]);
  const [, updateState] = React.useState({});
  const forceUpdate = React.useCallback(() => updateState({}), []);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      console.log('SEND CONN SOCKETT');
      socket.current = io('http://localhost:3000/chat', {
        // withCredentials: true,
        // path: 'http://localhost:3000/socket.io',
        query: { id: user.id },
        transports: ['websocket', 'polling'],
        forceNew: true,
      });
    }

    socket.current.on('connect_error', (e) => {
      // revert to classic upgrade
      //socket.io.opts.transports = ["polling", "websocket"];
      console.log('ERROROR');
    });

    socket.current.on('getTransmitMessage', (data) => {
      console.log(
        'Socket message detected',
        data.room.id,
        currentChat?.id,
        data,
      );
      setArrivalMessage(data);
      if (currentChat && currentChat.id === data.room.id) {
        console.log('Message in the current room');
      }
    });
    socket.current.on('getNewInfo', (data) => {
      console.log('Socket getNewInfo detected', currentChat);
      setTimeout(getConversations, 250);
      setTimeout(getConversationsCanJoin, 250);
    });
    if (currentChat && currentChat?.admins?.length) {
      setRoleList(currentChat);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChat, user]);

  useEffect(() => {
    if (arrivalMessage) {
      if (
        arrivalMessage.id !== -1 &&
        arrivalMessage.room?.id === currentChat?.id
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
    console.log('NES SOCKET ADD GET USERS');
  }, [user]);

  if (!user) {
    console.log("Don't forget to login");
  }

  const getConversations = async () => {
    const res = await apiGetter('rooms/user/' + user.id);
    setConversations(res.data);
    console.log('getConversations', global.currentChat);
    if (global.currentChat) {
      console.log(1, 'updating current chat infos', res.data.length);
      for (let i = 0; i < res.data.length; i++) {
        // console.log(1.5, 'updating current chat infos');
        if (res.data[i].id === global.currentChat?.id) {
          setCurrentChat(res.data[i]);
          global.currentChat = res.data[i];
          setRoleList(res.data[i]);
          console.log(2, 'updating current chat infos', res.data[i].id);
        }
      }
    }
  };

  const getConversationsCanJoin = async () => {
    try {
      const res = await apiGetter('rooms/canjoin/' + user.id);
      setConversationsCanJoin(res.data);
      for (let i = 0; i < res.data.length; i++)
        if (res.data[i].id === currentChat?.id) {
          setCurrentChat(undefined);
          global.currentChat = undefined;
        }
    } catch (err) {
      console.log(err);
    }
  };

  const getIBlockList = async () => {
    try {
      const res = await apiGetter('users/blocked/' + user.id);
      setIBlockList(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getConversations();
    getConversationsCanJoin();
    global.currentChat = undefined;
    getIBlockList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const getMessages = async () => {
      if (currentChat) {
        try {
          const res = await apiGetter('messages/' + currentChat?.id);
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
      channelId: currentChat?.id,
      message: newMessage,
    };

    const res = await apiPoster('messages/', msg);

    socket.current.emit('transmitMessage', res.data);
    console.log('SOCKET SEND MESSAGE');

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
    console.log('SOCKET REFRESH');
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

    const res = await apiPoster('rooms/', room);

    socket.current.emit('newInfo', {
      owner: user.id,
      channelId: 0,
      message: conversationType === 'directMessage',
    });

    if (res.data) {
      console.log('Updating conv after join');
      refreshOthers();
      setTimeout(getConversations, 250);
      setTimeout(getConversationsCanJoin, 250);
    }
  };

  const handleJoin = async (convId: number, privatePassword: string) => {
    const joinDTO = {
      owner: user.id,
      convId,
      password: privatePassword,
      private: privatePassword && privatePassword !== '' ? true : false,
    };

    const res = await apiPoster('rooms/join/', joinDTO);

    if (res.data) {
      console.log('Updating conv after join');
      refreshOthers();
      setTimeout(getConversations, 250);
      setTimeout(getConversationsCanJoin, 250);
    } else {
      console.log('Access Unauthorized');
    }
  };

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/userprofile/' + currentUser?.id);
  };

  const handleUpdateOwner = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      user,
      channelId: currentChat?.id,
      appointedId: currentUser?.id,
      role: 'owner',
    };

    const res = await apiPoster('rooms/changeowner/', data);

    if (res) {
      toast.success('Success');
      refreshOthers();
      setTimeout(getConversations, 250);
    }
  };

  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      user,
      channelId: currentChat?.id,
      appointedId: currentUser?.id,
      role: 'admin',
    };

    const res = await apiPoster('rooms/changeadmin/', data);

    if (res) {
      toast.success('Success');
      refreshOthers();
      setTimeout(getConversations, 250);
      //   setRoleList(currentChat!);
    }
  };

  const setRoleList = (c: RoomInterface) => {
    if (!currentChat) return;
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
    forceUpdate();
  };

  const handleLeaveRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await apiPoster('rooms/leaveroom/', {
      user,
      channelId: currentChat?.id,
      appointedId: 0,
      role: 'leave',
    });
    if (res) {
      toast.success('Room Left Successfully');
      setTimeout(getConversations, 250);
      setTimeout(getConversationsCanJoin, 250);
      global.currentChat = undefined;
      setCurrentChat(undefined);
    }
  };

  const handleBlockUser = async (e: React.FormEvent) => {
    // e.preventDefault();
    // dispatch(edit({ id: user.id, field: 'block', value: currentUser?.id }));
    // return;

    let val: any = currentUser?.id ? currentUser?.id : 0;
    let alreadyBlocked;

    if (iBlockList.includes(val)) alreadyBlocked = true;
    else alreadyBlocked = false;

    const res = await apiPoster('users/blockuser/', {
      user,
      channelId: currentChat?.id,
      appointedId: currentUser?.id,
      role: 'block',
    });
    if (res && alreadyBlocked) {
      console.log('successfully unblocked user');
      let temp = iBlockList;
      const index = temp.indexOf(val);
      if (index > -1) {
        temp.splice(index, 1);
      }
      setIBlockList(temp);
      console.log(iBlockList, temp);
      forceUpdate();
    } else if (res && !alreadyBlocked) {
      console.log('successfully blocked user');
      setIBlockList([...iBlockList, val]);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await apiPoster('rooms/changepassword/', {
      user,
      channelId: currentChat?.id,
      appointedId: changePassword ? 0 : -1,
      role: changePassword ? changePassword : '-',
    });
    if (res) {
      setTimeout(getConversations, 250);
      refreshOthers();
      toast.success('Password Updated');
    } else {
      setChangePassword('Fail');
    }
  };

  const handleMute = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await apiPoster('rooms/mute/', {
      user,
      channelId: currentChat?.id,
      appointedId: currentUser?.id,
      role: 'mute',
      time: mute ? mute : 0,
    });
    if (res) {
      toast.success('Successfully Muted');
      refreshOthers();
      setTimeout(getConversations, 250);
    }
  };

  const handleBan = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await apiPoster('rooms/ban/', {
      user,
      channelId: currentChat?.id,
      appointedId: currentUser?.id,
      role: 'ban',
      time: ban ? ban : 0,
    });
    if (res) {
      toast.success('Successfully Ban');
      refreshOthers();
      setTimeout(getConversations, 250);
    }
  };

  const handleUsernameInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await apiPoster('rooms/invite/', {
      user,
      channelId: currentChat?.id,
      appointedId: 0,
      role: usernameInvite ? usernameInvite : '',
    });
    if (res) {
      toast.success('Invitation Successfull');
      refreshOthers();
      setTimeout(getConversations, 250);
    }
  };

  const handleKeypress = async (e: any) => {
    if (e.key === 'Enter') handleSubmit(e);
  };

  return (
    <>
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <div className="chatMenuTop">
              <h3>My Conversations {currentChat?.id}</h3>
              {/* <input
                placeholder="Search For Friends"
                className="chatMenuInput"
              /> */}
              {conversations.map((c, i) => (
                <div
                  onClick={() => {
                    setCurrentChat(c);
                    global.currentChat = c;
                    setCurrentUser(undefined);
                    setRoleList(c);
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
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages.map((m, i) => (
                    <div ref={scrollRef} key={i}>
                      <Message
                        key={i}
                        message={m}
                        own={m.owner?.id === user.id}
                        imageURL={m.owner?.avatar}
                        iBlockList={iBlockList}
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
                      onKeyPress={handleKeypress}
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
              {currentChat ? (
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
                accessList={currentChat?.accessList}
                owner={currentChat?.owner}
                currentChat={currentChat}
                currentChatAdmins={currentChatAdmins}
                currentChatMute={currentChatMute}
                currentChatBan={currentChatBan}
                iBlockList={iBlockList}
              />
            </div>
            {currentChat ? (
              <div className="chatOnlineBottom">
                <h3>User Informations | id{currentChat?.id}</h3>
                {/* <p>
                  {currentChatAdmins.length} admins: {currentChatAdmins}
                </p>
                <p>
                  {currentChatMute.length} mute: {currentChatMute}
                </p>
                <p>
                  {currentChatBan.length} ban: {currentChatBan}
                </p> */}
                {currentUser ? (
                  <>
                    <button
                      className="chatOnlineBottomButton"
                      onClick={handleNavigate}
                    >
                      View Profile
                    </button>
                    {!currentChat?.isDm &&
                      currentChat?.owner?.id === user.id &&
                      currentChat?.owner?.id !== currentUser?.id && (
                        <button
                          className="chatOnlineBottomButton"
                          onClick={handleUpdateOwner}
                        >
                          Set as Owner
                        </button>
                      )}
                    {!currentChat?.isDm && currentChat?.owner?.id === user.id && (
                      <button
                        className="chatOnlineBottomButton"
                        onClick={handleUpdateAdmin}
                      >
                        {currentChatAdmins.includes(currentUser?.id)
                          ? 'Remove from Admin'
                          : 'Set as Admin'}
                      </button>
                    )}
                    {currentUser?.id === user.id &&
                      currentChat?.owner?.id !== user.id &&
                      !currentChat?.isDm && (
                        <button
                          className="chatOnlineBottomButton"
                          onClick={handleLeaveRoom}
                        >
                          Leave Room
                        </button>
                      )}
                    {currentUser?.id !== user.id && (
                      <button
                        className="chatOnlineBottomButton"
                        onClick={handleBlockUser}
                      >
                        {iBlockList.includes(currentUser.id)
                          ? 'Unblock User'
                          : 'Block User'}
                      </button>
                    )}
                    {(currentChatAdmins.includes(user.id) ||
                      currentChat?.owner?.id === user.id) &&
                      !currentChatAdmins.includes(currentUser?.id) &&
                      currentChat?.owner?.id !== currentUser?.id &&
                      !currentChat?.isDm && (
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
                          <div className="contentBox">
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
                            <button onClick={handleBan}>Ban</button>
                          </div>
                        </>
                      )}
                  </>
                ) : (
                  <span className="noUserText">
                    Select a user to view his informations.
                  </span>
                )}
                {user.id === currentChat.owner?.id &&
                  !currentChat.isDm &&
                  currentChat.category !== 'private' && (
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
                {!currentChat?.isDm && (
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
