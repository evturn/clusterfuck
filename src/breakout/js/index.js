import Rx from 'rx'
import { canvas, context } from './canvas'
import {
  PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_KEYS, PADDLE_SPEED,
  BALL_RADIUS, BRICK_GAP, TICKER_INTERVAL
} from './constants'

const ticker$ = Rx.Observable
  .interval(TICKER_INTERVAL, Rx.Scheduler.requestAnimationFrame)
  .map(
    () => ({
      time: Date.now(),
      deltaTime: null
    })
  )
  .scan(
    (previous, current) => ({
      time: current.time,
      deltaTime: (current.time - previous.time) / 1000
    })
  );

const input$ = Rx.Observable
  .merge(
    Rx.Observable.fromEvent(document, 'keydown', event => {
      switch (event.keyCode) {
        case PADDLE_KEYS.left:
          return -1
        case PADDLE_KEYS.right:
          return 1
        default:
          return 0
      }
    }),
    Rx.Observable.fromEvent(document, 'keyup', event => 0)
  )
.distinctUntilChanged()

const paddle$ = ticker$
  .withLatestFrom(input$)
  .scan((position, [ticker, direction]) => {

    let next = position + direction * ticker.deltaTime * PADDLE_SPEED

    return Math.max(Math.min(next, canvas.width - PADDLE_WIDTH / 2), PADDLE_WIDTH / 2)

  }, canvas.width / 2)
  .distinctUntilChanged()

function drawTitle() {
  context.textAlign = 'center'
  context.font = '24px Courier New'
  context.fillText('Clusterfuck: Breakout', canvas.width / 2, canvas.height / 2 - 24)
}

function drawControls() {
  context.textAlign = 'center'
  context.font = '16px Courier New'
  context.fillText('press [<] and [>] to play', canvas.width / 2, canvas.height / 2)
}

function drawGameOver(text) {
  context.clearRect(canvas.width / 4, canvas.height / 3, canvas.width / 2, canvas.height / 3)
  context.textAlign = 'center'
  context.font = '24px Courier New'
  context.fillText(text, canvas.width / 2, canvas.height / 2)
}

function drawAuthor() {
  context.textAlign = 'center'
  context.font = '16px Courier New'
  context.fillText('by Manuel Wieser', canvas.width / 2, canvas.height / 2 + 24)
}

function drawScore(score) {
  context.textAlign = 'left'
  context.font = '16px Courier New'
  context.fillText(score, BRICK_GAP, 16)
}

function drawPaddle(position) {
  context.beginPath()
  context.rect(
    position - PADDLE_WIDTH / 2,
    context.canvas.height - PADDLE_HEIGHT,
    PADDLE_WIDTH,
    PADDLE_HEIGHT
    )
  context.fill()
  context.closePath()
}

function drawBall(ball) {
  context.beginPath()
  context.arc(ball.position.x, ball.position.y, BALL_RADIUS, 0, Math.PI * 2)
  context.fill()
  context.closePath()
}

function drawBrick(brick) {
  context.beginPath()
  context.rect(
    brick.x - brick.width / 2,
    brick.y - brick.height / 2,
    brick.width,
    brick.height
    )
  context.fill()
  context.closePath()
}

function drawBricks(bricks) {
  bricks.forEach((brick) => drawBrick(brick))
}