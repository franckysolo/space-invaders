/**
 * @author franckysolo
 */

 import * as config from './config'
 import Asset from '../core/Asset'
 import Sound from '../core/Sound'

 const destroy = {
   x: 436,
   y: 67,
   w: 28,
   h: 18
 }

 class Invader extends Asset {
   /**
    * Create a new invader
    * @param  {String} name The invader code name
    * @param  {Integer} index The invader index
    * @param  {Object} options The invader type option (TypeA,TypeB,TypeC)
    * @return {Void}
    */
   constructor (name, index, options) {
     super(name)
     this.options = Object.assign(options, {destroy})
     this.index = index
     this.w = this.options.dimension.w
     this.h = this.options.dimension.h
     this.point = this.options.point
     this.offsetX = this.options.offsetX
     this.offsetY = this.options.offsetY
     this.margin = this.options.margin
     this.speed = 1
     this.offsetBottom = config.SZ_SPRITE_Y
     this.mode = config.INV_OPEN
     this.direction = config.DIRECTION_LEFT
     // sprites
     this.sprites = []
     this.sprites[config.INV_EMPTY] = {
       x: this.options.tile.empty.x,
       y: this.options.tile.empty.y
     }
     this.sprites[config.INV_OPEN] = {
       x: this.options.tile.open.x,
       y: this.options.tile.open.y
     }
     this.sprites[config.INV_CLOSE] = {
       x: this.options.tile.close.x,
       y: this.options.tile.close.y
     }
     this.sprites[config.INV_DESTROY] = {
       x: this.options.destroy.x,
       y: this.options.destroy.y,
       w: this.options.destroy.w,
       h: this.options.destroy.h
     }
     this.current = this.sprites[this.mode]
     // timers
     this.timerCount = 0
     this.timerEmpty = 0
     this.timerDown = 0
     this.delayDown = 10000
     this.maxFrame = 16
     this.laser = null
     // Sounds
     this.soundExplosion = new Sound('src/assets/audio/invaderkilled.wav')
     this.soundExplosion.volume(5)
     this.soundDestroy = new Sound('src/assets/audio/explosion.wav')
     this.soundDestroy.volume(5)
     this.soundBomb = new Sound('src/assets/audio/bomb.wav')
     this.soundBomb.volume(5)
   }

   init (game) {
     var delay = this.delayDown - (1000 * game.player.level)
     if (delay < 1000) {
       delay = 1000
     }
     // this.timerDown = setInterval(() => this.moveDown(), delay)
   }

   animate () {
     if (this.mode < 2) {
       if (this.timerCount > this.maxFrame) {
         this.mode = config.INV_CLOSE - this.mode
         this.current = this.sprites[this.mode]
         this.timerCount = 0
       } else {
         this.timerCount++
       }
     }
   }

   evolution (game) {
     if (this.onFire() && this.laser.state !== config.BOMB_HIT) {
       this.laser.state = config.BOMB_FIRE
     }

     if (this.onFire() && this.laser.state === config.BOMB_FIRE) {
       this.shoot()
       // this.soundBomb.play()
     }

     if (this.y + this.h >= game.bunkerZoneY - 10) {
       clearInterval(this.timerDown)
       game.ship.mode = config.SHIP_EXPLODE
       game.status = config.GAME_PAUSE
       this.soundDestroy.play()
       setTimeout(() => {
         game.status = config.GAME_OVER
       }, 1000)
     }
   }

   armed () {
     this.laser.load(this.x + this.w / 2, this.y + this.laser.h / 2)
   }

   shoot () {
     this.laser.shoot()
   }

   onFire () {
     if (this.laser) {
       return true
     }
     return false
   }

   collision (game) {
     var ship = game.ship
     var laser = ship.laser
     var empty = () => {
       this.mode = config.INV_EMPTY
       this.current = this.sprites[this.mode]
       game.aliensCount--
       if (this.onFire()) {
         delete this.laser
       }
       clearTimeout(this.timerEmpty)
     }

     if (ship.onFire() && this.hasCollision(laser, this) &&
     this.mode !== config.INV_EMPTY) {
       this.timerEmpty = setTimeout(empty, 500)
       this.mode = config.INV_DESTROY
       this.margin = 30
       this.offsetX = 6
       this.w = 28
       this.h = 18
       game.player.score += this.point
       game.player.shot++
       game.player.shotRemain--
       ship.laser.state = config.LASER_HIT
       ship.armed()
       this.current = this.sprites[this.mode]
       this.soundExplosion.play()
     }
     if (this.onFire() && this.laser.state === config.BOMB_HIT) {
       delete this.laser
     }

     if (this.laser && this.laser.y + this.laser.h > game.canvas.height) {
       this.laser = null
       window.alert('base detecetd')
     }
   }

   move (direction) {
     switch (direction) {
       case config.DIRECTION_LEFT:
         this.x -= this.speed
         break
       case config.DIRECTION_RIGHT:
         this.x += this.speed
         break
       default:
         break
     }
   }

   moveDown () {
     console.log('go down')
     this.y += this.offsetBottom
     this.maxFrame--
     this.speed += 0.5
     if (this.maxFrame < 6) {
       this.maxFrame = 6
     }
   }

   draw (ctx, sprite) {
     var pos = this.sprites[this.mode]
     var offset = this.x
     if (this.mode === config.INV_DESTROY) {
       this.w = pos.w
       this.h = pos.h
     }
     sprite.clip(ctx, pos.x, pos.y, this.w, this.h, offset, this.y, this.w, this.h)
   }
 }

 export { Invader as default }
