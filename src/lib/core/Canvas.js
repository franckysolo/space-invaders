/**
 * @author franckysolo
 *
 * @description The Canvas class
 */

import 'jquery'

const defaultOptions = {
  canvasId: '#game',
  context: '2d',
  width: 400,
  height: 300,
  background: '#000'
}

class Canvas {
  /**
   * [constructor description]
   * @param  {[type]} options [description]
   * @return {[type]} [description]
   */
  constructor (options) {
    this.options = Object.assign(options, defaultOptions)
    this.canvas = $(this.options.canvasId)
    if (this.canvas) {
      this.canvas.attr({
        width: this.options.width,
        height: this.options.height
      }).css({
        background: this.options.background
      })
      this.context = this.canvas.get(0).getContext(this.options.context)
      this.canvas.focus()
    }
  }
  /**
   * [clear description]
   * @return {[type]} [description]
   */
  clear () {
    this.context.clearRect(0, 0, this.options.width, this.options.height)
  }
}

export { Canvas as default }
