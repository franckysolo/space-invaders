/**
 * @author franckysolo
 *
 * @description The SpaceInvaders Game context class
 */

import * as config from './config'

import Context from '../core/Context'
import Canvas from '../core/Canvas'
import Sprite from '../core/Sprite'

import Player from './player'
import Ship from './ship'
// Invaders
import SpaceShip from './red-ship'
import Invader from './invader'
import Bomb from './bomb'
import Bunker from './bunker'
import TypeA from './invaders/type-a'
import TypeB from './invaders/type-b'
import TypeC from './invaders/type-c'

const defaultOptions = {
  sprites: 'src/assets/img/sprites.png',
  canvas: { width: 400, height: 300 }
}

class GameContext extends Context {
  constructor () {
    super('Space Invaders', defaultOptions)
    this.canvas = new Canvas(this.options.canvas)
    this.ctx = this.canvas.context
    this.sprites = new Sprite(this.options.sprites)
    this.player = new Player()
    this.ship = new Ship()
    this.player.init()
    // red ship
    this.redShip = null
    this.delayRedShip = this.random(10000, 15000)
    this.invaders = []
    this.direction = config.DIRECTION_RIGHT
    this.offsetCount = config.SZ_ROW - 1
    this.aliensCount = config.SZ_COL * config.SZ_ROW
    this.aliensCount = 1
    this.randCount = 0
    this.randMax = this.random(0, 500)
    this.bunkers = []
    this.yZone = this.canvas.options.height - 70
    // Game Over Zone
    this.initBunkers()
  }
  newRedShip () {
    this.redShip = new SpaceShip()
    this.redShip.init(this)
    this.redShip.sound.play()
  }
  /**
   * Generate random number
   * @param  {Integer} min
   * @param  {Integer} max
   * @return {Integer}
   */
  random (min, max) {
    return Math.floor(Math.random() * (max - min) + min)
  }
  // init the game context
  init () {
    this.status = config.GAME_PLAY
    this.ship.init(this)
    this.initInvaders()
    this.timerRedShip = setTimeout(() => this.newRedShip(), this.delayRedShip)
  }
  // Initialize Invaders
  initInvaders () {
    var options, name
    for (var i = 0; i < config.SZ_COL; i++) {
      this.invaders[i] = []
      for (var j = 0; j < config.SZ_ROW; j++) {
        let index = (i * j) + 1
        if (j === 0) {
          options = TypeC
          name = `TC${i}${j}`
        } else if (j >= 1 && j < 3) {
          options = TypeB
          name = `TB${i}${j}`
        } else {
          options = TypeA
          name = `TA${i}${j}`
        }
        let ai = new Invader(name, index, options)
        ai.init(this)
        ai.x = (i * (ai.w + ai.offsetX)) + ai.margin
        ai.y = config.SZ_SPRITE_Y + (j * config.SZ_SPRITE_Y)
        this.invaders[i][j] = ai
      }
    }
  }
  initBunkers () {
    for (var k = 0; k < 4; k++) {
      this.bunkers[k] = new Bunker('bunker-' + (k + 1), this.ctx)
      this.bunkers[k].y = this.yZone
      this.bunkers[k].x = (k * 45) + (this.bunkers[k].w * k) + 45
      this.bunkers[k].init()
    }
  }
  moveInvaders () {
    if (this.offsetCount <= 0) {
      this.offsetCount = config.SZ_ROW - 1
    } else {
      this.offsetCount--
    }

    for (var i = 0; i < config.SZ_COL; i++) {
      var j = this.offsetCount
      if (this.invaders[i][j]) {
        var ai = this.invaders[i][j]
        if (ai.mode !== config.INV_EMPTY) {
          this.direction = undefined !== ai.direction ? this.direction : ai.direction
          if (ai.direction === config.DIRECTION_LEFT && ai.x <= 0) {
            this.direction = config.DIRECTION_RIGHT
            break
          }
          if (ai.direction === config.DIRECTION_RIGHT &&
            ai.x >= this.options.canvas.width - ai.w) {
            this.direction = config.DIRECTION_LEFT
            break
          }
        }
      }
    }

    for (i = 0; i < config.SZ_COL; i++) {
      let ai = this.invaders[i][this.offsetCount]
      if (ai) {
        ai.direction = this.direction
        ai.move(ai.direction)
      }
    }
  }
  allShot () {
    for (let i = 0; i < config.SZ_COL; i++) {
      for (let j = 0; j < config.SZ_ROW; j++) {
        if (this.invaders[i][j].mode !== config.INV_EMPTY) {
          return false
        }
      }
    }
    return true
  }
  // game actions
  actions () {
    $(document.body).on('keydown', (e) => {
      e.preventDefault()
      let keyCode = e.keyCode
      switch (keyCode) {
        case 32:
          this.ship.armed()
          break
        case 39:
          this.ship.direction = config.DIRECTION_RIGHT
          break
        case 37:
          this.ship.direction = config.DIRECTION_LEFT
          break
        default:
          break
      }
    })
  }
  // draw on canvas
  draw () {
    this.canvas.clear()
    // Player ship drawing
    if (this.ship.onFire()) {
      this.ship.laser.draw(this.ctx, this.sprites)
    }
    this.ship.draw(this.ctx, this.sprites)
    // Invader red ship
    if (this.redShip) {
      this.redShip.draw(this.ctx, this.sprites)
      if (this.redShip.onFire()) {
        this.redShip.laser.draw(this.ctx, this.sprites)
      }
    }
    // Invaders ships
    for (var i = 0; i < config.SZ_COL; i++) {
      for (var j = 0; j < config.SZ_ROW; j++) {
        if (this.invaders[i][j].mode !== config.INV_EMPTY) {
          if (this.invaders[i][j].onFire()) {
            this.invaders[i][j].laser.draw(this.ctx, this.sprites)
          }
          this.invaders[i][j].draw(this.ctx, this.sprites)
        }
      }
    }
    // bunker zone
    this.ctx.strokeStyle = '#555'
    this.ctx.beginPath()
    this.ctx.setLineDash([10, 10])
    this.ctx.moveTo(0, this.yZone)
    this.ctx.lineTo(400, this.yZone)
    this.ctx.stroke()
    // Bunkers
    for (i = 0; i < 4; i++) {
      this.bunkers[i].draw(this.ctx)
    }
    if (this.status === config.GAME_REPLAY) {
      this.changeLevel()
    }
  }
  /**
   * Game objects evolutions
   * @return void
   */
  evolution () {
    if (this.allShot()) {
      clearInterval(this.timerOffset)
      this.status = config.GAME_REPLAY
    }
    this.ship.evolution(this)
    this.moveInvaders()
    if (this.redShip) {
      this.redShip.evolution(this)
      if (this.redShip.onFire() && this.redShip.laser.y + this.redShip.laser.h >= this.options.canvas.height) {
        this.redShip.laser.state = config.BOMB_HIT
        delete this.redShip.laser
      }
      if (this.redShip.x + this.redShip.w > this.options.canvas.width) {
        clearTimeout(this.timerRedShip)
        setTimeout(() => {
          delete this.redShip
        }, 1000)
        this.delayRedShip = this.random(10000, 15000)
        this.timerRedShip = setTimeout(() => this.newRedShip(), this.delayRedShip)
      }
    }

    for (var i = 0; i < config.SZ_COL; i++) {
      for (var j = 0; j < config.SZ_ROW; j++) {
        var invader = this.invaders[i][j]
        if (invader.mode !== config.INV_EMPTY) {
          invader.evolution(this)
        }
      }
    }
    if (this.randCount > this.randMax) {
      let idx = this.random(0, this.invaders.length - 1)
      let idy = this.random(0, this.invaders[0].length - 1)
      invader = this.invaders[idx][idy]
      if (invader.mode < 2) {
        this.randMax = this.random(0, 500)
        if (!invader.onFire() && invader.mode !== config.INV_EMPTY) {
          invader.laser = new Bomb()
          invader.armed()
        }
        this.randCount = 0
      }
    }
    this.randCount++
  }
  /**
   * Game object animation
   * @return void
   */
  animations () {
    for (var i = 0; i < config.SZ_COL; i++) {
      for (var j = 0; j < config.SZ_ROW; j++) {
        if (this.invaders[i][j].mode !== config.INV_EMPTY) {
          this.invaders[i][j].animate()
        }
        // Animation invader laser bomb
        if (this.invaders[i][j].onFire()) {
          this.invaders[i][j].laser.animate()
        }
      }
    }
  }
  /**
   * Game collisions
   * @return void
   */
  collisions () {
    for (var k = 0; k < 4; k++) {
      if (this.ship.onFire()) {
        this.bunkers[k].collision(this.ship.laser)
      }
    }
    if (this.redShip) {
      this.redShip.collision(this)
      if (this.redShip.onFire()) {
        this.redShip.laser.collision(this, this.redShip, true)
      }
    }

    for (var i = 0; i < config.SZ_COL; i++) {
      for (var j = 0; j < config.SZ_ROW; j++) {
        var invader = this.invaders[i][j]
        if (invader.mode !== config.INV_EMPTY) {
          invader.collision(this)
          if (invader.onFire()) {
            invader.laser.collision(this, invader)
          }
        }
      }
    }
  }
  // update data game
  update () {
    this.animations()
    // Game objects evolution (moves)
    this.evolution()
    // Game object collisions
    this.collisions()
    // Drawing game objects on Canvas
    this.draw()
    // Drawing Game params on user interface
    this.ui()
  }
  // the game over panel
  over () {
    clearTimeout(this.timerRedShip)
    this.canvas.clear()
    this.ctx.fillStyle = '#fff'
    this.ctx.font = '24px verdana bold'
    this.ctx.textAlign = 'center'
    this.ctx.fillText('GAME OVER', 200, 50)
    this.ctx.fillText(`SCORE ${this.player.score} points`, 200, 90)
  }
  // change game level panel
  changeLevel () {
    this.canvas.clear()
    this.ctx.fillStyle = '#fff'
    this.ctx.font = '24px verdana bold'
    this.ctx.textAlign = 'center'
    this.ctx.fillText('Congratulations new Level', 200, 50)
    this.ctx.fillText(`LEVEL ${this.player.level}`, 200, 90)
  }
  // Display Game params
  ui () {
    $('#level').html('LEVEL ' + this.player.level)
    $('#score').html('HIGH SCORE ' + this.player.score)
    $('#icon-life').html('CREDITS ' + this.player.life)
    var str = ''
    for (var i = 1; i < this.player.life; i++) {
      str += '<span class="ship" id="life-' + i + '"></span>'
    }
    $('#life').html(str)
  }
}

export { GameContext as default }
