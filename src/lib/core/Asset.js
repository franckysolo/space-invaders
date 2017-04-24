/**
 * @author franckysolo
 *
 * @description Game Asset Base class
 */

 const SZ = 32

 class Asset {
   /**
    * [constructor description]
    * @param  {[type]} name [description]
    * @return {[type]} [description]
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
    * [hasCollision description]
    * @param  {[type]} a [description]
    * @param  {[type]} b [description]
    * @return {Boolean} [description]
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
