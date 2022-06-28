import React, { DOMElement, useEffect, useRef } from 'react';
import Overlay from '../components/Overlay';
import { io, Socket } from 'socket.io-client';
import { Link } from 'react-router-dom';



function CurrentGames() {
  const socket = useRef<Socket | undefined>(undefined);
  //const [, forceUpdate] = React.useReducer(x => x + 1, 0);

  const [gameMap, setGameMap] = React.useState<Map<number, any>>(new Map());


  useEffect(() => {

    socket.current = io("http://localhost:3000/games");
    socket.current?.on("connect", () => {
      console.log("Connected");
    });

    socket.current?.on("gameInfo", (id, usernameA, avatarA, usernameB, avatarB) => {
      setGameMap(new Map(gameMap.set(id, <>
        <Link to={'/game/' + id} key={id}>
          <div>{id}</div>
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
  }, []);

  return (
    <Overlay title={"Current Games"} background={"#554658"}>
      {Array.from(gameMap, ([key, value]) => value).map((value) => {
        return value;
      })}
    </Overlay>
  );
}

export default CurrentGames;
