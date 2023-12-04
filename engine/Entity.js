const Pose = require('./utils/Pose.js');
const Rect = require('./utils/Rect.js');
const uuidv4 = require('uuid').v4;
const EventEmitter = require('events');



class Entity extends EventEmitter
{
    constructor(image, hitbox=new Rect(), name="Player")
    {
        super();
        this.active = true;
        this.id = uuidv4();
        this.pose = new Pose(0, 0, 0);
        this.last_pose = new Pose(0, 0, 0);
        this.name = name;
        this.hitbox = hitbox;
        this.moved_last_frame = false;
        
        this.image = image;
        this.last_image = this.image;

        this.map_location = null;

        
    }

    in_viewport(viewport)
    {
        return viewport.view_rect.intersects(this.hitbox);
    }

    update()
    {

        //TODO: Hitbox needs to rotate with the entity?
        this.hitbox.update_from_pose(this.pose);

        //Check if the entity moved last frame
        this.moved_last_frame = this.pose.x != this.last_pose.x || this.pose.y != this.last_pose.y || this.pose.angle != this.last_pose.angle;

        this.image_changed_last_frame = this.image != this.last_image;

        this.last_image = this.image;

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
            image: this.image,
            type: this.constructor.name
        }
    }

    // To be overridden. Called when this entity collides with another entity
    on_collision(other)
    {
    }
}

module.exports = Entity;