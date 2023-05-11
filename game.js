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

        let teams = [
            {
                id: "jvs",
                color: "green",
                players: []
            },
            {
                id: "ss",
                color: "blue",
                players: []
            }
        ]

        for (let team of teams)
        {
            for (let i=0; i<20; i++)
            {
                let player = new Player(this.engine, team.id, team.color);
                player.pose.x = 500-(Math.random() * 1000);
                player.pose.y = 500-(Math.random() * 1000);
                player.pose.angle = Math.random() * 2 * Math.PI;
                this.engine.add_entity(player);
                team.players.push(player);
            }
        }


        
        
        setInterval(() => {
            for (let team of teams)
            {
                for (let player of team.players)
                {

                    //player.pose.step_forward(3)
                    player.pose.turn(0.01)
                }
            }
            
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
            for (let team of teams)
            {
                for (let player of team.players)
                {
                    player.fire()
                }
            }
        }, 40)
    }
    
    add_remote_viewport(sock, view_rect)
    {
        let remote_viewport = new RemoteViewport(sock, this.engine, view_rect);
        this.engine.add_viewport(remote_viewport);
    }
}


module.exports = Game;