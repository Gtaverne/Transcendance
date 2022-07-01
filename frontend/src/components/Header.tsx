import { Link, useNavigate } from 'react-router-dom';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import logo from '../pages/assets/logo.png';

//const API_42 = `https://api.intra.42.fr/oauth/authorize?client_id=${process.env.REACT_APP_CLIENT_ID!}&redirect_uri=${encodeURI(process.env.REACT_APP_BASE_URL!)}%2Flogin&response_type=code`;


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
          <></>
        )}
      </ul>
    </header>
  );
}
export default Header;
