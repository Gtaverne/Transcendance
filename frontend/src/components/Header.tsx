import { Link, useNavigate } from 'react-router-dom';
import { RootStateOrAny, useSelector, useDispatch } from 'react-redux';
import { login, logout, reset } from '../features/auth/authSlice';
import useWindowSize from '../hooks/useWindowSize';
import logo from '../pages/assets/logo.png';

var API_42 =
  'https://api.intra.42.fr/oauth/authorize?client_id=defe35a8d7ed70945036caa7f7b042c6c98ab8f01b768c3adcd9e54d5d301d9f&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin&response_type=code';

const Client_ID = process.env.REACT_APP_CLIENT_ID;

if (Client_ID) {
  API_42 =
    'https://api.intra.42.fr/oauth/authorize?client_id=' +
    Client_ID +
    '&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin&response_type=code';
}

//const logo = 'https://cdn.discordapp.com/attachments/778668594086936616/972774969593442354/Artboard.png';


function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootStateOrAny) => state.auth);

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
            <a href={API_42}>Login</a>
          </li>
        )}
      </ul>
    </header>
  );
}
export default Header;
