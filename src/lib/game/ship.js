/**
 * @author franckysolo
 *
 * @description The ship class
 */

 import * as config from './config'
 import Asset from '../core/Asset'
 import Sound from '../core/Sound'
 import Laser from './ship-laser'

 const defaultOptions = {
   tile: { x: 277, y: 19 },
   destroy: { x: 367, y: 66, w: 30, h: 20 },
   dimension: { w: 26, h: 18 },
   mode: config.SHIP_NORMAL
 }

 class Ship extends Asset {
   /**
    * Create a new ship
    * @return {Void}
    */
   constructor (name = 'chip') {
     super(name)
     this.options = defaultOptions
     this.w = this.options.dimension.w
     this.h = this.options.dimension.h
     this.mode = this.options.mode
     this.speed = 2
     this.direction = null
     this.laser = null
     // sprites
     this.sprites = []
     this.sprites[config.SHIP_NORMAL] = {x: this.options.tile.x, y: this.options.tile.y}
     this.sprites[config.SHIP_EXPLODE] = {x: this.options.destroy.x, y: this.options.destroy.y}
     this.current = this.sprites[config.SHIP_NORMAL]
     // Sounds
     this.soundShoot = new Sound('src/assets/audio/shoot.wav')
     this.soundShoot.volume(5)
   }

   init (game) {
     this.x = game.options.canvas.width / 2 - this.w / 2
     this.y = game.options.canvas.height - 20
     this.direction = null
   }

   evolution (game) {
     if (this.direction === config.DIRECTION_RIGHT) {
       this.moveRight(game.options.canvas.width)
     } else if (this.direction === config.DIRECTION_LEFT) {
       this.moveLeft(0)
     }

     if (this.onFire()) {
       this.shoot()
       if (this.laser.y <= 0 || this.laser.state === config.LASER_HIT) {
         delete this.laser
       }
     }
   }

   onFire () {
     if (this.laser) {
       return true
     }
     return false
   }

   armed () {
     if (this.mode === config.SHIP_NORMAL && !this.onFire()) {
       this.laser = new Laser()
       this.laser.load(this.x + (this.w / 2 - this.laser.w), this.y + this.laser.h)
       this.soundShoot.play()
     }
   }

   shoot () {
     if (this.laser.state === config.LASER_ARMED) {
       this.laser.state = config.LASER_FIRE
     }

     if (this.laser.state === config.LASER_FIRE) {
       this.laser.shoot()
     }
   }

   moveRight (max) {
     if (this.x < max - this.w) {
       this.x += this.speed
     }
   }

   moveLeft (min) {
     if (this.x > min) {
       this.x -= this.speed
     }
   }

   draw (ctx, sprite) {
     let pos = this.sprites[this.mode]
     sprite.clip(ctx, pos.x, pos.y, this.w, this.h, this.x, this.y, this.w, this.h)
   }
 }

 export { Ship as default }
