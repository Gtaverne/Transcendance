import { Link } from 'react-router-dom';
import UserInterface from '../interfaces/UserInterface';

function UserLeaderboard({ user }: { user: UserInterface }) {
  return (
    <Link to={'/userprofile/' + user.id} style={{ textDecoration: 'none' }}>
      <div className="leaderboardMiniature">
		  <div></div>
        <div className='levelProfile'>{user.lvl}</div>
        <div>
          <img className="profilepic" src={user.avatar} alt="" />
        </div>
        <div>{user.username}</div>
		<div></div>
      </div>
    </Link>
  );
}
export default UserLeaderboard;
