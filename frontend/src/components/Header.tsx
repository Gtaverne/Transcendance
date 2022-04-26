import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
{
  /* Mettre ce lien dans le .env ? */
}
const intraUrl =
  'https://api.intra.42.fr/oauth/authorize?client_id=f950eb9f6505f95fd8146faeb36d1706ceda488419c445ab4fa7485903463bd6&redirect_uri=http%3A%2F%2Flocalhost%3A5050%2Fusers%2Fcallback&response_type=code';

/*
import * as dotenv from 'dotenv'

dotenv.config({path: './.env'})
const API_42 = process.env.API_42
*/

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const {user} = useSelector((state) => state.auth)

  return (
    <header className="site-header">
      <div>
        <Link to="/">Home</Link>
      </div>
      <ul>
        <li>
          <a href={intraUrl}>Login</a>
        </li>
        <li>
          <Link to="/game">Game</Link>
        </li>
        <li>
          <Link to="/chat">Chat</Link>
        </li>
      </ul>
    </header>
  );
}
export default Header;
