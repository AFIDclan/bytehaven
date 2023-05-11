
const { Entity, Pose } = require('../engine');
const Rect = require('../engine/utils/Rect.js');
const Bullet = require('./Bullet.js');
const fs = require('fs');



class Player extends Entity
{
    constructor(engine, team_id, color)
    {

        let player_default_svg = fs.readFileSync("./lib/player.svg", 'utf8');

        // Find rgb(213, 47, 47) in the svg and replace it with the team color
        let player_svg = player_default_svg.replace("rgb(213, 47, 47)", color);

        super(player_svg, Rect.from_coordinates(0, 0, 50, 50), team_id +"-Player1");

        this.team_id = team_id;
        this.color = color;
        
        this.engine = engine;

        this.fire_rate = 500;
        this.last_fired = 0;
        this.health = 100;
        this.max_health = 100;

        this.left_gun_pose = new Pose(-20, -20, 0);
        this.right_gun_pose = new Pose(20, -20, 0);

    }

    fire()
    {
        if (Date.now() - this.last_fired > this.fire_rate)
        {
            this.last_fired = Date.now();

            let bullet_left = new Bullet(this.left_gun_pose.after(this.pose), this, "Bullet left");
            let bullet_right = new Bullet(this.right_gun_pose.after(this.pose), this, "Bullet right");

            this.engine.add_entity(bullet_left);
            this.engine.add_entity(bullet_right);
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
            this.die();
        }
    }

}

module.exports = Player;