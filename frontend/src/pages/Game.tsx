import React from 'react';
import Sketch from 'react-p5';
import p5Types from 'p5'; //Import this for typechecking and intellisense
import useWindowSize from '../hooks/useWindowSize';
import MyCircle from '../features/game/MyCircle';
import Player from '../features/game/Player';

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
    );

    player2 = new Player(
      p5,
      windowWidth / 100,
      windowHeight / 8,
      windowWidth - windowWidth / 50,
      windowHeight / 2,
    );

    for (let i = 1; i < 4; i++) {
      const p = p5.width / 4;
      const circlePos = p5.createVector(p * i, p5.height / 2);
      const size = i % 2 !== 0 ? 24 : 32;
      myCircles.push(new MyCircle(p5, circlePos, size));
    }
  };

  const draw = (p5: p5Types) => {
    p5.background(0);
    p5.ellipse(x, y, 70, 70);
    p5.rect(500, 500, 10, 100);
    p5.fill('grey');
    p5.rect(windowWidth / 2, windowHeight / 2, windowWidth / 80, windowHeight);
    p5.fill('white');

    myCircles.forEach((circle) => circle.draw());
    player1.draw();
    player2.draw();
    x++;
  };

  return (
    <div className="gameWrapper">
      <div className="gameTopBar">
        <p>insert button</p>
        <p>Join Waiting List</p>
        <p>
          Game Height: {windowHeight} | Game Width: {windowWidth}
        </p>
      </div>
      <Sketch
        setup={setup}
        draw={draw}
        windowResized={windowResized}
        className="game"
      />
    </div>
  );
};

export default Game;
