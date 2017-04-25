/**
 * @author franckysolo
 *
 * @description Game Dev Tool
 */
import 'jquery'

class Tool {
  /**
   * Create a tool debug interface for developping game
   * @param  {String} containerId the div id
   * @return {Void}
   */
  constructor (containerId) {
    this.containerId = containerId
    this.assets = []
    this.index = 0
    this.actions()
  }
  /**
   * Button action
   * @return {Void}
   */
  actions () {
    var container = $('#game-tool-container')
    var btn = $('#game-tool-toggle')
    btn.on('click', (e) => {
      if (container.hasClass('open')) {
        container.removeClass('open').addClass('close')
      } else if (container.hasClass('close')) {
        container.removeClass('close').addClass('open')
      }
    })
  }
  /**
   * Add an asset to the debug interface
   * @param {Object} asset
   */
  add (asset) {
    this.assets.push(asset)
    this.index++
  }
  /**
   * Remove an asset from the debug interface
   * @param  {Object} asset
   * @return {Void}
   */
  remove (index) {
    // console.log(this.assets, name)
    // let index = this.assets.findIndex(a => a.name === name)
    window.alert(index)
    this.assets.slice(index, 1)
  }
  /**
   * Render the debug interface objects
   * @return {Void}
   */
  render () {
    var container = $(this.containerId)
    container.html('')
    this.assets.forEach((a, i) => {
      let div = $('<div>')
      let content = `
      <div class="panel-heading">
        <h2 class="panel-title">Asset ${a.name}</h2>
      </div>
      <div class="table-responsive">
        <table class="table table-bordered table-condensed">
          <thead>
            <tr class="text-center">
              <th>x</th>
              <th>y</th>
              <th>w</th>
              <th>h</th>
            </tr>
          </thead>
          <tbody>
            <tr class="text-center">
              <td><var>${a.x}</var></td>
              <td><var>${a.y}</var></td>
              <td><var>${a.w}</var></td>
              <td><var>${a.h}</var></td>
            </tr>
          </tbody>
        </table>
      </div>
      `
      div.attr({
        id: 'asset_' + i,
        class: 'panel panel-default'
      }).html(content)
      container.append(div)
    })
  }
}

export { Tool as default }
