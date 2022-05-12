import P5 from 'p5';
import Player from './Player';

export default class Ball {
  _p5: P5;
  _x: number;
  _y: number;
  _vx = 4;
  _vy = -4;
  _height: number;

  constructor(p5: P5, x: number, y: number, height: number) {
    this._p5 = p5;
    this._x = x;
    this._y = y;
    this._height = height;
  }

  draw() {
    const p5 = this._p5;
    p5.push();

    p5.noStroke();
    p5.fill('yellow');
    p5.ellipse(this._x, this._y, this._height / 70);

    p5.pop();
  }

  move() {
    if (this._y < 1) {
      this._vy = 4;
    }
    if (this._y > this._height) {
      this._vy = -4;
    }
    this._x += this._vx;
    this._y += this._vy;
  }

  collision(player: Player) {
    var d = this._p5.dist(player._centerX, player._centerY, this._x, this._y);
    if (d < 50) return true;
    return false;
  }
}
