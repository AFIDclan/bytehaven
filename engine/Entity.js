const Pose = require('./utils/Pose.js');
const Rect = require('./utils/Rect.js');
const uuidv4 = require('uuid').v4;

class Entity
{
    constructor(svg_data, hitbox=new Rect(), name="Player")
    {
        this.id = uuidv4();
        this.pose = new Pose(0, 0, 0);
        this.last_pose = new Pose(0, 0, 0);
        this.name = name;
        this.hitbox = hitbox;
        this.moved_last_frame = false;
        this.svg_data = svg_data;

        
    }

    in_viewport(viewport)
    {
        return viewport.view_rect.intersects(this.hitbox);
    }

    update()
    {

        //TODO: Hitbox needs to rotate with the entity?
        this.hitbox.x = this.pose.x;
        this.hitbox.y = this.pose.y;
        this.hitbox.angle = this.pose.angle;

        //Check if the entity moved last frame
        this.moved_last_frame = this.pose.x != this.last_pose.x || this.pose.y != this.last_pose.y || this.pose.angle != this.last_pose.angle;

        //Update last pose
        this.last_pose.from_other(this.pose);
    }

    serialize()
    {
        return {
            id: this.id,
            pose: this.pose,
            name: this.name,
            hitbox: this.hitbox,
            svg_data: this.svg_data
        }
    }

    collides_with(other)
    {
        return this.hitbox.intersects(other.hitbox);
    }

    on_collision(other)
    {
        //console.log("Collision between " + this.name + " and " + other.name)
    }
}

module.exports = Entity;