// HELPERS

const print = s => process.stdout.write(s)

const Array2d = (rows, cols, fill = 0) => Array(rows).fill(0).map(_ => Array(cols).fill(fill))

// const wait = ms => new Promise(_ => setTimeout(_, ms))

const Game = require('./Game.js')

// SNAKE

const GRID = {
  COLS: 20,
  ROWS: 10,
}

const SYMBOL = {
  SNAKE_BODY: '◈',
  GRID_TILE_EMPTY: ' ',
  APPLE: '',
}

const grid = Array2d(GRID.ROWS, GRID.COLS, SYMBOL.GRID_TILE_EMPTY)

const drawGrid = grid => {
  process.stdout.write('┌')
  for (let col = 0; col < GRID.COLS; col++) {
    process.stdout.write('─')
  }
  process.stdout.write('┐')
  process.stdout.write('\n')


  for (let row = 0; row < grid.length; row++) {
    process.stdout.write('│')

    for (let col = 0; col < grid[row].length; col++) {
      process.stdout.write(grid[row][col])
    }

    process.stdout.write('│')
    process.stdout.write('\n')
  }

  process.stdout.write('└')
  for (let col = 0; col < GRID.COLS; col++) {
    process.stdout.write('─')
  }
  process.stdout.write('┘')
  process.stdout.write('\n')

}

const snake = {
  positions: [
    { y: 2, x: 2}, // head
    { y: 2, x: 1},
    { y: 2, x: 0}, // tail
  ],
  lastMove: Date.now(),
  direction: 'right',
  c: SYMBOL.SNAKE_BODY
}

let score = 0
let speed = 2
let lastKeyPressed

const onKeyPress = key => {
  if (key.sequence === '+' || key.sequence === '=') { speed = speed + 1 <= 20 ? speed + 1 : speed }
  if (key.sequence === '-' || key.sequence === '_') { speed = speed - 1 >= 1 ? speed - 1 : speed }
  if (key.name === 'right') { snake.direction = 'right' }
  if (key.name === 'left') { snake.direction = 'left' }
  if (key.name === 'up') { snake.direction = 'up' }
  if (key.name === 'down') { snake.direction = 'down' }
  if (key.name === 'd') { Game.setFps(Game.getFps() - 1) }
  if (key.name === 'f') { Game.setFps(Game.getFps() + 1) }

  lastKeyPressed = key
}

const getRandomApplePosition = () => {
  const y = Math.floor(Math.random() * GRID.ROWS)
  const x = Math.floor(Math.random() * GRID.COLS)

  return { y, x }
}

const update = deltaTime => {

  // code here
  console.clear()

  // update snake positions

  if (Date.now() - snake.lastMove > 1000 / speed /* ms */) {

    let newPosition
    switch (snake.direction) {
      case 'right':
        newPosition = { y: snake.positions[0].y, x: snake.positions[0].x + 1 }
        break;
      case 'left':
        newPosition = { y: snake.positions[0].y, x: snake.positions[0].x - 1 }
        break;
      case 'up':
        newPosition = { y: snake.positions[0].y - 1, x: snake.positions[0].x }
        break;
      case 'down':
        newPosition = { y: snake.positions[0].y + 1, x: snake.positions[0].x }
        break;
    }

    snake.positions.unshift(newPosition)

    if (grid[newPosition.y][newPosition.x] === SYMBOL.APPLE) {
      score++

      const newApplePosition = getRandomApplePosition()
      // TODO: position should not collide with snake
      grid[newApplePosition.y][newApplePosition.x] = SYMBOL.APPLE
    } else {
      const prevTail = snake.positions.pop()
      grid[prevTail.y][prevTail.x] = SYMBOL.GRID_TILE_EMPTY
    }

    snake.lastMove = Date.now()
  }

  for (let pos of snake.positions) {
    grid[pos.y][pos.x] = snake.c
  }

  console.log('score: ' + score)

  drawGrid(grid)

  // LOGS

  console.log('===============LOGS===============')
  console.log('fps: ' + Game.getFps())
  console.log('Δ: ' + deltaTime)
  console.log('dir: ' + snake.direction)
  console.log('speed: ' + speed)
  console.log(`lastKeyPressed: ${JSON.stringify(lastKeyPressed)}`)
  console.log('===============LOGS===============')
}


grid[2][6] = SYMBOL.APPLE

Game.setFps(20)
Game.onKeyPress(onKeyPress)
Game.loop(update)