const { PhysicsEntity, Engine, Viewport } = require('./engine');
const { RemoteViewport } = require('./engine');
const Player = require('./lib/Player.js');
const EventEmitter = require('events')
const fs = require('fs');

const bullet_svg = fs.readFileSync("./lib/bullet.svg", 'utf8');
class Game extends EventEmitter
{
    constructor()
    {
        super()
        this.engine = new Engine();


        let player = new Player(this.engine, "jvs", "green");
        player.pose.angle = 2
        
        let player2 = new Player(this.engine, "ss", "blue");
        player2.pose.angle = -2
        player2.pose.x = 10
        
        this.engine.add_entity(player);
        this.engine.add_entity(player2);
        
        
        setInterval(() => {
            player.pose.step_forward(3)
            player.pose.turn(0.03)
            player2.pose.step_forward(1)
            player2.pose.turn(0.01)
            
            //Check for collisions
            for (let entity of this.engine.entities)
            {
                for (let other_entity of this.engine.entities)
                {
                    if (entity.id != other_entity.id)
                    {
                        if (entity.hitbox.intersects(other_entity.hitbox))
                        {
                            entity.on_collision(other_entity);
                        }
                    }
                } 
            }

            this.engine.update();
        }, 1000/60);
        
        setInterval(()=>{
            player.fire()
        }, 40)
    }
    
    add_remote_viewport(sock, view_rect)
    {
        let remote_viewport = new RemoteViewport(sock, this.engine, view_rect);
        this.engine.add_viewport(remote_viewport);
    }
}


module.exports = Game;