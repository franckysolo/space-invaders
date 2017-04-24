/**
 * @author franckysolo
 *
 * @description The Game Engine class
 */

 const defaultOptions = {
   fps: 60,
   frameRate: 1000
 }

 class Engine {
   constructor () {
     this.options = defaultOptions
     this.fps = this.options.fps
   }
   start (funct) {
     if (window.requestAnimationFrame) {
       return window.requestAnimationFrame(funct)
     } else {
       return setTimeout(funct, this.frameRate / this.fps)
     }
   }
   stop (timer) {
     if (window.cancelAnimationFrame) {
       return window.cancelAnimationFrame(timer)
     } else {
       return clearTimeout(timer)
     }
   }
 }

 export { Engine as default }
