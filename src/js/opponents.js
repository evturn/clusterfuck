import { canvas } from './canvas';

const ENEMY_FREQ = 1500;

const Opponents = Rx.Observable
  .interval(ENEMY_FREQ)
  .scan(enemyArray => {
    const enemy = {
      x: parseInt(Math.random() * canvas.width),
      y: -30
    };

    enemyArray.push(enemy);

    return enemyArray;
  }, []);

export default Opponents;