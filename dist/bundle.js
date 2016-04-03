(function () {
  'use strict';

  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');

  document.body.appendChild(canvas);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  var SPEED = 40;
  var STAR_NUMBER = 250;
  var COLOR_DARK = '#000000';
  var COLOR_LIGHT = '#ffffff';

  var StarStream = Rx.Observable.range(1, STAR_NUMBER).map(function () {
    return {
      x: parseInt(Math.random() * canvas.width),
      y: parseInt(Math.random() * canvas.height),
      size: Math.random() * 3 + 1
    };
  }).toArray().flatMap(function (starArray) {
    return Rx.Observable.interval(SPEED).map(function () {
      starArray.forEach(function (star) {
        if (star.y >= canvas.height) {
          star.y = 0;
        }

        star.y += 3;
      });

      return starArray;
    });
  }).subscribe(function (starArray) {
    return paintStars(starArray);
  });

  function paintStars(stars) {
    ctx.fillStyle = COLOR_DARK;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = COLOR_LIGHT;
    stars.forEach(function (star) {
      return ctx.fillRect(star.x, star.y, star.size, star.size);
    });
  }

}());