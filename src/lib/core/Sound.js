/**
 * @author franckysolo
 *
 * @description Game Audio Sound class
 */

class Sound {
  /**
   * [constructor description]
   * @param  {[type]} resource [description]
   * @return {[type]} [description]
   */
  constructor (resource) {
    this.driver = new Audio(resource)
  }
  play () {
    this.driver.play()
  }
  pause () {
    this.driver.pause()
  }
  stop () {
    this.driver.stop()
  }
  /**
   * [volume description]
   * @param  {[type]} value [description]
   * @return {[type]} [description]
   */
  volume (value) {
    this.driver.volume = value / 100
  }
}

export { Sound as default }
