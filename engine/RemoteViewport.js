const Pose = require('./Pose.js');

class RemoteViewport {
  constructor(engine, sock, {game_width, game_height, center, id}) {


    this.game_width = game_width;
    this.game_height = game_height;
    this.center = new Pose(center._x, center._y, center._angle);

    this.engine = engine;
    this.remote_sock = sock;

  }

  render()
  {
    let entities = this.engine.entities;
    
    //Cull entities that are outside the viewport
    entities = entities.filter((entity) => {
        return entity.in_viewport(this);
    });

    this.remote_sock.emit("entities", entities);
    }

}

module.exports = RemoteViewport;