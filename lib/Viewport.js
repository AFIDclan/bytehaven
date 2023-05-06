const Pose = require('./Pose.js');

class Viewport {
  constructor(engine, dom_id, dom_width, dom_height,  center=new Pose(), game_width=1000) {


    this.dom_width = dom_width;
    this.dom_height = dom_height;
    this.game_width = game_width;
    this.center = center;
    this.engine = engine;

    this.aspect_ratio = dom_width / dom_height;

    this.game_height = this.game_width / this.aspect_ratio;

    this.canvas = document.getElementById(dom_id);
    this.ctx = this.canvas.getContext("2d");

    this.canvas.width = dom_width;
    this.canvas.height = dom_height;

  }

  render()
  {
    let entities = this.engine.entities;
    
    //TODO: Cull entities that are outside the viewport

    //Set canvas to be game_width x game_height, centered on the center pose
    this.ctx.setTransform(this.dom_width / this.game_width, 0, 0, this.dom_height / this.game_height, 0, 0);
    this.ctx.translate(-this.center.x + this.game_width / 2, -this.center.y + this.game_height / 2);

    //Clear the canvas
    this.ctx.clearRect(this.center.x - this.game_width / 2, this.center.y - this.game_height / 2, this.game_width, this.game_height);

    //Draw all entities
    for (let entity of entities)
    {
      entity.draw(this.ctx);
    }
  }

}

module.exports = Viewport;