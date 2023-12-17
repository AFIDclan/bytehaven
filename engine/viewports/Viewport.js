const { Polygon, Vector2 } = require("collidify");

class Viewport {
  constructor(engine, view_rect=new Polygon()) {

    this.view_rect = view_rect;
    this.engine = engine;

  }

  // Override this method
  render()
  { }

}

module.exports = Viewport;