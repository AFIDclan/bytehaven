const Pose = require('../utils/Pose.js');
const Viewport = require('./Viewport.js');
const { Polygon, Vector2 } = require("collidify");

let poly_from_json = (json) => {

  let corner_tl = new Vector2(json.center.x - json.size.x/2, json.center.y - json.size.y/2);
  let corner_tr = new Vector2(json.center.x + json.size.x/2, json.center.y - json.size.y/2);
  let corner_br = new Vector2(json.center.x + json.size.x/2, json.center.y + json.size.y/2);
  let corner_bl = new Vector2(json.center.x - json.size.x/2, json.center.y + json.size.y/2);

  return new Polygon([corner_tl, corner_tr, corner_br, corner_bl]);
}


class RemoteViewport extends Viewport {
  constructor(sock, engine, view_rect) {
    super(engine, poly_from_json(view_rect));
    this.remote_sock = sock;

    this.seen_entities = [];

    this.remote_sock.on("viewport_update", (view_rect) => {
      this.view_rect = poly_from_json(view_rect);
      });
  }

  render()
  {
    //Cull entities that are outside the viewport
    let entities = this.engine.entities.filter((entity) => {
        return entity.in_viewport(this);
    });


    let new_entities = entities.filter((entity) => {
        return !this.seen_entities.includes(entity);
    });

    let removed_entities = this.seen_entities.filter((entity) => {
        return !entities.includes(entity);
    });

    this.seen_entities = [...entities]

    if (new_entities.length)
      this.remote_sock.emit("new_entities", new_entities.map((e)=>e.serialize()));

    let moved_entities = this.seen_entities.filter((entity) => {
        return entity.moved_last_frame;
    });

    let image_changed_entities = this.seen_entities.filter((entity) => {
        return entity.image_changed_last_frame;
    });

    if (moved_entities.length)
      this.remote_sock.emit("entities_moved", moved_entities.map((entity) => ({id: entity.id, pose: entity._pose})));

    if (image_changed_entities.length)
      this.remote_sock.emit("entities_image_changed", image_changed_entities.map((entity) => ({id: entity.id, image: entity.image})));

    if (removed_entities.length)
      this.remote_sock.emit("removed_entities", removed_entities.map((entity) => entity.id));
  }

}

module.exports = RemoteViewport;