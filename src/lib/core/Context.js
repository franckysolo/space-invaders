/**
* @author franckysolo
*
* @description The game context class
*/
import Engine from './Engine'

class Context {
  /**
   * [constructor description]
   * @param  {[type]} name [description]
   * @param  {[type]} options [description]
   * @return {[type]} [description]
   */
  constructor (name, options) {
    this.engine = new Engine()
    this.name = name
    this.options = options || {}
    this.timer = null
  }
  // init the cogame context
  init () {
  }
  // game actions
  actions () {
  }
  // draw on canvas
  draw () {

  }
  // evolution game
  evolution () {
  }
  // update data game
  update () {
  }
  /**
   * [play description]
   * @param  {Function} callback [description]
   * @return {[type]} [description]
   */
  play (callback) {
    this.timer = this.engine.start(callback)
  }
  /**
   * [stop description]
   * @return {[type]} [description]
   */
  stop () {
    this.engine.stop(this.timer)
  }
}

export { Context as default }
