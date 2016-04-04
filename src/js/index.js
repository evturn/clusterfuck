import { SPEED, COLOR_DARK, COLOR_LIGHT, SHOOTING_SPEED } from './constants';
import { canvas, ctx } from './canvas';
import StarStream from './star-stream';
import { SpaceShip, PlayerShots } from './player';
import Opponents from './opponents';

function paintStars(stars) {
  ctx.fillStyle = COLOR_DARK;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = COLOR_LIGHT;
  stars.forEach(star => ctx.fillRect(star.x, star.y, star.size, star.size));
}

function drawTriangle(x, y, width, color, direction) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x - width, y);
  ctx.lineTo(x, direction === 'up' ? y - width : y + width);
  ctx.lineTo(x + width, y);
  ctx.lineTo(x - width, y);
  ctx.fill();
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function collision(target1, target2) {
  return (target1.x > target2.x - 20 && target1.x < target2.x + 20) && (target1.y > target2.y - 20 && target1.y < target2.y + 20);
}

function paintSpaceShip(x, y) {
  drawTriangle(x, y, 20, '#ff0000', 'up');
}

function paintEnemies(enemies) {
  enemies.forEach(enemy => {
    enemy.y += 5;
    enemy.x += getRandomInt(-15, 15);

    if (!enemy.isDead) {
      drawTriangle(enemy.x, enemy.y, 20, '#00ff00', 'down');
    }

    enemy.shots.forEach(shot => {
      shot.y += SHOOTING_SPEED;
      drawTriangle(shot.x, shot.y, 5, '#00ffff', 'down');
    });
  });
}

function paintPlayerShots(playerShots, enemies) {
  playerShots.forEach((shot, i) => {

    for (var l = 0; l < enemies.length; l++) {
      var enemy = enemies[l];

      if (!enemy.isDead && collision(shot, enemy)) {
        enemy.isDead = true;
        shot.x = shot.y = -100;
        break;
      }
    }

    shot.y -= SHOOTING_SPEED;
    drawTriangle(shot.x, shot.y, 5, '#ffff00', 'up');
  });
}

function gameOver(ship, enemies) {
  return enemies.some(enemy => {
    if (collision(ship, enemy)) {
      return true;
    }

    return enemy.shots.some(shot => collision(ship, shot));
  })
}

function renderScene(actors) {
  paintStars(actors.stars);
  paintSpaceShip(actors.spaceship.x, actors.spaceship.y);
  paintEnemies(actors.opponents);
  paintPlayerShots(actors.playerShots, actors.opponents);
}

Rx.Observable
  .combineLatest(
    StarStream,
    SpaceShip,
    Opponents,
    PlayerShots,
    (stars, spaceship, opponents, playerShots) => ({
      stars, spaceship, opponents, playerShots
    })
  )
  .sample(SPEED)
  .subscribe(renderScene);