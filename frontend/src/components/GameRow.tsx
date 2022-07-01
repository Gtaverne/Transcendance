import './GameRow.css';

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

function GameRow({ game }: { game: GameCleanInfo }) {
  return (
    <>
      <div className="historyUser">
        <div className="historyRow">
          <img className="historyPic" src={game.userA.avatar} alt="" />
        </div>
        <div className="historyName">{game.userA.username}</div>
        <div className="historyLevelProfile">{game.userA.score}</div>
        <div className="historyLevelProfile historyOpacity">VS</div>
        <div className="historyLevelProfile">{game.userB.score}</div>
        <div className="historyName historyNameRight">
          {game.userB.username}
        </div>
        <div className="historyRow">
          <img className="historyPic" src={game.userB.avatar} alt="" />
        </div>
      </div>
    </>
  );
}
export default GameRow;
