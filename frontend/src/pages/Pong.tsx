import './Pong.css';
import bouncesound from './assets/bounce.mp3';
import goalsound from './assets/goal.mp3';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry';


import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Material } from 'three';
import { Link, useParams } from 'react-router-dom';
import { Socket, io } from 'socket.io-client';
import useAudio from '../features/game/useAudio';

declare var global: {
  game: {
    localX: number;
    opoX: number;
    ballX: number;
    ballY: number;
    velX: number;
    velY: number;
    didHit: number;
    slow: number;
    scoreA: number;
    scoreB: number;
    bounceA: number;
    bounceB: number;
    startTime: number;
  };
  requestId: number;
};

const PongFrame = ({prefix}: {prefix: string}) => {

  const mount = useRef<HTMLDivElement>(null);

  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => {

    console.log("CALLLL");

    var scene = new THREE.Scene();

    scene.fog = new THREE.FogExp2( 0x000000, 0.006 );


    var renderer = new THREE.WebGLRenderer();

    // @ts-ignore
    var camera: THREE.PerspectiveCamera = {};

    function setupCamera()
    {
      let fov = 120 - Math.min(70, window.innerWidth / 25);

      let oldPos;
      let oldRot;

      if (!camera || !camera.position || !camera.rotation)
      {
        oldPos = {x:0, y:0, z:0};
        oldRot = {x:0, y:0, z:0};
      }
      else
      {
        oldPos = camera.position;
        oldRot = camera.rotation;
      }
      camera = new THREE.PerspectiveCamera( fov, window.innerWidth/window.innerHeight, 0.1, 500 );
      camera.position.x = oldPos.x;
      camera.position.y = oldPos.y;
      camera.position.z = oldPos.z;
      camera.rotation.x = oldRot.x;
      renderer.setSize( window.innerWidth, window.innerHeight );
    }



    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap


    setupCamera();

    const resetCamera = () => {
      camera.position.z = 60;
      camera.position.y = 17;
      camera.position.x = 0;
      camera.rotation.x = -0.5;
    };

    resetCamera();

    if (mount.current)
    {
      mount.current.innerHTML = '';
      mount.current.appendChild( renderer.domElement );
    }



    const light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set( 0, 10, 4 );
    light.castShadow = true; // default false
    scene.add( light );

    //Set up shadow properties for the light
    light.shadow.mapSize.width = 512; // default
    light.shadow.mapSize.height = 512; // default
    light.shadow.camera.near = 0.5; // default
    light.shadow.camera.far = 500; // default

    const ambientLight = new THREE.AmbientLight( 0xababab ); // soft white light
    scene.add( ambientLight );


    let lenghtBar = 7;
    let border = 3.2;
    let ballSize = 1;

    let goal = 44.7;


    {
      const geometry = new RoundedBoxGeometry( 1, 1, lenghtBar, 10, 0.3 );
      const material = new THREE.MeshStandardMaterial( { color: 0x9A4F80 } );
      var cube = new THREE.Mesh( geometry, material );
      cube.receiveShadow = false; //default
      cube.position.x = -goal - 1;
      cube.position.z = global.game.localX;
      cube.position.y = 0.5;

      scene.add( cube );
    }

    {
      const geometry = new RoundedBoxGeometry( 1, 1, lenghtBar, 10, 0.3 );
      const material = new THREE.MeshStandardMaterial( { color: 0x9A4F80 } );
      var cube2 = new THREE.Mesh( geometry, material );
      cube2.position.x = goal + 1;
      cube2.position.z = global.game.opoX;
      cube2.position.y = 0.5;

      scene.add( cube2 );
    }

    {
      const geometry = new THREE.SphereGeometry( ballSize * 0.7, 14, 14 );
      const material = new THREE.MeshStandardMaterial( { color: 0xa0a0a0 } );
      var ball = new THREE.Mesh( geometry, material );
      ball.position.x = global.game.ballX;
      ball.position.z = global.game.ballY;
      ball.position.y = ballSize / 2 + 0.1;

      scene.add( ball );
    }

    {
      const geometry = new RoundedBoxGeometry( 100, 200, 50, 10, 2.7 );
      const materialCanvas = new THREE.MeshBasicMaterial( { color: 0x470243 } );
      let meshFrame = new THREE.Mesh( geometry, materialCanvas );
      meshFrame.position.y = -100.3;
      meshFrame.position.x = 0.14;
      meshFrame.position.z = 25 - 3.7;
      scene.add( meshFrame )
    }


    const loader = new THREE.TextureLoader();
    loader.load(prefix + 'arena.png' , function(texture)
    {
      let geometry = new THREE.PlaneGeometry( 100, 50 );
      let materialCanvas = new THREE.MeshBasicMaterial( { map: texture, transparent: true } );
      let meshFrame = new THREE.Mesh( geometry, materialCanvas );
      meshFrame.position.z = (25.0) - border;
      meshFrame.position.x = 0.14;
      meshFrame.rotation.x = -Math.PI / 2;


      scene.add( meshFrame );

      setLoaded(true);
      console.log("SET LOADED");
    });

    var shineObject: THREE.Mesh;

    new THREE.TextureLoader().load(prefix + 'border.png' , function(texture)
    {
      let geometry = new THREE.PlaneGeometry( 100, 50 );
      let materialCanvas = new THREE.MeshBasicMaterial( { map: texture, transparent: true } );
      shineObject = new THREE.Mesh( geometry, materialCanvas );
      shineObject.position.z = (25.0) - border;
      shineObject.rotation.x = -Math.PI / 2;

      shineObject.position.y = 0;
      if (shineObject.material instanceof Material)
        shineObject.material.opacity = 0;

      scene.add( shineObject );
    });

    new THREE.TextureLoader().load(prefix + '0.png' , function(texture)
    {
      scene.background = texture;
    });



    var animate = function () {

      if (renderer.domElement.width !== window.innerWidth || renderer.domElement.height !== window.innerHeight)
      {
        setupCamera();
      }


      if(new Date().getTime() - global.game.startTime > 700) {

        //global.game.slow = Math.min(1, Math.max(0, global.game.slow + 0.05));

        global.game.slow += 0.00002;

        global.game.slow *= 1.09;
        if (global.game.slow > 1)
          global.game.slow = 1;

        cube.position.z += (global.game.localX - cube.position.z) * 0.25;
        cube2.position.z += (global.game.opoX - cube2.position.z) * 0.25;

        ball.position.z += (global.game.ballY - ball.position.z) * 0.4;
        ball.position.x += (global.game.ballX - ball.position.x) * 0.4;

        ball.position.x = Math.max(- goal - 1, Math.min(goal + 1, ball.position.x));

        camera.position.x += (Math.min(Math.max((global.game.ballX/goal) * 3, -3), 3) - camera.position.x) * 0.006 * global.game.slow;

        camera.position.z -= 60;
        camera.position.z += (Math.min(Math.max((global.game.ballY/25) * 2, -2), 2) - camera.position.z) * 0.006 * global.game.slow;
        camera.position.z += 60;


        camera.position.y += (80 - camera.position.y) * 0.02 * global.game.slow;
        camera.rotation.x += (-1.14 - camera.rotation.x) * 0.02 * global.game.slow;

        cube.position.x = - goal - 1 - Math.sin(global.game.bounceA) / 2.5;
        cube2.position.x = goal + 1 + Math.sin(global.game.bounceB) / 2.5;

        global.game.bounceA = Math.max(0, global.game.bounceA - 0.14);
        global.game.bounceB = Math.max(0, global.game.bounceB - 0.14);

      }
      else
      {
        resetCamera();
      }


      if (shineObject && global.game.didHit > 0)
      {
        shineObject.position.y = 0.1 + (1 - global.game.didHit) * 2;
        if (shineObject.material instanceof Material)
          shineObject.material.opacity = global.game.didHit;
      }

      global.game.didHit = Math.max(0, global.game.didHit - 0.009);

      renderer.render( scene, camera );

      global.requestId = window.requestAnimationFrame( animate );
    };


    animate();

    return () => {
      window.cancelAnimationFrame(global.requestId);
    }
  }, [prefix]);
  return (
    <div className="back">
      <div ref={mount} className="game"/>
      <div className="backgroundFrame" style={{opacity: isLoaded ? "0" : "1"}}></div>
    </div>
  )
}

const Pong = () => {

  const params = useParams();
  const isSpectating = params.id !== undefined && params.id !== null;

  const [scores, setScores] = useState({scoreA: 0, scoreB: 0});

  const [started, setStarted] = useState(isSpectating);
  const [gameover, setGameover] = useState(false);

  const socket = useRef<Socket | undefined>(undefined);
  const [queueing, setQueueing] = useState(false);

  const [gameUserA, setGameUserA] = useState({username: '', avatar: ''});
  const [gameUserB, setGameUserB] = useState({username: '', avatar: ''});

  const [color, setColor] = useState(0);


  var play = useAudio(bouncesound);
  var playGoal = useAudio(goalsound);

  let lenghtBar = 7;
  let border = 3.2;

  let goal = 44.7;

  let arenaWidth = 50 - border * 2;



  const resetGame = (startTime: number) => {
    global.game = {
      localX: arenaWidth/2,
      opoX: arenaWidth/2,
      ballX: 0,
      ballY: arenaWidth / 2,
      velX: -0.4,
      velY: -0.5,
      didHit: 0,
      slow: 0,
      scoreA: 0,
      scoreB: 0,
      bounceA: 0,
      bounceB: 0,
      startTime: startTime,
    };
  }

  const stopQueue = () =>
  {
    if (socket.current)
    {
      socket.current?.off("disconnect");
      socket.current?.disconnect();
      setQueueing(false);
      setStarted(false);
      setGameover(false);
    }
  }

  const startQueue = () =>
  {
    if (socket.current)
      socket.current?.disconnect();

    socket.current = io(process.env.REACT_APP_BASE_URL! + "/games");
    socket.current?.on("connect", () => {
      console.log("Connected");
    });
    socket.current?.on("disconnect",() => {
      setQueueing(false);
      setStarted(false);
      setGameover(true);
      global.game.velX = 0;
      global.game.velY = 0;
      setScores({scoreA: 0, scoreB: 0});
    });
    socket.current?.on("gameStarted", (ballX, ballY, velX, velY, aUsername, aImg, bUsername, bImg) => {
      resetGame(new Date().getTime());
      global.game.ballY = ballY;
      global.game.ballX = ballX;
      global.game.velX = velX;
      global.game.velY = velY;
      setGameUserA({username: aUsername, avatar: aImg});
      setGameUserB({username: bUsername, avatar: bImg});
      setStarted(true);
      setGameover(false);
      setScores({scoreA: 0, scoreB: 0});
    });
    socket.current?.on("ball", (ballX, ballY, velX, velY) => {
      global.game.ballY = ballY;
      global.game.ballX = ballX;
      global.game.velX = velX;
      global.game.velY = velY;
      if (ballX > 10)
      {
        play();
        global.game.bounceB = Math.PI;
      }
      else if (ballX < -10)
      {
        play();
        global.game.bounceA = Math.PI;
      }
      else if (velX === 0 && velY === 0)
      {
        playGoal();
        global.game.localX = arenaWidth/2;
        global.game.opoX = arenaWidth/2;
      }
    });
    socket.current?.on("opoMove", (opoX) => {
      global.game.opoX = opoX;
    });
    socket.current?.on("meMove", (opoX) => {
      global.game.localX = opoX;
    });
    socket.current?.on("setScore", (a, b) => {
      global.game.scoreA = a;
      global.game.scoreB = b;
    });
    socket.current?.on("gameover", () => {
      setGameover(true);
      setStarted(false);
    });
    socket.current?.on("receivePoint", () => {
      global.game.scoreA++;
    });

    if (isSpectating)
      socket.current?.emit('spectate', { gameId: params.id });
    else
      socket.current?.emit('joinQueue');
    setQueueing(true);
  }


  useLayoutEffect(() => {

    if (isSpectating)
    {
      startQueue();
    }

    console.log("CALLLL");

    var scene = new THREE.Scene();

    scene.fog = new THREE.FogExp2( 0x000000, 0.006 );

    resetGame(9223372036854775807);


    var upPressed = false;
    var downPressed = false;


    const keyDownHandler = (e : KeyboardEvent) => {
      console.log(e.keyCode);
      if(e.keyCode === 38)
        upPressed = true;
      else if(e.keyCode === 40)
        downPressed = true;
    }

    const keyUpHandler = (e : KeyboardEvent) => {
      if(e.keyCode === 38)
        upPressed = false;
      else if(e.keyCode === 40)
        downPressed = false;
    }

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);



    var ballStopTime = 0;
    var loopCount = 0;

    function gameLoop()
    {

      if (global.game.scoreA !== scores.scoreA || global.game.scoreB !== scores.scoreB)
      {
        setScores({scoreA: global.game.scoreA, scoreB: global.game.scoreB});
      }

      if(!isSpectating && new Date().getTime() - global.game.startTime < 2400){
        return;
      }

      if (!isSpectating) {
        if (downPressed)
          global.game.localX = Math.min((global.game.localX + 1), arenaWidth - lenghtBar / 2);
        if (upPressed)
          global.game.localX = Math.max((global.game.localX - 1), lenghtBar / 2);

        if (loopCount++ % 2 === 0)
          socket.current?.emit('move', { localX: global.game.localX });

      }

      if (global.game.ballY + global.game.velY > arenaWidth || global.game.ballY + global.game.velY < 0) {
        global.game.velY = -global.game.velY;
        global.game.didHit = 1;
        play();
      }

      if (!isSpectating) {
        if (Math.abs(global.game.ballY - global.game.localX) <= (lenghtBar + 2) / 2 && global.game.ballX <= -goal)
        {
          global.game.velX = -global.game.velX + 0.1;

          let hit = global.game.ballY - global.game.localX;
          let angle = Math.atan2(global.game.velY, global.game.velX);
          let size = Math.max(Math.sqrt(global.game.velX * global.game.velX + global.game.velY * global.game.velY), 0.5);

          if (hit > 2)
            angle = Math.min(angle + 0.5, 0.7);
          else if (hit < -2)
            angle = Math.max(angle - 0.5, -0.7);

          console.log(angle);

          global.game.velX = Math.cos(angle) * size;
          global.game.velY = Math.sin(angle) * size;

          global.game.bounceA = Math.PI;
          play();

          socket.current?.emit('hitBall', {ballX: global.game.ballX, ballY: global.game.ballY, velX: global.game.velX, velY: global.game.velY});
        }
        else if (global.game.ballX <= -(goal + 1))
        {
            socket.current?.emit('tookGoal');
            global.game.scoreB++;
            global.game.ballY = arenaWidth / 2;
            global.game.ballX = 0;
            global.game.velX = 0;
            global.game.velY = 0;

        }
      }
      else
      {
        if ((global.game.ballX <= -(goal + 1) && global.game.velX < 0) || (global.game.ballX >= (goal + 1) && global.game.velX > 0))
        {
          global.game.velX = 0;
          global.game.velY = 0;
        }
      }


      if(new Date().getTime() - ballStopTime > 2000 && !(global.game.ballX >= (goal + 1) && global.game.velX > 0)){
        global.game.ballX += global.game.velX;
        global.game.ballY += global.game.velY;
      }
    }

    const loop = setInterval(gameLoop, 30);

    return () => {
      clearInterval(loop);
      document.removeEventListener("keydown", keyDownHandler);
      document.removeEventListener("keyup", keyUpHandler);
      socket.current?.disconnect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div style={{filter: `hue-rotate(${color}deg)`}}>
      <PongFrame prefix={ isSpectating ? '../' : '' }></PongFrame>

      <div className="backButton">
        <Link to={"/"}>Exit</Link>
      </div>
      <div className="score">
        {started ? <div className={"user userA"}>
          <div className={"username"}>{gameUserA.username}</div>
          <div className={"profilePic"} style={{backgroundImage: `url(${gameUserA.avatar})`, filter: `hue-rotate(-${color}deg)`}}></div>
        </div> : <></>}
        {scores.scoreA} - {scores.scoreB}
        {started ? <div className={"user userB"}>
          <div className={"profilePic"} style={{backgroundImage: `url(${gameUserB.avatar})`, filter: `hue-rotate(-${color}deg)`}}></div>
          <div className={"username"}>{gameUserB.username}</div>
        </div> : <></>}
      </div>
      {!started && !gameover ?

      <div className="newgameContainer">
        <div className="newgameScreen">
          <h1>
            New Game
          </h1>

          {queueing ? <p>
            Waiting for opponent.
          </p> : <>
            <fieldset>
              <legend>Select a theme:</legend>
              <div>
                <input type="radio" id="purple" name="drone" value="huey" checked={color === 0} onChange={() => setColor(0)}/>
                  <label htmlFor="purple">PURPLE</label>
              </div>
              <div>
                <input type="radio" id="blue" name="drone" value="dewey" checked={color === 290} onChange={() => setColor(290)}/>
                  <label htmlFor="blue">BLUE</label>
              </div>
              <div>
                <input type="radio" id="blue" name="drone" value="louie" checked={color === 66} onChange={() => setColor(66)}/>
                  <label htmlFor="blue">RED</label>
              </div>
            </fieldset>

          </>}

          {!queueing ?
          <div className="newgameButton" onMouseUp={() => {
            startQueue();
          }}>
            Start
          </div> : <div className="newgameButton" onMouseUp={() => {
              stopQueue();
            }}>
              Cancel
            </div>}
        </div>
      </div>

      : <></>}
      {gameover ?

        <div className="newgameContainer">
          <div className="newgameScreen">
            <h1>
              GAME OVER
            </h1>

            <p>{gameUserA.username}: {scores.scoreA} <br/> {gameUserB.username}: {scores.scoreB}</p>

            {isSpectating ? <></> : <div className="newgameButton" onMouseUp={() => {
              setGameover(false);
            }}>
              OK
            </div>}
          </div>
        </div>

        : <></>}
    </div>
  )




}

export default Pong;
