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