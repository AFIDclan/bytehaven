const Rect = require('../../engine/utils/Rect.js');

class DOMViewport {

  constructor(entities, dom_id, dom_width, dom_height, view_rect) {
    
    this.dom_width = dom_width;
    this.dom_height = dom_height;

    this.center = view_rect.center;
    this.entities = entities;

    this.view_rect = view_rect;

    this.canvas = document.getElementById(dom_id);
    this.ctx = this.canvas.getContext("2d");

    this.canvas.width = dom_width;
    this.canvas.height = dom_height;
  }

  screen_to_world(screen_pos)
  {
    let center = this.view_rect.center;
    let scale = this.dom_width / this.view_rect.width;
    let x = screen_pos.x / scale + center.x - this.view_rect.width / 2;
    let y = screen_pos.y / scale + center.y - this.view_rect.height / 2;
    return {x: x, y: y};
  }
  
  render()
  {
    let entities = this.entities;
    
    let center = this.view_rect.center;
    //Set canvas to be game_width x game_height, centered on the center pose
    this.ctx.setTransform(this.dom_width / this.view_rect.width, 0, 0, this.dom_height / this.view_rect.height, 0, 0);
    this.ctx.translate(-center.x + this.view_rect.width / 2, -center.y + this.view_rect.height / 2);

    //Clear the canvas
    this.ctx.clearRect(center.x - this.view_rect.width / 2, center.y - this.view_rect.height / 2, this.view_rect.width, this.view_rect.height);

    //Draw all entities
    for (let entity of entities)
    {
      entity.draw(this.ctx);
    }
  }

}

module.exports = DOMViewport;