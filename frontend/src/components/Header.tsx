import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <header className='site-header'>
      <div>
        <Link to="/">Home</Link>
      </div>
      <ul>
        <li>
          <Link to="/loginregister">LoginRegister</Link>
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
