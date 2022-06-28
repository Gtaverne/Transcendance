// eslint-disable-next-line
import { Link, useNavigate } from 'react-router-dom';
// eslint-disable-next-line
import { RootStateOrAny, useSelector, useDispatch } from 'react-redux';
import {toast} from 'react-toastify'

import React, { useState, useEffect, useLayoutEffect, useRef, Component } from 'react';
import GlassButton from '../components/Home/GlassButton'

import './Home.css';
import logo from './assets/logo.svg';
import chatIcon from './assets/icons/chat.svg';
import startIcon from './assets/icons/start.svg';
import leaderboardIcon from './assets/icons/leaderboard.svg';
import StartIcon from '../components/Icons/StartIcon';
import LeaderboardIcon from '../components/Icons/LeaderboardIcon';
import ChatIcon from '../components/Icons/ChatIcon';
import LogoIcon from '../components/Icons/LogoIcon';

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


  // if (user && user.avatar && !user.avatar.includes('microcdn')) {
  //   toast.success('Welcome !\nYou can personnalize your avatar and pseudo in your profile page')
  // }

    return (
        <div onMouseMove={({clientX, clientY}) => onMouseMove(clientX, clientY)}>

            <div className="background">

                <div className="statusbar">
                    <div className="bigLogo">
                        <LogoIcon/>
                    </div>
                    <Link to={'/userprofile/' + user.id}>
                        <div className="userView">
                            {user && user.username}
                            <div className="userImage" style={{backgroundImage: `url(${user.avatar})`}}></div>
                        </div>
                    </Link>
                </div>


                <div className="bottom">
                    <Link to="/game">
                        <GlassButton title="START GAME" onClick={() => {}}>
                            <StartIcon/>
                        </GlassButton>
                    </Link>
                    <Link to="/chat">
                        <GlassButton title="ONLINE CHAT">
                            <ChatIcon/>
                        </GlassButton>
                    </Link>
                    <GlassButton title="LEADERBOARD">
                        <LeaderboardIcon/>
                    </GlassButton>
                    <GlassButton title="CURRENT GAMES">
                        <LeaderboardIcon/>
                    </GlassButton>
                </div>
            </div>
        </div>
    );
}
export default Home;
