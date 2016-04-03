import { canvas, ctx } from './canvas';
import {
  STAR_NUMBER, SPEED,
  COLOR_DARK, COLOR_LIGHT } from './constants';


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
  })
  .subscribe(
    starArray => paintStars(starArray)
  );

function paintStars(stars) {
  ctx.fillStyle = COLOR_DARK;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = COLOR_LIGHT;
  stars.forEach(star => ctx.fillRect(star.x, star.y, star.size, star.size));
}