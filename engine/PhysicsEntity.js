const Entity = require('./Entity.js');
const Pose = require('./Pose.js');
const Rect = require('./Rect.js');

class PhysicsEntity extends Entity
{
    constructor(image_path, name="PhysicsEntity", serverside=true)
    {
        super(image_path, new Rect(0, 0, 20, 20), name, serverside);

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