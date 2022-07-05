import React, { useEffect, useRef } from 'react';
import Overlay from '../components/Overlay';
import { io, Socket } from 'socket.io-client';
import { Link } from 'react-router-dom';

function CurrentGames() {
  const socket = useRef<Socket | undefined>(undefined);
  //const [, forceUpdate] = React.useReducer(x => x + 1, 0);

  const [gameMap, setGameMap] = React.useState<Map<number, any>>(new Map());


  useEffect(() => {

    socket.current = io(process.env.REACT_APP_BASE_URL! + "/games");
    socket.current?.on("connect", () => {
      //console.log("Connected");
    });

    socket.current?.on("gameInfo", (id, usernameA, avatarA, usernameB, avatarB) => {
      setGameMap(new Map(gameMap.set(id, <>
      <Link to={'/game/' + id} key={id}>
        <div className="matchInfo">
          <img src={avatarA} alt="avatar"></img>
          <img src={avatarB} alt="avatar"></img>
          <div className="vsText">{usernameA} <div>VS</div> {usernameB}</div>
        </div>
      </Link>
      </>)));
    });
    socket.current?.on("gameRemove", (id) => {
      gameMap.delete(id);
      setGameMap(new Map(gameMap));
    });
    socket.current?.emit('listen');
    return () =>
    {
      socket.current?.disconnect();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Overlay title={"Current Games"} style={{backgroundColor: "#554658"}}>
      {Array.from(gameMap, ([key, value]) => value).map((value) => {
        return value;
      })}
    </Overlay>
  );
}

export default CurrentGames;
