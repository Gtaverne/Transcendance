import React from 'react';
import Sketch from 'react-p5';
import p5Types from 'p5'; //Import this for typechecking and intellisense
import useWindowSize from '../hooks/useWindowSize';
import MyCircle from '../features/game/MyCircle';
import Player from '../features/game/Player';
import Ball from '../features/game/Ball';

interface ComponentProps {
  //Your component props
}

const Game: React.FC<ComponentProps> = (props: ComponentProps) => {
  const [windowHeight, windowWidth] = useWindowSize();
  let x = 50;
  const y = windowWidth / 2 - 150;
  var canvas;
  const myCircles: MyCircle[] = [];
  let a;
  var player1: Player;
  var player2: Player;
  var ball: Ball;

  const windowResized = (p5: p5Types) => {
    p5.resizeCanvas(windowWidth, windowHeight);
  };

  //See annotations in JS for more information
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.rectMode(p5.CENTER);
    canvas = p5.createCanvas(windowWidth, windowHeight);
    canvas.position(0, 147);
    canvas.style('z-index', '-1');

    player1 = new Player(
      p5,
      windowWidth / 100,
      windowHeight / 8,
      windowWidth / 50,
      windowHeight / 2,
      false,
    );

    player2 = new Player(
      p5,
      windowWidth / 100,
      windowHeight / 8,
      windowWidth - windowWidth / 50,
      windowHeight / 2,
      true,
    );

    ball = new Ball(p5, windowWidth / 2, windowHeight / 2, windowHeight);

    for (let i = 1; i < 4; i++) {
      const p = p5.width / 4;
      const circlePos = p5.createVector(p * i, p5.height / 2);
      const size = i % 2 !== 0 ? 24 : 32;
      myCircles.push(new MyCircle(p5, circlePos, size));
    }
  };

  const draw = (p5: p5Types) => {
    //Arena
    p5.background(0);
    p5.fill('grey');
    p5.rect(windowWidth / 2, windowHeight / 2, windowWidth / 80, windowHeight);
    p5.fill('white');

    //Random Test
    p5.ellipse(x, y, 70, 70);
    p5.rect(500, 500, 10, 100);
    myCircles.forEach((circle) => circle.draw());
    x++;

	//Score
	p5.textSize(windowWidth / 30);
	p5.fill(253, 248, 27);
	p5.textAlign(p5.CENTER)
	p5.text(player1._points, windowWidth * 0.25, windowWidth / 10);
	p5.text(player2._points, windowWidth * 0.75, windowWidth / 10);

    //Ball
    ball.move();
    ball.draw();

    //Players
    player1.move();
    player2.move();
    player1.draw();
    player2.draw();
    player1.newBall(ball);
    player2.newBall(ball);
	
	//Bouncing on the walls
    if (ball.collision(player1)) ball._vx = 4;
    if (ball.collision(player2)) ball._vx = -4;
  };

  return (
    <div className="gameWrapper">
      <div className="gameTopBar">
        <p>This Game is Played with your Mouse</p>
        <p>Join Waiting List</p>
        <p>
          Game Height: {windowHeight} | Game Width: {windowWidth}
        </p>
      </div>
      {/* Rouston, we've got a problem with sketch */}
      {/* <Sketch
        setup={setup}
        draw={draw}
        windowResized={windowResized}
        className="game"
      /> */}
    </div>
  );
};

export default Game;
