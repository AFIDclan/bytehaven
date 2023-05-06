const Entity = require('./lib/Entity');
const PhysicsEntity = require('./lib/PhysicsEntity.js');
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

    engine.update();
    viewport.render();

    document.getElementById("entities-total-text").innerHTML = "Entities Total:" + engine.entities.length;
    document.getElementById("entities-viewport-text").innerHTML = "Entities in Viewport:" + engine.entities.filter((entity) => entity.in_viewport(viewport)).length;
}, 1000/60);

setInterval(()=>{
    let bullet = new PhysicsEntity("bullet.png");
    bullet.pose.x = player.pose.x;
    bullet.pose.y = player.pose.y;
    bullet.pose.angle = player.pose.angle;

    //Calculate velocity
    bullet.velocity.x = 10 * Math.sin(bullet.pose.angle);
    bullet.velocity.y = 10 * -Math.cos(bullet.pose.angle);

    engine.add_entity(bullet);

    bullet.pose.on('move', (pose) => {
        if (!bullet.in_viewport(viewport)) 
            engine.remove_entity(bullet)
    });

}, 1000)