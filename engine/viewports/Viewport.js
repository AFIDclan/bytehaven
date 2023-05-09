const Rect = require('../utils/Rect.js');

class Viewport {
  constructor(engine, view_rect=new Rect()) {

    this.view_rect = view_rect;
    this.engine = engine;

  }

  // Override this method
  render()
  { }

}

module.exports = Viewport;