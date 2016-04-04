import { COLOR_DARK, COLOR_LIGHT } from './constants';
import { canvas, ctx } from './canvas';
import StarStream from './star-stream';
import SpaceShip from './player';
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

function paintSpaceShip(x, y) {
  drawTriangle(x, y, 20, '#ff0000', 'up');
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function paintEnemies(enemies) {
  enemies.forEach(enemy => {
    enemy.y += 5;
    enemy.x += getRandomInt(-15, 15);
    drawTriangle(enemy.x, enemy.y, 20, '#00ff00', 'down');
  });
}

function renderScene(actors) {
  paintStars(actors.stars);
  paintSpaceShip(actors.spaceship.x, actors.spaceship.y);
  paintEnemies(actors.opponents);
}

const Game = Rx.Observable
  .combineLatest(
    StarStream,
    SpaceShip,
    Opponents,
    (stars, spaceship, opponents) => ({ stars, spaceship, opponents })
  );

Game.subscribe(renderScene);