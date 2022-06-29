import React, { useEffect, useRef, useState } from 'react';
import Overlay from '../components/Overlay';
import UserLeaderboard from '../components/UserLeaderboard';
import UserMiniature from '../components/UserMiniature';
import apiGetter from '../features/apicalls/apiGetter';
import UserInterface from '../interfaces/UserInterface';

function Leaderboard() {
  const [users, setUsers] = useState<UserInterface[]>([]);

  useEffect(() => {
    const getConversationsCanJoin = async () => {
      try {
        const res = await apiGetter('users/leaderboard');
        setUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversationsCanJoin();
  }, []);

  return (
    <Overlay title={'Leaderboard'}>
      {users?.map((c: any) => (
        <>
          {/* <div key={c.id.toString()}>
            {c.username}
            {c.lvl}
          </div> */}
          <UserLeaderboard user={c} />
        </>
      ))}
    </Overlay>
  );
}

export default Leaderboard;
