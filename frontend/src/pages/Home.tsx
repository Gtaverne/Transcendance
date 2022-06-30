// eslint-disable-next-line
import { Link, useNavigate } from 'react-router-dom';
// eslint-disable-next-line
import { RootStateOrAny, useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  Component,
} from 'react';
import GlassButton from '../components/Home/GlassButton';

import './Home.css';
import logo from './assets/logo.svg';
import chatIcon from './assets/icons/chat.svg';
import startIcon from './assets/icons/start.svg';
import leaderboardIcon from './assets/icons/leaderboard.svg';
import StartIcon from '../components/Icons/StartIcon';
import LeaderboardIcon from '../components/Icons/LeaderboardIcon';
import ChatIcon from '../components/Icons/ChatIcon';
import LogoIcon from '../components/Icons/LogoIcon';
import { logout, reset } from '../features/auth/authSlice';
import CurrentGamesIcon from '../components/Icons/CurrentGamesIcon';

function Home() {
  const [percX, setPercX] = useState(0);
  const [percY, setPercY] = useState(0);

  const { user } = useSelector((state: RootStateOrAny) => state.auth);

  const onMouseMove = (clientX: number, clientY: number) => {
    let ratioX = clientX / window.innerWidth;
    let ratioY = clientY / window.innerHeight;

    let percX = 1 - ratioX * 2;
    let percY = 1 - ratioY * 2;

    setPercX(percX);
    setPercY(percY);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/landing');
    window.location.reload();
  };

  // if (user && user.avatar && !user.avatar.includes('microcdn')) {
  //   toast.success('Welcome !\nYou can personnalize your avatar and pseudo in your profile page')
  // }

  return (
    <div onMouseMove={({ clientX, clientY }) => onMouseMove(clientX, clientY)}>
      <div className="background">
        <div className="statusbar">
          <div className="bigLogo">
            <LogoIcon />
          </div>
          <div className="userView">
            <div className="logout" onMouseUp={onLogout}>
              Logout
            </div>
            <Link
              to={'/userprofile/' + (user ? user.id : '999')}
              className="userButton"
            >
              {user && user.username && user.avatar ? (
                <div>
                  {user.username}
                  <div
                    className="userImage"
                    style={{ backgroundImage: `url(${user.avatar})` }}
                  ></div>
                </div>
              ) : (
                <div></div>
              )}
            </Link>
          </div>
        </div>

        <div className="bottom">
          <Link to="/game">
            <GlassButton title="START GAME" onClick={() => {}}>
              <StartIcon />
            </GlassButton>
          </Link>
          <Link to="/chat">
            <GlassButton title="PONGZI CHAT">
              <ChatIcon />
            </GlassButton>
          </Link>
          <Link to="/leaderboard">
            <GlassButton title="LEADERBOARD">
              <LeaderboardIcon />
            </GlassButton>
          </Link>
          <Link to="/current">
            <GlassButton title="CURRENT GAMES">
              <CurrentGamesIcon />
            </GlassButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
export default Home;
