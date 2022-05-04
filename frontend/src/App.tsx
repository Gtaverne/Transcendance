import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Header from './components/Header';
import Chat from './pages/Chat';
import Game from './pages/Game';
import Home from './pages/Home';
import UserProfile from './pages/UserProfile';
import Login from './pages/Login';
import Landing from './pages/Landing';
// import { useEffect } from 'react';
import moment from 'moment';
import PrivateRoute from './components/PrivateRoute';

function App() {
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
