import { STAR_NUMBER, SPEED, COLOR_DARK, COLOR_LIGHT } from './constants';
import { canvas, ctx } from './canvas';
import SpaceShip from './player';


const StarStream = Rx.Observable
  .range(1, STAR_NUMBER)
  .map(() => ({
      x: parseInt(Math.random() * canvas.width),
      y: parseInt(Math.random() * canvas.height),
      size: Math.random() * 3 + 1
    })
  )
  .toArray()
  .flatMap(starArray => {
    return Rx.Observable
      .interval(SPEED)
      .map(() => {
        starArray.forEach(star => {
          if (star.y >= canvas.height) {
            star.y = 0;
          }

          star.y += 3;
        });

        return starArray;
      });
  });

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

function renderScene(actors) {
  paintStars(actors.stars);
  paintSpaceShip(actors.spaceship.x, actors.spaceship.y);
}

const Game = Rx.Observable
  .combineLatest(
    StarStream,
    SpaceShip,
    (stars, spaceship) => ({ stars, spaceship })
  );

Game.subscribe(renderScene);