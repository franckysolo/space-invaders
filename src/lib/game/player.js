/**
 * @author franckysolo
 */
 import BasePlayer from '../core/Player'

 const defaultOptions = {
   level: 1,
   score: 0,
   shot: 0,
   shotRemain: 55,
   life: 3
 }
 /**
  * The space-invaders player
  * @type {BasePlayer}
  */
 class Player extends BasePlayer {
   /**
    * Create a new player
    * @param  {String} name the player's name
    * @return void
    */
   constructor (name) {
     super(name, defaultOptions)
     this.name = name || 'Player 1'
   }
   /**
    * Init the player params
    * @return void
    */
   init () {
     this.level = this.options.level
     this.score = this.options.score
     this.shot = this.options.shot
     this.life = this.options.life
     this.shotRemain = this.options.shotRemain
   }
   /**
    * Re-Init the player params when changing level
    * @return void
    */
   changeLevel () {
     this.shot = this.options.shot
     this.shotRemain = this.options.shotRemain
   }
 }

 export { Player as default }
