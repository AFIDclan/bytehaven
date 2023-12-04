const Entity = require('./Entity.js');
const Pose = require('./utils/Pose.js');
const Rect = require('./utils/Rect.js');

class PhysicsEntity extends Entity
{
    constructor(image, hitbox, name="PhysicsEntity")
    {
        super(image, hitbox, name);

        this.velocity = new Pose(0, 0, 0);
    }

    update()
    {
        this.pose.x += this.velocity.x;
        this.pose.y += this.velocity.y;
        this.pose.angle += this.velocity.angle;
        

        super.update();
    }

    serialize()
    {
        return {
            ...super.serialize(),
            velocity: this.velocity
        }
    }
}

module.exports = PhysicsEntity;