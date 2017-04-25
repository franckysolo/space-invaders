/**
 * @author franckysolo
 *
 * @description The game context class
 */
import Engine from './Engine'

class Context {
  /**
   * Create a new game context
   *
   * @param  {String} name The game name
   * @param  {Object} options The game options
   * @return void
   */
  constructor (name, options) {
    this.engine = new Engine()
    this.name = name
    this.options = options || {}
    this.timer = null
  }
  /**
   * Initialize the game context
   * @return void
   */
  init () {
  }
  /**
   * Game player actions
   * @return void
   */
  actions () {
  }
  /**
   * Game objects drawing
   * @return void
   */
  draw () {
    this.canvas.clear()
  }
  /**
   * Game objects evolution
   * @return void
   */
  evolution () {
  }
  /**
   * Update data game
   * @return void
   */
  update () {
  }
  /**
   * The game loop
   * @param  {Function} callback
   * @return void
   */
  play (callback) {
    this.timer = this.engine.start(callback)
  }
  /**
   * Stop the game
   * @return void
   */
  stop () {
    this.engine.stop(this.timer)
  }
}

export { Context as default }
