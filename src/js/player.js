import { canvas } from './canvas';

const PLAYER_Y = canvas.height - 30;
const mouseMove = Rx.Observable.fromEvent(canvas, 'mousemove');

export const SpaceShip = mouseMove
  .map(e => ({
      x: e.clientX,
      y: PLAYER_Y
    })
  )
  .startWith({
    x: canvas.width / 2,
    y: PLAYER_Y
  });

const playerFiring = Rx.Observable
  .merge(
    Rx.Observable.fromEvent(canvas, 'click'),
    Rx.Observable.fromEvent(canvas, 'keydown')
      .filter(e => e.keycode === 32)
  )
  .sample(200)
  .timestamp();

export const PlayerShots = Rx.Observable
  .combineLatest(
    playerFiring,
    SpaceShip,
    (shotEvents, spaceShip) => ({
      timestamp: shotEvents.timestamp,
      x: spaceShip.x
    })
  )
  .distinctUntilChanged(shot => shot.timestamp)
  .scan((shotArray, shot) => {
    shotArray.push({
      x: shot.x,
      y: PLAYER_Y
    });

    return shotArray;
  }, []);