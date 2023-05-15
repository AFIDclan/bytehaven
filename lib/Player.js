
const { Entity, Pose } = require('../engine');
const Rect = require('../engine/utils/Rect.js');
const Bullet = require('./Bullet.js');
const fs = require('fs');



class Player extends Entity
{
    constructor(engine, team_id, color)
    {
        super(`player_${color}.png`, Rect.from_coordinates(0, 0, 50, 50), team_id +"-Player1");

        this.team_id = team_id;
        this.color = color;
        
        this.engine = engine;

        this.fire_rate = 1300;
        this.last_fired = Date.now()-Math.random()*this.fire_rate;
        this.health = 100;
        this.max_health = 100;

        this.gun_pose = new Pose(0, -20, 0);

    }

    fire()
    {
        if (Date.now() - this.last_fired > this.fire_rate)
        {
            this.last_fired = Date.now();

            let bullet = new Bullet(this.gun_pose.after(this.pose), this, "Bullet");

            this.engine.add_entity(bullet);
        }
    }

    die()
    {
        this.engine.remove_entity(this);
    }

    take_damage(damage)
    {
        this.health -= damage;
        if (this.health <= 0)
        {
            //this.die();
        }
    }

}

module.exports = Player;