/**
 * @author franckysolo
 *
 * @description Base Player Class may be extended
 */

class Player {
  /**
   * Create a new player
   * @param  {String} name The player's name
   * @param  {Object} options The player Options
   * @return void
   */
  constructor (name, options) {
    this.name = name
    this.options = options || {}
  }
  /**
   * Initialize the player datas
   * @return void
   */
  init () {}
}

export { Player as default }
