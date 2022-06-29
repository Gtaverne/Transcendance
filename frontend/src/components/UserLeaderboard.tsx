import { RootStateOrAny, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Color } from 'three';
import UserInterface from '../interfaces/UserInterface';

function UserLeaderboard({ player }: { player: UserInterface }) {
  const { user } = useSelector((state: RootStateOrAny) => state.auth);
  return (
    <Link to={'/userprofile/' + player.id} style={{textDecoration: 'none' }}>
      <div
        className="leaderboardMiniature"
        style={player.id === user.id ?  {background: 'lightgreen' } : {}}
      >
        <div></div>
        <div className="levelProfile ">{player.lvl}</div>
        <div
          className={
            player.isOnline || player.id === user.id ? 'puceverte ' : ''
          }
          title={player.isOnline ? 'Player is online' : 'Player is offline'}
        >
          <img className="profilepic " src={player.avatar} alt="" />
        </div>
        <div>{player.username}</div>
        <div></div>
      </div>
    </Link>
  );
}
export default UserLeaderboard;
