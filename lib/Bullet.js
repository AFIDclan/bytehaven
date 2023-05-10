const { PhysicsEntity } = require("../engine");
const fs = require('fs');

const bullet_svg = fs.readFileSync("./lib/bullet.svg", 'utf8');

class Bullet extends PhysicsEntity
{
    constructor(starting_pose, owner)
    {
        super(bullet_svg);

        this.pose.x = starting_pose.x;
        this.pose.y = starting_pose.y;
        this.pose.angle = starting_pose.angle;

        this.owner = owner;
        this.engine = owner.engine;

        this.muzzle_velocity = 50;
        this.time_to_live = 5000;
        this.damage = 10;

        //Calculate velocity
        this.velocity.x = this.muzzle_velocity * Math.sin(this.pose.angle);
        this.velocity.y = this.muzzle_velocity * -Math.cos(this.pose.angle);

        setTimeout(() => {
            this.die();
        }, this.time_to_live);
    }

    die()
    {
        this.engine.remove_entity(this);
    }
}

module.exports = Bullet;