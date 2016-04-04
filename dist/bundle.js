(function () {
  'use strict';

  var SPEED = 40;
  var STAR_NUMBER = 250;
  var COLOR_DARK = '#000000';
  var COLOR_LIGHT = '#ffffff';
  var SHOOTING_SPEED = 15;

  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');

  document.body.appendChild(canvas);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

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
  });

  var PLAYER_Y = canvas.height - 30;
  var mouseMove = Rx.Observable.fromEvent(canvas, 'mousemove');

  var SpaceShip = mouseMove.map(function (e) {
    return {
      x: e.clientX,
      y: PLAYER_Y
    };
  }).startWith({
    x: canvas.width / 2,
    y: PLAYER_Y
  });

  var playerFiring = Rx.Observable.merge(Rx.Observable.fromEvent(canvas, 'click'), Rx.Observable.fromEvent(canvas, 'keydown').filter(function (e) {
    return e.keycode === 32;
  })).sample(200).timestamp();

  var PlayerShots = Rx.Observable.combineLatest(playerFiring, SpaceShip, function (shotEvents, spaceShip) {
    return {
      timestamp: shotEvents.timestamp,
      x: spaceShip.x
    };
  }).distinctUntilChanged(function (shot) {
    return shot.timestamp;
  }).scan(function (shotArray, shot) {
    shotArray.push({
      x: shot.x,
      y: PLAYER_Y
    });

    return shotArray;
  }, []);

  var ENEMY_FREQ = 1500;

  var Opponents = Rx.Observable.interval(ENEMY_FREQ).scan(function (enemyArray) {
    var enemy = {
      x: parseInt(Math.random() * canvas.width),
      y: -30
    };

    enemyArray.push(enemy);

    return enemyArray;
  }, []);

  function paintStars(stars) {
    ctx.fillStyle = COLOR_DARK;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = COLOR_LIGHT;
    stars.forEach(function (star) {
      return ctx.fillRect(star.x, star.y, star.size, star.size);
    });
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
    enemies.forEach(function (enemy) {
      enemy.y += 5;
      enemy.x += getRandomInt(-15, 15);
      drawTriangle(enemy.x, enemy.y, 20, '#00ff00', 'down');
    });
  }

  function paintPlayerShots(playerShots) {
    playerShots.forEach(function (shot) {
      shot.y -= SHOOTING_SPEED;
      drawTriangle(shot.x, shot.y, 5, '#ffff00', 'up');
    });
  }

  function renderScene(actors) {
    paintStars(actors.stars);
    paintSpaceShip(actors.spaceship.x, actors.spaceship.y);
    paintEnemies(actors.opponents);
    paintPlayerShots(actors.playerShots);
  }

  Rx.Observable.combineLatest(StarStream, SpaceShip, Opponents, PlayerShots, function (stars, spaceship, opponents, playerShots) {
    return {
      stars: stars, spaceship: spaceship, opponents: opponents, playerShots: playerShots
    };
  }).sample(SPEED).subscribe(renderScene);

}());