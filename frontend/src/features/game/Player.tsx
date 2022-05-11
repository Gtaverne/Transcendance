import P5 from 'p5';

export default class Player {
  _p5: P5;
  _width: number;
  _height: number;
  _centerX: number;
  _centerY: number;

  constructor(
    p5: P5,
    width: number,
    height: number,
    centerX: number,
    centerY: number,
  ) {
    this._p5 = p5;
    this._width = width;
    this._height = height;
    this._centerX = centerX;
    this._centerY = centerY;
  }

  draw() {
    const p5 = this._p5;

    p5.push();

    p5.fill('blue');
    p5.rect(this._centerX, this._centerY, this._width, this._height);

    p5.pop();
  }
}
