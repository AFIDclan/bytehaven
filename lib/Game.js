const { set } = require('yalls/lib/utils');
const { PhysicsEntity, Engine, Viewport } = require('../engine');
const { RemoteViewport } = require('../engine');
const Vec2 = require('../engine/utils/Vec2');
const Map = require('./Map.js');
const Player = require('./Player.js');
const EventEmitter = require('events')
const fs = require('fs');



class Game extends EventEmitter
{
    constructor(log)
    {
        super()
        this.log = log;
        this.engine = new Engine();
       
        
        this.updating = false;
        this.last_update = Date.now();
        this.last_update_rates = [];

        this.map = new Map(this.engine, 3000, 3000);
        this.map.load();

        

        setInterval(() => {
            if (this.updating)
                return;

            this.updating = true;

            
            this.engine.update();

            this.updating = false;
            this.last_update_rates.push(Date.now() - this.last_update);

            if (this.last_update_rates.length > 10)
                this.last_update_rates.shift();

            this.last_update = Date.now();

        }, 30);

        let player = new Player(this.engine);
        player.pose.x = 200;
        player.pose.y = 200;
        player.pose.angle = -1;

        this.engine.add_entity(player);
        
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