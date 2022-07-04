import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GameRow from '../components/GameRow';
import Overlay from '../components/Overlay';
import apiGetter from '../features/apicalls/apiGetter';
import UserInterface from '../interfaces/UserInterface';

type UserInfoProps = {
  score: number;
  level: number;
  id: number;
  username: string;
  avatar: string;
};

type GameCleanInfo = {
  userA: UserInfoProps;
  userB: UserInfoProps;
};

function MatchHistory() {
  const params = useParams();
  const [history, setHistory] = useState<GameCleanInfo[] | undefined>(undefined);
  const [userHistory, setUserHistory] = useState<UserInterface | undefined>(
    undefined,
  );

  useEffect(() => {
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
    const getHistory = async () => {
      if (params.id) {
        try {
          const res = await apiGetter('games/history/' + params.id);
          setHistory(res.data);
        //   console.log(123, res.data);
        } catch (err) {
          console.log(err);
        }
      }
    };
    getHistory();
    // eslint-disable-next-line 
  }, []);
  // @Benjamin, check
// }, [params.id]);


  return (
    <Overlay title={'Match History'} style={{ backgroundColor: '#382d34' }}>
      <div className="topScorer">
        <img className="topImg" src={userHistory?.avatar} alt=""></img>
        <div className="toptoptop">
          <h1>{userHistory?.username}</h1>
          <h2>Match History</h2>
        </div>
      </div>
      {history?.map((c: GameCleanInfo, i) => (
        <div key={i}>
          <GameRow game={c} />
        </div>
      ))}
    </Overlay>
  );
}

export default MatchHistory;
