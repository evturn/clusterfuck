import { canvas } from './canvas';
import { ENEMY_FREQ, ENEMY_SHOOTING_FREQ } from './constants';

function isVisible(obj) {
  return obj.x > -40 && obj.x < canvas.width + 40 && obj.y > -40 && obj.y < canvas.height + 40;
}

const Opponents = Rx.Observable
  .interval(ENEMY_FREQ)
  .scan(enemyArray => {
    const enemy = {
      x: parseInt(Math.random() * canvas.width),
      y: -30,
      shots: []
    };

    Rx.Observable
      .interval(ENEMY_SHOOTING_FREQ)
      .subscribe(() => {
        if (!enemy.isDead) {
          enemy.shots.push({
            x: enemy.x,
            y: enemy.y
          });
        }

        enemy.shots = enemy.shots.filter(isVisible);
      });

    enemyArray.push(enemy);

    return enemyArray
      .filter(isVisible)
      .filter(enemy => !(enemy.isDead && enemy.shots.length === 0));
  }, []);

export default Opponents;