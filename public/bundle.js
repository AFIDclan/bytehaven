(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Entity = require('./lib/Entity');
const Engine = require('./lib/NovaEngine.js');
const Viewport = require('./lib/Viewport.js');
const Pose = require('./lib/Pose.js');

let engine = new Engine();


let player = new Entity("player.png");
player.pose.angle = 2

let player2 = new Entity("player.png");
player2.pose.angle = -2
player2.pose.x = 10

engine.add_entity(player);
engine.add_entity(player2);

let viewport = new Viewport(engine, "game-viewport", 800, 600);
engine.add_viewport(viewport);

setInterval(() => {
    player.pose.step_forward(1)
    player.pose.turn(0.01)
    player2.pose.step_forward(1)
    player2.pose.turn(0.01)
    viewport.render();
}, 1000/60);
},{"./lib/Entity":2,"./lib/NovaEngine.js":3,"./lib/Pose.js":4,"./lib/Viewport.js":5}],2:[function(require,module,exports){
const Pose = require('./Pose.js');

class Entity
{
    constructor(image_path)
    {
        this.pose = new Pose(0, 0, 0);
        this.name = 'Player';
        this.image = new Image();
        this.image.src = image_path;
    }

    draw(ctx)
    {
        ctx.save(); // Save the current canvas state
        ctx.translate(this.pose.x, this.pose.y); // Move the origin to the player's position
        ctx.rotate(this.pose.angle); // Rotate the canvas by the player's angle
        ctx.drawImage(this.image, -this.image.width/2, -this.image.height/2); // Draw the image centered on the origin
        ctx.restore(); // Restore the saved canvas state
    }
}

module.exports = Entity;
},{"./Pose.js":4}],3:[function(require,module,exports){

class NovaEngine
{
    constructor()
    {
        this.entities = [];
        this.viewports = [];
    }

    add_entity(entity)
    {
        this.entities.push(entity);
    }

    add_viewport(viewport)
    {
        this.viewports.push(viewport);
    }
}

module.exports = NovaEngine;
},{}],4:[function(require,module,exports){

class Pose {

    constructor(x=0, y=0, angle=0)
    {
        this.x = x;
        this.y = y;
        this.angle = angle;
    }

    step_forward(distance)
    {
        this.x += distance * Math.sin(this.angle);
        this.y += distance * -Math.cos(this.angle);
    }

    turn(angle)
    {
        this.angle += angle;
    }
}

module.exports = Pose;
},{}],5:[function(require,module,exports){
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
},{"./Pose.js":4}]},{},[1]);
