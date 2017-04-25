/**
 * @author franckysolo
 *
 * @description Game Audio Sound class
 */

class Sound {
  /**
   * Create a new game sound
   *
   * @param  {String} resource the path of the resource
   * @return void
   */
  constructor (resource) {
    this.driver = new Audio(resource)
  }
  /**
   * Play the audio sound
   * @return {Void}
   */
  play () {
    this.driver.play()
  }
  /**
   * Pause the audio sound
   * @return {Void}
   */
  pause () {
    this.driver.pause()
  }
  /**
   * Stop the audio sound
   * @return {Void}
   */
  stop () {
    this.pause()
    this.driver.currentTime = 0
  }
  /**
   * Change volume audio sound
   *
   * @param  {Integer} value the value of the volume
   * @return {Void}
   */
  volume (value) {
    this.driver.volume = value / 100
  }
}

export { Sound as default }
