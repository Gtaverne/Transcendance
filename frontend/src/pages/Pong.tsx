import logo from './logo.svg';
import './Pong.css';

import useSound from 'use-sound';

import bouncesound from './assets/bounce.mp3';
import goalsound from './assets/goal.mp3';


import * as THREE from 'three';

import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry';


import React, { useState, useEffect, useLayoutEffect, useRef, Component } from 'react';
import RoomInterface from '../interfaces/RoomInterface';
import { Material } from 'three';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';

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

const PongFrame = () => {

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

    camera.position.z = 60;
    camera.position.y = 17;
    camera.position.x = 0;
    camera.rotation.x = -0.5;

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
      meshFrame.position.y = -100.1;
      meshFrame.position.z = 25 - 3.7;
      scene.add( meshFrame )
    }


    const loader = new THREE.TextureLoader();
    loader.load('arena.png' , function(texture)
    {
      let geometry = new THREE.PlaneGeometry( 100, 50 );
      let materialCanvas = new THREE.MeshBasicMaterial( { map: texture, transparent: true } );
      let meshFrame = new THREE.Mesh( geometry, materialCanvas );
      meshFrame.position.z = (25.0) - border;
      meshFrame.rotation.x = -Math.PI / 2;

      scene.add( meshFrame );

      setLoaded(true);
      console.log("SET LOADED");
    });

    var shineObject: THREE.Mesh;

    new THREE.TextureLoader().load('border.png' , function(texture)
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

    new THREE.TextureLoader().load('0.png' , function(texture)
    {
      scene.background = texture;
    });



    var animate = function () {

      if (renderer.domElement.width != window.innerWidth || renderer.domElement.height != window.innerHeight)
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
  }, []);

  return (
    <div className="back">
      <div ref={mount} className="game"/>
      <div className="backgroundFrame" style={{opacity: isLoaded ? "0" : "1"}}></div>
    </div>

  )


}

const Pong = () => {

  const mount = useRef<HTMLDivElement>(null);

  const [scores, setScores] = useState({scoreA: 0, scoreB: 0});

  const [started, setStarted] = useState(false);
  const socket = useRef(io());
  const [queueing, setQueueing] = useState(false);


  var [play] = useSound(bouncesound, { volume: 0.4});
  var [playGoal] = useSound(goalsound, { volume: 0.2});

  let lenghtBar = 7;
  let border = 3.2;
  let ballSize = 1;

  let goal = 44.7;

  let arenaWidth = 50 - border * 2;

  const resetGame = (startTime: number) => {
    global.game = {
      localX: arenaWidth/2,
      opoX: arenaWidth/2,
      ballX: -0.14,
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

  const startQueue = () =>
  {
    socket.current = io("http://localhost:3000/games");
    socket.current.on("connect", () => {
      console.log("Connected");
    });
    socket.current.on("disconnect",() => {
      setQueueing(false);
      setStarted(false);
      resetGame(9223372036854775807);
    });
    socket.current.on("gameStarted", (ballX, ballY, velX, velY) => {
      resetGame(new Date().getTime());
      global.game.ballY = ballY;
      global.game.ballX = ballX;
      global.game.velX = velX;
      global.game.velY = velY;
      setStarted(true);
    });
    socket.current.on("ball", (ballX, ballY, velX, velY) => {
      global.game.ballY = ballY;
      global.game.ballX = ballX;
      global.game.velX = velX;
      global.game.velY = velY;
      if (ballX > 10)
        global.game.bounceB = Math.PI;
    });
    socket.current.on("opoMove", (opoX) => {
      global.game.opoX = opoX;
    });
    socket.current.on("receivePoint", (opoX) => {
      global.game.scoreA++;
    });
    setQueueing(true);
  }


  useLayoutEffect(() => {

    console.log("CALLLL");

    var scene = new THREE.Scene();

    scene.fog = new THREE.FogExp2( 0x000000, 0.006 );

    resetGame(9223372036854775807);


    var upPressed = false;
    var downPressed = false;


    const keyDownHandler = (e : KeyboardEvent) => {
      console.log(e.keyCode);
      if(e.keyCode == 38)
        upPressed = true;
      else if(e.keyCode == 40)
        downPressed = true;
    }

    const keyUpHandler = (e : KeyboardEvent) => {
      if(e.keyCode == 38)
        upPressed = false;
      else if(e.keyCode == 40)
        downPressed = false;
    }

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);



    var ballStopTime = 0;
    var loopCount = 0;

    function gameLoop()
    {

      if (global.game.scoreA != scores.scoreA || global.game.scoreB != scores.scoreB)
      {
        setScores({scoreA: global.game.scoreA, scoreB: global.game.scoreB});
      }

      if(new Date().getTime() - global.game.startTime < 2400){
        return;
      }

      if (downPressed)
        global.game.localX = Math.min((global.game.localX + 1), arenaWidth - lenghtBar/2);

      if (upPressed)
        global.game.localX = Math.max((global.game.localX - 1), lenghtBar/2);

      if (loopCount++ % 2 == 0)
        socket.current.emit('move', {localX: global.game.localX});

      if (global.game.ballY + global.game.velY > arenaWidth || global.game.ballY + global.game.velY < 0) {
        global.game.velY = -global.game.velY;
        global.game.didHit = 1;
        play();
      }

      if (Math.abs(global.game.ballY - global.game.localX) <= (lenghtBar + 2) / 2 && global.game.ballX <= -goal)
      {
        global.game.velX = -global.game.velX + 0.075;

        let hit = global.game.ballY - global.game.localX;
        let angle = Math.atan2(global.game.velY, global.game.velX);
        let size = Math.max(Math.sqrt(global.game.velX * global.game.velX + global.game.velY * global.game.velY) / 1, 0.5);

        if (hit > 2)
          angle = Math.min(angle + 0.5, 0.6);
        else if (hit < -2)
          angle = Math.max(angle - 0.5, -0.6);

        console.log(angle);

        global.game.velX = Math.cos(angle) * size;
        global.game.velY = Math.sin(angle) * size;

        global.game.bounceA = Math.PI;
        play();

        socket.current.emit('hitBall', {ballX: global.game.ballX, ballY: global.game.ballY, velX: global.game.velX, velY: global.game.velY});
      }
      /*else if (global.game.ballX >= goal)
      {
        global.game.velX = -global.game.velX - 0.075;
        global.game.opoX = global.game.ballY;

        global.game.bounceB = Math.PI;
        play();



        //global.game.scoreA += 1;
      }*/
      else if (global.game.ballX <= -(goal + 1) || global.game.ballX >= (goal + 1))
      {
        /*if (global.game.ballX < 0)
          global.game.scoreB += 1;
        else
          global.game.scoreA += 1;


        global.game.ballY = arenaWidth / 2;
        global.game.ballX = -0.14;
        global.game.velX = 0.4;
        global.game.velY = 0.4;

        global.game.localX = arenaWidth/2;
        global.game.opoX = arenaWidth/2;*/

        //ballStopTime = 9223372036854775807;

        if (global.game.ballX <= -(goal + 1))
        {
            socket.current.emit('tookGoal');
            global.game.scoreB++;
            global.game.ballY = arenaWidth / 2;
            global.game.ballX = -0.14;
        }

        global.game.velX = 0;
        global.game.velY = 0;


        playGoal();
      }



      if(new Date().getTime() - ballStopTime > 2000){
        global.game.ballX += global.game.velX;
        global.game.ballY += global.game.velY;
      }

    }

    const loop = setInterval(gameLoop, 30);

    return () => {
      clearInterval(loop);
      document.removeEventListener("keydown", keyDownHandler);
      document.removeEventListener("keyup", keyUpHandler);
    }
  }, []);


  return (
    <div>
      <PongFrame></PongFrame>

      <div className="backButton">
        <Link to={"/"}>Exit</Link>
      </div>
      <div className="score">
        {scores.scoreA} - {scores.scoreB}
      </div>
      {!started ?

      <div className="newgameContainer">
        <div className="newgameScreen">
          <h1>
            New Game
          </h1>

          {queueing ? <p>
            Waiting for opponent.
          </p> : <p>
            Mettre les options ici (puis info de match making)
          </p>}

          <div className="newgameButton" onMouseUp={() => {
            startQueue();
          }}>
            Start
          </div>
        </div>
      </div>

      : <></>}
    </div>
  )




}

export default Pong;
