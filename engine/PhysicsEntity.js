const Entity = require('./Entity.js');
const Pose = require('./utils/Pose.js');

class PhysicsEntity extends Entity
{
    constructor(image, hitbox, name="PhysicsEntity", is_static=false)
    {
        super(image, hitbox, name);

        this.velocity = new Pose(0, 0, 0);
        this.is_static = is_static;

        this.is_physics_entity = true;
    }

    update()
    {
        this.move_by(this.velocity.x, this.velocity.y)
        this.rotate(this.velocity.angle);
        

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