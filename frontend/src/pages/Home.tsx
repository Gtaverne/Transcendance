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


//   if (user && user.avatar && !user.avatar.includes('microcdn')) {
//     toast.success('Welcome !\nYou can personnalize your avatar and pseudo in your profile page')
//   }

    return (
        <div>
            <div className="backgroundLayers">
                <div className="layerZero" style={{transform: `scale(1.15)  translateX(${percX*5}%) translateY(${percY*5}%)`}}></div>
                <div className="layerOne" style={{transform: `scale(1.1)  translateX(${percX*2.5}%) translateY(${percY*2.5}%)`}}></div>
                <div className="layerTwo" style={{transform: `scale(1.05)  translateX(${percX*1.25}%) translateY(${percY*1.25}%)`}}></div>
                <div className="layerThree" style={{transform: `scale(1.025)  translateX(${percX*0.625}%) translateY(${percY*0.625}%)`}}></div>
            </div>

            <div className="background" onMouseMove={({clientX, clientY}) => onMouseMove(clientX, clientY)}>

                <div className="statusbar">
                    <img src={logo} className="bigLogo"></img>
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
                            <img src={startIcon}></img>
                        </GlassButton>
                    </Link>
                    <Link to="/chat">
                        <GlassButton title="ONLINE CHAT">
                            <img src={chatIcon}></img>
                        </GlassButton>
                    </Link>
                    <GlassButton title="LEADERBOARD">
                        <img src={leaderboardIcon}></img>
                    </GlassButton>
                    <GlassButton title="CURRENT GAMES">
                        <img src={leaderboardIcon}></img>
                    </GlassButton>
                </div>
            </div>
        </div>
    );
}
export default Home;
