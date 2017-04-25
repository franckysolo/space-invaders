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
import SpaceShip from './red-ship'
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
    // this.timerRedShip = setTimeout(() => this.newRedShip(), this.delayRedShip)
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
    // this.player.init()
    this.ship.init(this)
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
    if (this.ship.onFire()) {
      this.ship.laser.draw(this.ctx, this.sprites)
    }
    this.ship.draw(this.ctx, this.sprites)
    if (this.redShip) {
      this.redShip.draw(this.ctx, this.sprites)
      if (this.redShip.onFire()) {
        this.redShip.laser.draw(this.ctx, this.sprites)
      }
    }
  }
  /**
   * Game objects evolutions
   * @return void
   */
  evolution () {
    this.ship.evolution(this)
    if (this.redShip) {
      this.redShip.evolution(this)
      if (this.redShip.onFire() && this.redShip.laser.y + this.redShip.laser.h >= this.options.canvas.height) {
        this.redShip.laser.state = config.BOMB_HIT
        delete this.redShip.laser
      }
      if (this.redShip.x + this.redShip.w > this.options.canvas.width) {
        clearTimeout(this.timerRedShip)
        delete this.redShip
        this.delayRedShip = this.random(10000, 15000)
        this.timerRedShip = setTimeout(() => this.newRedShip(), this.delayRedShip)
      }
    }
  }
  /**
   * Game collisions
   * @return void
   */
  collisions () {
    if (this.redShip) {
      this.redShip.collision(this)
      if (this.redShip.onFire()) {
        this.redShip.laser.collision(this, this.redShip)
      }
    }
  }
  // update data game
  update () {
    // Game object collisions
    this.collisions()
    // Game objects evolution (moves)
    this.evolution()
    // Drawing game objects on Canvas
    this.draw()
    // Drawing Game params on user interface
    this.ui()
    // Tool debug
    // this.tool.render()
  }
  // the game over panel
  over () {
    this.canvas.clear()
    this.ctx.fillStyle = '#fff'
    this.ctx.font = '24px verdana bold'
    this.ctx.textAlign = 'center'
    this.ctx.fillText('GAME OVER', 200, 50)
    this.ctx.fillText(`SCORE ${this.player.score} points`, 200, 90)
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
