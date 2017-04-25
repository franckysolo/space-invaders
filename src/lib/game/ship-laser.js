/**
 * @author franckysolo
 *
 * @description The ship laser class
 */

import * as config from './config'
import Asset from '../core/Asset'

const defaultOptions = {
  tile: { x: 414, y: 71 },
  dimension: { w: 2, h: 10 },
  speed: 10
}

class ShipLaser extends Asset {
  constructor () {
    super('ship-laser')
    this.options = defaultOptions
    this.w = this.options.dimension.w
    this.h = this.options.dimension.h
    this.speed = this.options.speed
    this.sprites = { x: this.options.tile.x, y: this.options.tile.y }
    this.state = config.LASER_ARMED
  }

  load (x, y) {
    this.x = x
    this.y = y
  }

  shoot () {
    this.y -= this.speed
  }

  draw (ctx, sprite) {
    let pos = this.sprites
    sprite.clip(ctx, pos.x, pos.y, this.w, this.h, this.x, this.y, this.w, this.h)
  }
}

export { ShipLaser as default }
