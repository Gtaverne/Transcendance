import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Chat from './pages/Chat';
import Pong from './pages/Pong';
import Home from './pages/Home';
import UserProfile from './pages/UserProfile';
import Configure2FA from './pages/Configure2FA';
import Login from './pages/Login';
import Landing from './pages/Landing';
import PrivateRoute from './components/PrivateRoute';
import { useEffect, useRef, useState } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import { io, Socket } from 'socket.io-client';

import './pages/Home.css';
import CurrentGames from './pages/CurrentGames';
import Leaderboard from './pages/Leaderboard';
import CreateProfile from './pages/CreateProfile';
import MatchHistory from './pages/MatchHistory';
import Page404 from './pages/Page404';
import Cookies from 'js-cookie';

function MainRooter() {
  const socket = useRef<Socket | undefined>(undefined);
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

  useEffect(() => {
    if (user && user.username) {
      if (socket.current) socket.current?.disconnect();
      const connect = () => {
        if (!Cookies.get('jwt') || Cookies.get('jwt') === '') {
          redo();
          return;
        }
        socket.current = io(process.env.REACT_APP_BASE_URL! + '/chat', {
          query: { id: user.id },
          transports: ['websocket', 'polling'],
          forceNew: true,
        });
      };

      const redo = () => setTimeout(connect, 500);
      if (!Cookies.get('jwt') || Cookies.get('jwt') === '') redo();
      else connect();
    }
  }, [user]);

  return (
    <div onMouseMove={({ clientX, clientY }) => onMouseMove(clientX, clientY)}>
      <div className="backgroundLayers">
        <div
          className="layerZero"
          style={{
            transform: `scale(1.15) translateX(${percX * 5}%) translateY(${
              percY * 5
            }%)`,
          }}
        ></div>
        <div
          className="layerOne"
          style={{
            transform: `scale(1.1) translateX(${percX * 2.5}%) translateY(${
              percY * 2.5
            }%)`,
          }}
        ></div>
        <div
          className="layerTwo"
          style={{
            transform: `scale(1.05) translateX(${percX * 1.25}%) translateY(${
              percY * 1.25
            }%)`,
          }}
        ></div>
        <div
          className="layerThree"
          style={{
            transform: `scale(1.025) translateX(${percX * 0.625}%) translateY(${
              percY * 0.625
            }%)`,
          }}
        ></div>
      </div>
      <Routes>
        {/* See https://stackoverflow.com/questions/67050966/how-to-build-a-404-page-with-react-router-dom-v6 */}
        <Route path="*" element={<Page404 />} />
        <Route path="/" element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<PrivateRoute />}>
          <Route path="/create" element={<CreateProfile />} />
        </Route>
        <Route path="/userprofile/:id" element={<PrivateRoute />}>
          <Route path="/userprofile/:id" element={<UserProfile />} />
        </Route>
        <Route path="/matchhistory/:id" element={<PrivateRoute />}>
          <Route path="/matchhistory/:id" element={<MatchHistory />} />
        </Route>
        <Route path="/configure2fa/:id" element={<PrivateRoute />}>
          <Route path="/configure2fa/:id" element={<Configure2FA />} />
        </Route>
        <Route path="/chat" element={<PrivateRoute />}>
          <Route path="/chat" element={<Chat socket={socket} />} />
        </Route>
        <Route path="/current" element={<PrivateRoute />}>
          <Route path="/current" element={<CurrentGames />} />
        </Route>
        <Route path="/leaderboard" element={<PrivateRoute />}>
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Route>
        <Route path="/game" element={<PrivateRoute />}>
          <Route path="/game" element={<Pong />} />
        </Route>
        <Route path="/game/:id" element={<PrivateRoute />}>
          <Route path="/game/:id" element={<Pong />} />
        </Route>
      </Routes>
    </div>
  );
}

function App() {
  return (
    <>
      <Router>
        <MainRooter />
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
