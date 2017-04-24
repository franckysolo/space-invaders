/**
 * @author franckysolo
 *
 * @description Base Player Class may be extended
 */

class Player {
  /**
   * [constructor description]
   * @param  {[type]} name [description]
   * @param  {[type]} options [description]
   * @return {[type]} [description]
   */
  constructor (name, options) {
    this.name = name
    this.options = options || {}
  }
  /**
   * [init description]
   * @return {[type]} [description]
   */
  init () {}
}

export { Player as default }
