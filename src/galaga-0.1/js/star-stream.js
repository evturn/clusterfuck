import { canvas } from './canvas';
import { STAR_NUMBER, SPEED } from './constants';

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

export default StarStream;