import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Header from './components/Header';
import Chat from './pages/Chat';
import Game from './pages/Game';
import Home from './pages/Home';
import UserProfile from './pages/UserProfile';
import Login from './pages/Login';


function App() {
  return (
    <>
      <Router>
        <div>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/userprofile/:id" element={<UserProfile />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/game" element={<Game />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
