const Pose = require('../utils/Pose.js');
const Rect = require('../utils/Rect.js');
const Viewport = require('./Viewport.js');

class RemoteViewport extends Viewport {
  constructor(sock, engine, view_rect) {
    super(engine, Rect.from_json(view_rect));
    this.remote_sock = sock;

    this.seen_entities = [];

  }

  render()
  {
    //Cull entities that are outside the viewport
    // let entities = this.engine.entities.filter((entity) => {
    //     return entity.in_viewport(this);
    // });

    let entities = this.engine.entities;

    entities.forEach((entity) => {
      if (!entity.velocity)
        return;

      if (entity.hitbox.x < this.view_rect.x)
        entity.velocity.x = Math.abs(entity.velocity.x);

      if (entity.hitbox.x + entity.hitbox.width > this.view_rect.x + this.view_rect.width)
        entity.velocity.x = -Math.abs(entity.velocity.x);

      if (entity.hitbox.y < this.view_rect.y)
        entity.velocity.y = Math.abs(entity.velocity.y);

      if (entity.hitbox.y + entity.hitbox.height > this.view_rect.y + this.view_rect.height)
        entity.velocity.y = -Math.abs(entity.velocity.y);

    });

    let new_entities = entities.filter((entity) => {
        return !this.seen_entities.includes(entity);
    });

    let removed_entities = this.seen_entities.filter((entity) => {
        return !entities.includes(entity);
    });

    this.seen_entities = [...entities]

    if (new_entities.length)
      this.remote_sock.emit("new_entities", new_entities);

    let moved_entities = this.seen_entities.filter((entity) => {
        return entity.moved_last_frame;
    });

    if (moved_entities.length)
      this.remote_sock.emit("moved_entities", moved_entities.map((entity) => ({id: entity.id, pose: entity.pose})));

    // if (removed_entities.length)
    //   this.remote_sock.emit("removed_entities", removed_entities.map((entity) => entity.id));
  }

}

module.exports = RemoteViewport;