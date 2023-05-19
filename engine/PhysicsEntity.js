const Entity = require('./Entity.js');
const Pose = require('./utils/Pose.js');
const Rect = require('./utils/Rect.js');

class PhysicsEntity extends Entity
{
    constructor(image_path, hitbox, name="PhysicsEntity")
    {
        super(image_path, hitbox, name);

        this.velocity = new Pose(0, 0, 0);
    }

    update()
    {
        this.pose.x += this.velocity.x;
        this.pose.y += this.velocity.y;
        this.pose.angle += this.velocity.angle;
        

        super.update();
    }
}

module.exports = PhysicsEntity;