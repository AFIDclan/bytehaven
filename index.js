const { PhysicsEntity, Engine, Viewport } = require('./engine/index.js');
const Player = require('./lib/Player.js');

let engine = new Engine();


let player = new Player("jvs", "green");
player.pose.angle = 2

let player2 = new Player("ss", "blue");
player2.pose.angle = -2
player2.pose.x = 10

let player3 = new Player("tn", "orange");
player3.pose.angle= 3
player.pose.x = 30

engine.add_entity(player);
engine.add_entity(player2);
engine.add_entity(player3);

let viewport = new Viewport(engine, "game-viewport", 800, 600);
engine.add_viewport(viewport);

setInterval(() => {
    player.pose.step_forward(1)
    player.pose.turn(0.01)
    player2.pose.step_forward(1)
    player2.pose.turn(0.01)
    player3.pose.step_forward(1)
    player3.pose.turn(0.01)

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
    
}, 1000);

setInterval(()=>{
    let bullet = new PhysicsEntity("bullet2.png");
    let bullet2 = new PhysicsEntity("bullet2.png");
    let bullet3 = new PhysicsEntity("bullet2.png");
   
    let bullets = [bullet, bullet2, bullet3];
    let offsets = [0, -Math.PI/6, Math.PI/6];

    for (let i=0; i < 3; i++) {
        bullets[i].pose.x = player3.pose.x;
        bullets[i].pose.y = player3.pose.y;
        bullets[i].pose.angle = player3.pose.angle + offsets[i];

        //Calculate velocity
        bullets[i].velocity.x = 10 * Math.sin(bullets[i].pose.angle);
        bullets[i].velocity.y = 10 * -Math.cos(bullets[i].pose.angle);

        engine.add_entity(bullets[i]);

        bullets[i].pose.on('move', (pose) => {
            if (!bullets[i].in_viewport(viewport))
                engine.remove_entity(bullets[i])    
        });
    }

}, 1000);
