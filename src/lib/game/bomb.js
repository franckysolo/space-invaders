/**
 * @author franckysolo
 */
 import * as config from './config'
 import ShipLaser from './ship-laser'
 import Sound from '../core/Sound'

 const defaultOptions = {
   tile: { x: 306, y: 66, xx: 337 },
   dimension: { w: 10, h: 16 },
   speed: 5
 }

 class Bomb extends ShipLaser {
   constructor () {
     super('bomb')
     this.options = defaultOptions
     this.w = this.options.dimension.w
     this.h = this.options.dimension.h
     this.tx = this.x
     this.speed = this.options.speed
     this.mode = config.BOMB_OPEN
     this.sprites = []
     this.timerCount = 0
     this.maxFrame = 4
     this.sprites[config.BOMB_OPEN] = {x: this.options.tile.x, y: this.options.tile.y}
     this.sprites[config.BOMB_CLOSE] = {x: this.options.tile.xx, y: this.options.tile.y}
     this.current = this.sprites[this.mode]
     this.state = config.BOMB_ARMED
     // Sounds
     this.soundDestroy = new Sound('src/assets/audio/explosion.wav')
     this.soundDestroy.volume(5)
     // sound for collision laser.invader vs laser.ship
   }
   /**
    * [collision description]
    * @param  {[type]} game [description]
    * @param  {[type]} invader [description]
    * @return {[type]} [description]
    */
   collision (game, invader, isRedShip = false) {
     // var c = null
     var ship = game.ship
     var laser = ship.laser
     for (var k = 0; k < 4; k++) {
       var b = game.bunkers[k]
       if (b.bombCollision(this, !isRedShip)) {
         this.state = config.BOMB_HIT
         break
       }
     }

     if (this.hasCollision(ship, this)) {
       ship.mode = config.SHIP_EXPLODE
       this.state = config.BOMB_HIT
       game.status = config.GAME_PAUSE
       this.soundDestroy.play()
     }

     if (ship.onFire()) {
       if (this.hasCollision(laser, this)) {
         invader.armed()
         ship.armed()
         this.state = config.BOMB_HIT
         delete ship.laser
       }
     }
   }

   shoot () {
     if (this.state === config.BOMB_FIRE) {
       this.y += this.speed
     }
   }

   animate () {
     if (this.timerCount > this.maxFrame) {
       this.mode = config.BOMB_CLOSE - this.mode
       this.current = this.sprites[this.mode]
       this.timerCount = 0
     } else {
       this.timerCount++
     }
   }

   draw (ctx, sprite) {
     if (this.state === config.BOMB_FIRE) {
       let pos = this.sprites[this.mode]
       sprite.clip(ctx, pos.x, pos.y, this.w, this.h, this.x, this.y, this.w, this.h)
     } else {
       sprite.clear(ctx, 0, 0, this.w, this.h)
     }
   }
 }

 export { Bomb as default }
