/**
 * @author franckysolo
 *
 * @description Game Sprite 2d class
 */

class Sprite {
  /**
   * [constructor description]
   * @param  {[type]} filename [description]
   * @param  {[type]} options [description]
   * @return {[type]} [description]
   */
  constructor (filename, options) {
    this.options = options || {}
    this.image = new window.Image()
    try {
      this.image.setAttribute('src', filename)
    } catch (e) {
      throw e
    }
    this.width = this.image.width
    this.height = this.image.height
  }
  clear (ctx, x, y, w, h) {
    w = w ? this.width : w
    h = h ? this.height : h
    ctx.clearRect(x, y, w, h)
  }
  draw (ctx, x, y) {
    this.clip(ctx, 0, 0, this.width, this.height, x, y, this.width, this.height)
  }
  clip (ctx, sx, sy, sw, sh, dx, dy, dw, dh) {
    ctx.drawImage(this.image, sx, sy, sw, sh, dx, dy, dw, dh)
  }
  imageData (ctx, sx, sy, sw, sh) {
    var data = ctx.getImageData(sx, sy, sw, sh)
    return data
  }
}

export { Sprite as default }
