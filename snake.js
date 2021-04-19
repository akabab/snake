// HELPERS

const print = s => process.stdout.write(s)

const Array2d = (rows, cols, fill = 0) => Array(rows).fill(0).map(_ => Array(cols).fill(fill))

// const wait = ms => new Promise(_ => setTimeout(_, ms))


const Game = require('./Game.js')

// SNAKE

const grid = Array2d(10, 20, '.')

const drawGrid = grid => {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      process.stdout.write(grid[row][col])
    }
    process.stdout.write('\n')
  }
}

const player = {
  positions: [
    { y: 2, x: 2}, // head
    { y: 2, x: 1},
    { y: 2, x: 0}, // tail
  ],
  lastMove: Date.now(),
  direction: 'right',
  c: 'x'
}

let speed = 2
let lastKeyPressed


const onKeyPress = key => {
  if (key.sequence === '+' || key.sequence === '=') { speed = speed + 1 <= 20 ? speed + 1 : speed }
  if (key.sequence === '-' || key.sequence === '_') { speed = speed - 1 >= 1 ? speed - 1 : speed }
  if (key.name === 'right') { player.direction = 'right' }
  if (key.name === 'left') { player.direction = 'left' }
  if (key.name === 'up') { player.direction = 'up' }
  if (key.name === 'down') { player.direction = 'down' }
  if (key.name === 'd') { Game.setFps(Game.getFps() - 1) }
  if (key.name === 'f') { Game.setFps(Game.getFps() + 1) }

  lastKeyPressed = key
}


const update = deltaTime => {

  // code here
  console.clear()

  // update player positions

  if (Date.now() - player.lastMove > 1000 / speed /* ms */) {

    if (player.direction === 'right') {
      player.positions.unshift({ y: player.positions[0].y, x: player.positions[0].x + 1 })
    }
    if (player.direction === 'left') {
      player.positions.unshift({ y: player.positions[0].y, x: player.positions[0].x - 1 })
    }
    if (player.direction === 'up') {
      player.positions.unshift({ y: player.positions[0].y - 1, x: player.positions[0].x })
    }
    if (player.direction === 'down') {
      player.positions.unshift({ y: player.positions[0].y + 1, x: player.positions[0].x })
    }

    const prevTail = player.positions.pop()
    grid[prevTail.y][prevTail.x] = '.'

    player.lastMove = Date.now()
  }

  for (let pos of player.positions) {
    grid[pos.y][pos.x] = player.c
  }

  drawGrid(grid)

  // LOGS

  console.log('fps: ' + Game.getFps())
  console.log('Δ: ' + deltaTime)
  console.log('dir: ' + player.direction)
  console.log('speed: ' + speed)
  console.log(`lastKeyPressed: ${JSON.stringify(lastKeyPressed)}`)
}

Game.setFps(20)
Game.onKeyPress(onKeyPress)
Game.loop(update)
