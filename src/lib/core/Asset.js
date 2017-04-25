/**
 * @author franckysolo
 *
 * @description Game Asset Base class
 */

 const SZ = 32

 class Asset {
   /**
    * Create a new asset
    * @param  {String} name the asset's name
    * @return void
    */
   constructor (name) {
     this.name = name
     this.options = {}
     this.w = SZ
     this.h = SZ
     this.x = 0
     this.y = 0
   }
   /**
    * Detect a collision between two game object
    * @param  {Object} a The first game object
    * @param  {Object} b The second game object
    * @return {Boolean} true if a collision is detect else false
    */
   hasCollision (a, b) {
     if ((b.x >= a.x + a.w) ||
     (b.x + b.w <= a.x) ||
     (b.y >= a.y + a.h) ||
     (b.y + b.h <= a.y)) {
       return false
     }

     return true
   }
 }

 export { Asset as default }
