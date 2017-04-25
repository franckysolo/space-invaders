import Game from './context'
import * as config from './config'

class SpaceInvaders {
  constructor () {
    this.version = '3.0.0'
    this.init()
  }

  init () {
    this.game = new Game()
    this.game.init()
    this.game.actions()
    // $('#game-play').hide()
  }

  // Main game loop
  run () {
    switch (this.game.status) {
      case config.GAME_PLAY:
        this.play()
        this.game.update()
        break
      case config.GAME_REPLAY:
        this.replay()
        this.game.update()
        break
      case config.GAME_PAUSE:
        this.pause()
        break
      case config.GAME_OVER:
        this.gameOver()
        $('#game-play').show().on('click', (e) => {
          this.init()
          this.run()
        })
        break
    }
  }

  play () {
    this.game.play(() => this.run())
    if (this.game.player.life === 0) {
      this.game.status = config.GAME_OVER
    }
  }

  replay () {
    this.game.stop()
    this.game.player.level++
    this.game.init()
    let fn = () => {
      this.run()
      this.game.status = config.GAME_Play
    }
    setTimeout(fn, 1000)
  }

  pause () {
    this.game.stop()
    this.game.player.life--
    this.game.status = config.GAME_PLAY
    let fn = () => {
      this.game.ship.mode = config.SHIP_NORMAL
      this.run()
    }
    setTimeout(fn, 1000)
  }

  gameOver () {
    this.game.over()
  }
}

export { SpaceInvaders as default }
