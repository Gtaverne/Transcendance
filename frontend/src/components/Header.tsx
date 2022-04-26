import { Link, useNavigate } from 'react-router-dom';
import {RootStateOrAny, useSelector, useDispatch } from 'react-redux';
import {login, logout, reset} from '../features/auth/authSlice'

/*
import * as dotenv from 'dotenv'

dotenv.config({path: './.env'})
const API_42 = process.env.API_42
*/

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {user} = useSelector((state: RootStateOrAny) => state.auth)

  return (
    <header className='site-header'>
      <div>
        <Link to="/">Home</Link>
      </div>
      <ul>
        <li>
        <Link to="/game">Game</Link>
        </li>
        <li>
        <Link to="/chat">Chat</Link>
        </li>
        {
          <>
          <li>
          <img className='profilepic' src={user.avatar}  />
          {user.username}</li>


          <li >
          <a href="https://api.intra.42.fr/oauth/authorize?client_id=f950eb9f6505f95fd8146faeb36d1706ceda488419c445ab4fa7485903463bd6&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin&response_type=code"
          >Login</a>
          </li>
          </>
        }
      </ul>
    </header>
  );
}
export default Header;
