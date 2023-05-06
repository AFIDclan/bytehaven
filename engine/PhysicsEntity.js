const Entity = require('./Entity.js');
const Pose = require('./Pose.js');

class PhysicsEntity extends Entity
{
    constructor(image_path)
    {
        super(image_path);

        this.velocity = new Pose(0, 0, 0);
    }

    update()
    {
        super.update();
        
        this.pose.x += this.velocity.x;
        this.pose.y += this.velocity.y;
        this.pose.angle += this.velocity.angle;
    }
}

module.exports = PhysicsEntity;