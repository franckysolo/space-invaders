/**
 * @author franckysolo
 *
 * @description The Red ship class
 */

 import * as config from './config'
 import Sound from '../core/Sound'
 import Ship from './ship'
 import Bomb from './bomb'
 import 'babel-polyfill'

 const defaultOptions = {
   tile: { x: 215, y: 14 },
   destroy: { x: 436, y: 67, w: 28, h: 18 },
   empty: { x: 146, y: 35 },
   dimension: { w: 48, h: 24 },
   mode: config.RED_SHIP_NORMAL
 }

 class RedShip extends Ship {
   constructor () {
     super('red-chip')
     this.options = defaultOptions
     this.w = this.options.dimension.w
     this.h = this.options.dimension.h
     this.mode = this.options.mode
     this.speed = 2
     this.direction = null
     this.laser = null
     this.sprites = []
     this.sprites[config.RED_SHIP_NORMAL] = {
       x: this.options.tile.x,
       y: this.options.tile.y
     }
     this.sprites[config.RED_SHIP_DESTROY] = {
       x: this.options.destroy.x,
       y: this.options.destroy.y,
       w: this.options.destroy.w,
       h: this.options.destroy.h
     }
     this.sprites[config.RED_SHIP_EMPTY] = {x: this.options.empty.x, y: this.options.empty.y}
     this.current = this.sprites[config.RED_SHIP_NORMAL]
     this.timerEmpty = 0
     this.point = 100
     this.sound = new Sound('src/assets/audio/bonus.wav')
     this.sound.volume(5)
     this.soundExplosion = new Sound('src/assets/audio/explosion.wav')
     this.soundExplosion.volume(5)
   }

   init (game) {
     this.max = game.options.canvas.width - this.w
     this.x = 5
     this.y = 5
     this.randomValue = this.random(0, this.max)
   }

   random (min, max) {
     return Math.floor(Math.random() * (max - min) + min)
   }

   evolution (game) {
     this.move()
     if (this.onFire() && this.laser && this.laser.state === config.BOMB_FIRE) {
       this.shoot()
     } else {
       if (this.x >= this.randomValue && this.mode !== config.RED_SHIP_EMPTY) {
         this.armed()
       }
     }
   }

   collision (game) {
     var ship = game.ship
     var laser = ship.laser
     var empty = () => {
       this.mode = config.RED_SHIP_EMPTY
       this.current = this.sprites[this.mode]
       clearTimeout(this.timerEmpty)
     }
     if (ship.onFire() && this.hasCollision(laser, this) &&
     this.mode !== config.RED_SHIP_EMPTY) {
       this.sound.stop()
       this.soundExplosion.play()
       // this.laser.state = config.BOMB_ARMED
       this.timerEmpty = setTimeout(empty, 500)
       this.mode = config.RED_SHIP_DESTROY
       this.margin = 30
       this.offsetX = 6
       this.w = 28
       this.h = 18
       game.player.score += this.point
       ship.laser.state = config.LASER_HIT
       this.current = this.sprites[this.mode]
     }
   }

   move () {
     this.x += this.speed
   }

   armed () {
     this.laser = new Bomb()
     this.laser.load(this.x + this.w / 2, this.y + this.laser.h)
     this.laser.state = config.BOMB_FIRE
   }

   shoot () {
     if (this.laser && this.laser.state === config.BOMB_FIRE) {
       this.laser.tx = Math.floor(this.laser.x)
       this.laser.shoot()
     }
   }

   draw (ctx, sprite) {
     let pos = this.sprites[this.mode]
     sprite.clip(ctx, pos.x, pos.y, this.w, this.h, this.x, this.y, this.w, this.h)
   }
 }

 export { RedShip as default }
