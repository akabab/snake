let fps = 60
let previousTick = Date.now()
let actualTicks = 0

const loop = update => {
  const now = Date.now()
  const tickLengthMs = 1000 / fps

  actualTicks++
  if (previousTick + tickLengthMs <= now) {
    const delta = (now - previousTick) / 1000
    previousTick = now

    update(delta)

    actualTicks = 0
  }

  if (Date.now() - previousTick < tickLengthMs - 16) {
    setTimeout(loop, 1, update)
  } else {
    setImmediate(loop, update)
  }
}

// Keyboard events
const readline = require('readline')
readline.emitKeypressEvents(process.stdin)
process.stdin.setRawMode(true)

const onKeyPress = cb => {
  process.stdin.on('keypress', (_, key) => {
    if (key.ctrl && key.name === 'c') { process.exit() }
    else { cb(key) }
  })
}


module.exports = {
  getFps: () => fps,
  setFps: newFps => fps = newFps,
  previousTick,
  actualTicks,
  loop,
  onKeyPress
}
