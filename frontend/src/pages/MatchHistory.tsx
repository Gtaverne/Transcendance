import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Overlay from '../components/Overlay';
import UserLeaderboard from '../components/UserLeaderboard';
import apiGetter from '../features/apicalls/apiGetter';
import UserInterface from '../interfaces/UserInterface';

function MatchHistory() {
  const params = useParams();
  const [users, setUsers] = useState<UserInterface[]>([]);
  const [userHistory, setUserHistory] = useState<UserInterface | undefined>(
    undefined,
  );

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await apiGetter('users/leaderboard');
        setUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getData();
    const getUser = async () => {
      if (params.id) {
        try {
          const res = await apiGetter('users/profile/' + params.id);
          setUserHistory(res.data);
        } catch (err) {
          console.log(err);
        }
      }
    };
    getUser();
  }, []);

  return (
    <Overlay title={'Match History'} style={{ backgroundColor: '#382d34' }}>
      <div className="topScorer">
        <img className="topImg" src={userHistory?.avatar}></img>
        <div className="toptop">
          <h1>{userHistory?.username}</h1>
          <h2>Match History</h2>
        </div>
      </div>

      {users?.map((c: any, i) => (
        <div key={i}>
          <UserLeaderboard player={c} />
        </div>
      ))}
    </Overlay>
  );
}

export default MatchHistory;
