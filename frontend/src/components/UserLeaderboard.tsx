import { RootStateOrAny, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import UserInterface from '../interfaces/UserInterface';
import './UserLeaderboard.css';

function UserLeaderboard({ player }: { player: UserInterface }) {
  const { user } = useSelector((state: RootStateOrAny) => state.auth);
  return (
    <Link to={'/userprofile/' + player.id} style={{textDecoration: 'none' }}>
      <div className={player.id === user.id ? 'ownLeader leaderboardUser' : 'leaderboardUser'}>
        <div className="levelProfile ">{player.lvl}</div>
        <div className="leaderboardRow">
          <div
            className={
              player.isOnline || player.id === user.id ? 'puceverte ' : ''
            }
            title={player.isOnline ? 'Player is online' : 'Player is offline'}
          >
            <img className="leaderboardPic " src={player.avatar} alt="" />
          </div>
        </div>
        <div className="leaderboardName">{player.username}</div>
      </div>
    </Link>
  );
}
export default UserLeaderboard;
