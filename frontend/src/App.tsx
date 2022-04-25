<<<<<<< HEAD
import Header from "./components/Header";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

=======
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Header from './components/Header';
import Chat from './pages/Chat';
import Game from './pages/Game';
import Home from './pages/Home';
import LoginRegister from './pages/LoginRegister';
>>>>>>> e486a195cb68133f38824ef3a89c7977513215eb

function App() {
  return (
    <>
<<<<<<< HEAD
    <Router>
      <div className="container">
        <Header />
      </div>
    </Router>
=======
      <Router>
        <div>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/loginregister" element={<LoginRegister />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/game" element={<Game />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer />
>>>>>>> e486a195cb68133f38824ef3a89c7977513215eb
    </>
  );
}

export default App;
