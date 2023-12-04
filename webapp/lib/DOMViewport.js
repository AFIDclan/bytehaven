const Rect = require('../../engine/utils/Rect.js');

class DOMViewport {

  constructor(entities, dom_id, dom_width, dom_height, view_rect, background_images) {
    
    this.dom_width = dom_width;
    this.dom_height = dom_height;

    this.center = view_rect.center;
    this.entities = entities;

    this.view_rect = view_rect;

    this.canvas = document.getElementById(dom_id);
    this.ctx = this.canvas.getContext("2d");

    this.canvas.width = dom_width;
    this.canvas.height = dom_height;

    this.background_images = background_images;

  }

  screen_to_world(screen_pos)
  {
    let center = this.view_rect.center;
    let scale = this.dom_width / this.view_rect.size.x;
    let x = screen_pos.x / scale + center.x - this.view_rect.size.x / 2;
    let y = screen_pos.y / scale + center.y - this.view_rect.size.y / 2;
    return {x: x, y: y};
  }
  
  render()
  {
    let entities = this.entities;
    let background_pat = this.ctx.createPattern(this.background_images[0], "repeat");    
    
    //Clear the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);


    //Draw background
    this.ctx.save();
    this.ctx.fillStyle = background_pat;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.fillRect(0, 0, this.dom_width, this.dom_height);
    this.ctx.restore();

    let center = this.view_rect.center;
    //Set canvas to be game_width x game_height, centered on the center pose
    this.ctx.setTransform(this.dom_width / this.view_rect.size.x, 0, 0, this.dom_height / this.view_rect.size.y, 0, 0);
    

    /*
    for (let i=1; i<this.background_images.length; i++)
    {
      this.ctx.save();
      this.ctx.translate((-center.x/4) + this.view_rect.size.x / 2, (-center.y/4) + this.view_rect.size.y / 2);
      this.ctx.fillStyle = this.ctx.createPattern(this.background_images[i], "repeat");
      this.ctx.fillRect(center.x - this.view_rect.size.x / 2, center.y - this.view_rect.size.y / 2, this.view_rect.size.x, this.view_rect.size.y);
      this.ctx.restore();
    }*/
    

    this.ctx.translate(-center.x + this.view_rect.size.x / 2, -center.y + this.view_rect.size.y / 2);

    //Draw all entities
    for (let entity of entities)
    {
      entity.draw(this.ctx, this.view_rect);
    }
  }

}

module.exports = DOMViewport;