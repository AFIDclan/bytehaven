const { PhysicsEntity, Engine, Viewport } = require('./engine');
const { RemoteViewport } = require('./engine');
const Player = require('./lib/Player.js');
const EventEmitter = require('events')
const fs = require('fs');

class Game extends EventEmitter
{
    constructor(log)
    {
        super()
        this.log = log;
        this.engine = new Engine();
        this.available_team_colors = fs.readdirSync("webapp/public/images").filter((file) => file.startsWith("player_")).map((file) => file.split("_")[1]).map((file) => file.split(".")[0]);
    
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
            for (let i=0; i<100; i++)
            {
                let player = new Player(this.engine, team.id, team.color);
                player.pose.x = 500-(Math.random() * 1000);
                player.pose.y = 500-(Math.random() * 1000);
                player.pose.angle = Math.random() * 2 * Math.PI;

                setInterval(()=>{
                    player.fire()
                }, i*10)
                this.engine.add_entity(player);
                team.players.push(player);
            }
        }


        
        this.updating = false;
        this.last_update = Date.now();
        this.last_update_rates = [];

        setInterval(() => {
            if (this.updating)
                return;

            this.updating = true;

            
            for (let team of teams)
            {
                for (let player of team.players)
                {

                    //player.pose.step_forward(3)
                    player.pose.turn(0.01)
                }
            }
            


            this.engine.update();

            this.updating = false;
            this.last_update_rates.push(Date.now() - this.last_update);

            if (this.last_update_rates.length > 10)
                this.last_update_rates.shift();

            this.last_update = Date.now();

        }, 15);
        
    }

    get update_rate()
    {
        return this.last_update_rates.reduce((a, b) => a + b, 0) / this.last_update_rates.length;
    }
    
    add_remote_viewport(sock, view_rect)
    {
        let remote_viewport = new RemoteViewport(sock, this.engine, view_rect);
        this.engine.add_viewport(remote_viewport);
    }
}


module.exports = Game;