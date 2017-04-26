/**
 * @author franckysolo
 */
import * as config from './config'
import Asset from '../core/Asset'
import Sprite from '../core/Sprite'

const defaultOptions = {
  tiles: {x: 315, y: 4, w: 46, h: 34}
}

class Bunker extends Asset {
  constructor (name, ctx, image = 'src/assets/img/bloc.png') {
    super(name)
    this.options = defaultOptions
    this.ctx = ctx
    this.resource = new Sprite(image)
    this.x = 0
    this.y = 0
    this.w = this.options.tiles.w
    this.h = 16
    this.sprites = {x: this.options.tiles.x, y: this.options.tiles.y}
    this.data = []
    this.template = []
  }

  init () {
    let xMax = this.resource.image.width
    let yMax = this.resource.image.height
    // Recreate table data from image bunker
    this.ctx.drawImage(this.resource.image, 0, 0)
    for (var i = 0; i <= xMax; i++) {
      this.data[i] = []
      for (var j = 0; j <= yMax; j++) {
        var clusters = this.resource.imageData(this.ctx, i, j, 1, 1)
        if (clusters && this.data[i]) {
          let r = clusters.data[0]
          let g = clusters.data[1]
          let b = clusters.data[2]
          let x = i + this.x
          let y = j + this.y
          this.data[i][j] = {x: x, y: y, v: true}
          if (r === 0 && g === 0 && b === 0) {
            this.data[i][j].v = false
          }
        }
      }
    }
  }
  /**
   * Detect bomb collision
   * @param  {[type]} laser [description]
   * @return {Boolean} [description]
   */
  bombCollision (laser, isFragmentBomb = true) {
    var x = laser.tx + laser.w
    var y = laser.y + laser.h + laser.speed
    let xMax = this.resource.image.width
    let yMax = this.resource.image.height
    for (var i = 0; i <= xMax; i++) {
      for (var j = 0; j <= yMax; j++) {
        var cx = this.data[i][j].x
        var cy = this.data[i][j].y
        var v = this.data[i][j].v
        if (x >= cx && x <= cx && y >= cy && v) {
          if (isFragmentBomb) {
            this.destroy(i, j, 4)
          } else {
            this.impact(i, j, 4)
          }
          return true
        }
      }
    }
    return false
  }

  collision (laser) {
    var x = laser.x + (laser.w / 2)
    var y = laser.y + laser.h
    let xMax = this.resource.image.width
    let yMax = this.resource.image.height
    for (var i = yMax; i >= 0; i--) {
      for (var j = xMax; j >= 0; j--) {
        var cx = this.data[j][i].x
        var cy = this.data[j][i].y
        var v = this.data[j][i].v
        if (x >= cx && x <= cx && y <= cy && v) {
          laser.state = config.LASER_HIT
          this.destruct(j, i, 5)
          break
        }
      }
    }
  }
  /**
   * Impact d'une bombe a fragmentation
   * @param  {[type]} i [description]
   * @param  {[type]} j [description]
   * @param  {[type]} def [description]
   * @return {[type]} [description]
   */
  destroy (i, j, def) {
    for (var x = -def; x <= def; x++) {
      if (this.data[i + x] && this.data[i + x][j + x]) {
        this.data[i + x][j + x].v = false
      }
      if (this.data[i - x] && this.data[i - x][j + x]) {
        this.data[i - x][j + x].v = false
      }
    }
  }
  /**
   * Laser DCA destruction
   * @param  {[type]} i [description]
   * @param  {[type]} j [description]
   * @param  {[type]} def [description]
   * @return {[type]} [description]
   */
  destruct (i, j, def) {
    for (var x = -def; x <= def; x++) {
      if (this.data[i + x] && this.data[i + x][j - x]) {
        this.data[i + x][j - x].v = false
      }
      if (this.data[i - x] && this.data[i - x][j - x]) {
        this.data[i - x][j - x].v = false
      }
    }
  }
  /**
   * Impact d'un missile red ship
   * @param  {[type]} i [description]
   * @param  {[type]} j [description]
   * @param  {[type]} def [description]
   * @return {[type]} [description]
   */
  impact (i, j, def) {
    for (var x = def; x >= -def; x--) {
      for (var y = def; y >= -def; y--) {
        if (this.data[i + x] && this.data[i + x][j + y] && this.data[i + x][j + y].v) {
          this.data[i + x][j + y].v = false
        }
      }
    }
    if (this.data[i] && this.data[i][j] && this.data[i][j].v) {
      this.data[i][j].v = false
    }
  }

  draw (ctx) {
    let xMax = this.resource.image.width
    let yMax = this.resource.image.height
    ctx.fillStyle = '#00fc00'
    for (var i = 0; i <= xMax; i++) {
      for (var j = 0; j <= yMax; j++) {
        var v = this.data[i][j].v
        if (v) {
          var x = i + this.x
          var y = j + this.y
          ctx.fillRect(x, y, 1, 1)
        }
      }
    }
  }
}

export { Bunker as default }
