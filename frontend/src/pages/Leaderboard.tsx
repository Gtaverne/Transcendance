import React, { useEffect, useState } from 'react';
import Overlay from '../components/Overlay';
import UserLeaderboard from '../components/UserLeaderboard';
import apiGetter from '../features/apicalls/apiGetter';
import UserInterface from '../interfaces/UserInterface';

function Leaderboard() {
  const [users, setUsers] = useState<UserInterface[]>([]);

  useEffect(() => {
    const getLeaderboard = async () => {
      try {
        const res = await apiGetter('users/leaderboard');
        setUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getLeaderboard();
  }, []);

  return (
    <Overlay title={'Leaderboard'} style={{backgroundColor: "#382d34"}}>

      <div className="topScorer">
        <img className="topImg" src={users[0]?.avatar} alt="">

        </img>
        <div className="toptop">
          <h1>#1</h1>
          <h2>{users[0]?.username}</h2>
        </div>
      </div>

      {users?.map((c: any, i) => (
        <div key={i} >
          <UserLeaderboard player={c} />
        </div>
      ))}
    </Overlay>
  );
}

export default Leaderboard;
