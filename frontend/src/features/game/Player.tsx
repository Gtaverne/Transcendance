import P5 from 'p5';
import Ball from './Ball';

export default class Player {
  _p5: P5;
  _width: number;
  _height: number;
  _centerX: number;
  _centerY: number;
  _speed: number;
  _rightSide: boolean;
  _leftSide: boolean;
  _points = 0;

  constructor(
    p5: P5,
    width: number,
    height: number,
    centerX: number,
    centerY: number,
    right: boolean,
  ) {
    this._p5 = p5;
    this._width = width;
    this._height = height;
    this._centerX = centerX;
    this._centerY = centerY;
    this._speed = height / 15;
    this._rightSide = right;
    this._leftSide = !right;
  }

  draw() {
    const p5 = this._p5;

    p5.push();

    p5.fill('blue');
    p5.rect(this._centerX, this._centerY, this._width, this._height);

    p5.pop();
  }

  move() {
    if (
      this._p5.mouseY + this._height / 10 < this._centerY &&
      this._centerY > this._height / 2
    )
      this._centerY -= this._speed;
    else if (
      this._p5.mouseY > this._centerY + this._height / 10 &&
      this._centerY < this._p5.windowHeight - 147 - this._height / 2
    )
      this._centerY += this._speed;
  }

  newBall(ball: Ball) {
    if (this._leftSide) {
      if (ball._x > this._p5.windowWidth + this._p5.windowWidth / 3) {
        this._points++;
        ball._x = this._p5.windowHeight / 2;
        ball._y = this._p5.windowWidth / 2;
      }
    } else {
      if (ball._x < -this._p5.windowWidth / 3) {
        this._points++;
        ball._x = this._p5.windowHeight / 2;
        ball._y = this._p5.windowWidth / 2;
      }
    }
  }
}
