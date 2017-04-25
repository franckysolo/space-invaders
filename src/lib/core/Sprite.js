/**
 * @author franckysolo
 *
 * @description Game Sprite 2d class
 */

class Sprite {
  /**
   * Create a new sprite
   *
   * @param  {String} filename the path to the sprite image
   * @param  {String} options the sprite options
   * @return {Void}
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
  /**
   * Clear the sprite
   *
   * @param  {CanvasRenderingContext2D} ctx
   * @param  {Integer} x the x sprite position
   * @param  {Integer} y the y sprite position
   * @param  {Integer} w the sprite width
   * @param  {Integer} h the sprite height
   * @return {Void}
   */
  clear (ctx, x, y, w, h) {
    w = w ? this.width : w
    h = h ? this.height : h
    ctx.clearRect(x, y, w, h)
  }
  /**
   * Draw the sprite on the canvas
   *
   * @param  {CanvasRenderingContext2D} ctx
   * @param  {Integer} x the x sprite position
   * @param  {Integer} y the y sprite position
   * @return {Void}
   */
  draw (ctx, x, y) {
    this.clip(ctx, 0, 0, this.width, this.height, x, y, this.width, this.height)
  }
  /**
   * Extract a sprite from the main image
   *
   * @param  {CanvasRenderingContext2D} ctx
   * @param  {Integer} sx the x sprite source position
   * @param  {Integer} sy the y sprite source position
   * @param  {Integer} sw the sprite source width
   * @param  {Integer} sh the sprite source height
   * @param  {Integer} dx the x sprite destination position
   * @param  {Integer} dy the y sprite destination position
   * @param  {Integer} dw the sprite destination width
   * @param  {Integer} dh the sprite destination height
   * @return {Void}
   */
  clip (ctx, sx, sy, sw, sh, dx, dy, dw, dh) {
    ctx.drawImage(this.image, sx, sy, sw, sh, dx, dy, dw, dh)
  }
  /**
   * Returns image data from context rendring
   *
   * @param  {CanvasRenderingContext2D} ctx
   * @param  {Integer} sx the x sprite source position
   * @param  {Integer} sy the y sprite source position
   * @param  {Integer} sw the sprite source width
   * @param  {Integer} sh the sprite source height
   * @return {Void}
   */
  imageData (ctx, sx, sy, sw, sh) {
    var data = ctx.getImageData(sx, sy, sw, sh)
    return data
  }
}

export { Sprite as default }
