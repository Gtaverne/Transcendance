import { Link, useNavigate } from 'react-router-dom';
import { RootStateOrAny, useSelector, useDispatch } from 'react-redux';
import { login, logout, reset } from '../features/auth/authSlice';
import useWindowSize from '../hooks/useWindowSize';

const API_42 = process.env.REACT_APP_API_42;
const logo =
  'https://cdn.discordapp.com/attachments/778668594086936616/972774969593442354/Artboard.png';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootStateOrAny) => state.auth);
  const [height, width] = useWindowSize();

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  return (
    <header className="site-header">
      <div>
        <Link to="/" className="homeButton">
          <img src={logo} alt="Logo" />
        </Link>
      </div>
      <p>
        Game Height: {height} | Game Width: {width}
      </p>
      <ul>
        <li>
          <Link to="/game">Game</Link>
        </li>
        <li>
          <Link to="/chat">Chat</Link>
        </li>
        {user && user.username ? (
          <>
            <li>
              <Link to={'/userprofile/' + user.id}>
                <img className="profilepic" src={user.avatar} />
                {user.username}
              </Link>
            </li>
            <li>
              <button className="logButton" onClick={onLogout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <li>
            <a href="https://api.intra.42.fr/oauth/authorize?client_id=f950eb9f6505f95fd8146faeb36d1706ceda488419c445ab4fa7485903463bd6&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin&response_type=code">
              Login
            </a>
          </li>
        )}
      </ul>
    </header>
  );
}
export default Header;
