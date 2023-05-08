const { PhysicsEntity, Engine, Viewport } = require('./engine');
const RemoteViewport = require('./engine/RemoteViewport');
const Player = require('./lib/Player.js');
const EventEmitter = require('events')

class Game extends EventEmitter
{
    constructor()
    {
        super()
        this.engine = new Engine();


        let player = new Player("jvs", "green");
        player.pose.angle = 2
        
        let player2 = new Player("ss", "blue");
        player2.pose.angle = -2
        player2.pose.x = 10
        
        this.engine.add_entity(player);
        this.engine.add_entity(player2);
        
        
        setInterval(() => {
            player.pose.step_forward(1)
            player.pose.turn(0.01)
            player2.pose.step_forward(1)
            player2.pose.turn(0.01)
        
            this.engine.update();
        }, 1000/60);
        
        setInterval(()=>{
            let bullet = new PhysicsEntity("bullet.png");
            bullet.pose.x = player.pose.x;
            bullet.pose.y = player.pose.y;
            bullet.pose.angle = player.pose.angle;
        
            //Calculate velocity
            bullet.velocity.x = 10 * Math.sin(bullet.pose.angle);
            bullet.velocity.y = 10 * -Math.cos(bullet.pose.angle);
        
            this.engine.add_entity(bullet);
        
            bullet.pose.on('move', (pose) => {
                let in_viewport = this.engine.viewports.filter((viewport) => bullet.in_viewport(viewport));
                if (!in_viewport) 
                    this.engine.remove_entity(bullet)
            });
        
        }, 1000)
    }
    
    add_remote_viewport(sock, viewport)
    {
        let remote_viewport = new RemoteViewport(this.engine, sock, viewport);
        this.engine.add_viewport(remote_viewport);


        //SUPER TEMP
        setInterval(()=>{
            remote_viewport.render()
        },100)
    }
}


module.exports = Game;