import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Chat from './pages/Chat';
import Game from './pages/Game';
import Home from './pages/Home';
import UserProfile from './pages/UserProfile';
import Configure2FA from './pages/Configure2FA';
// import Verify2FA from './pages/verify2FA';
import Login from './pages/Login';
import Landing from './pages/Landing';
// import { useEffect } from 'react';
import moment from 'moment';
import PrivateRoute from './components/PrivateRoute';
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { RootStateOrAny, useSelector } from 'react-redux';

function App() {
  const socket = useRef(io());
  const { user } = useSelector((state: RootStateOrAny) => state.auth);

  useEffect(() => {
    if (user) {
      socket.current = io('ws://localhost:3000/api/socket.io');
      socket.current.emit('addUser', user.id);
    }
  }, [user]);

  return (
    <>
      <Router>
        <div>
          <Header />
          <Routes>
            <Route path="/" element={<PrivateRoute />}>
              <Route path="/" element={<Home />} />
            </Route>
            <Route path="/landing" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/userprofile/:id" element={<PrivateRoute />}>
              <Route path="/userprofile/:id" element={<UserProfile />} />
            </Route>
            <Route path="/configure2fa/:id" element={<PrivateRoute />}>
              <Route path="/configure2fa/:id" element={<Configure2FA />} />
            </Route>
            <Route path="/chat" element={<PrivateRoute />}>
              <Route path="/chat" element={<Chat />} />
            </Route>
            <Route path="/game" element={<PrivateRoute />}>
              <Route path="/game" element={<Game />} />
            </Route>
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
