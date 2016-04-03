import { canvas } from './canvas';

const PLAYER_Y = canvas.height - 30;
const mouseMove = Rx.Observable.fromEvent(canvas, 'mousemove');

const SpaceShip = mouseMove
  .map(e => ({
      x: e.clientX,
      y: PLAYER_Y
    })
  )
  .startWith({
    x: canvas.width / 2,
    y: PLAYER_Y
  });