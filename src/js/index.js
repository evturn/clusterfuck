console.log('sup with them cookies?');

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

document.body.appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const SPEED = 40;
const STAR_NUMBER = 250;
const COLOR_DARK = '#000000';
const COLOR_LIGHT = '#ffffff';

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