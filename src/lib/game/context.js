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
import TypeA from './invaders/type-a'
// import TypeB from './invaders/type-b'
// import TypeC from './invaders/type-c'

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
    this.invaders = null

    this.randCount = 0
    this.randMax = this.random(0, 200)
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
    // Game Over Zone
    this.bunkerZoneY = this.ship.y
  }
  // Initialize Invaders
  initInvaders () {
    let ai = new Invader('TestA', 0, TypeA)
    ai.init(this)
    ai.x = 150
    ai.y = config.SZ_SPRITE_Y
    this.invaders = ai
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
    if (this.invaders.mode !== config.INV_EMPTY) {
      if (this.invaders.onFire()) {
        this.invaders.laser.draw(this.ctx, this.sprites)
      }
      this.invaders.draw(this.ctx, this.sprites)
    }
    this.ctx.strokeStyle = '#ff0000'
    this.ctx.beginPath()
    this.ctx.moveTo(0, this.bunkerZoneY)
    this.ctx.lineTo(400, this.bunkerZoneY)
    this.ctx.stroke()
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
    if (this.invaders.mode !== config.INV_EMPTY) {
      this.invaders.evolution(this)
      if (this.randCount > this.randMax) {
        // let idx = this.random(0, this.invaders.length - 1)
        // let idy = this.random(0, this.invaders[0].length - 1)
        // var invader = this.invaders[idx][idy]
        if (this.invaders.mode < 2) {
          this.randMax = this.random(25, 50)
          if (!this.invaders.onFire() && this.invaders.mode !== config.INV_EMPTY) {
            this.invaders.laser = new Bomb()
            this.invaders.armed()
          }
          this.randCount = 0
        }
      }
      this.randCount++
    }
  }
  /**
   * Game object animation
   * @return void
   */
  animations () {
    if (this.invaders.mode !== config.INV_EMPTY) {
      this.invaders.animate()
    }
    // Animation invader laser bomb
    if (this.invaders.onFire()) {
      this.invaders.laser.animate()
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
    if (this.invaders.mode !== config.INV_EMPTY) {
      this.invaders.collision(this)
      if (this.invaders.onFire()) {
        this.invaders.laser.collision(this, this.invaders)
      }
    }
    console.log('inv lazer', this.invaders.laser)
  }
  // update data game
  update () {
    this.animations()
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
