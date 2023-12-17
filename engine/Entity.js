const Pose = require('./utils/Pose.js');
const { Polygon, Vector2 } = require("collidify");
const uuidv4 = require('uuid').v4;
const EventEmitter = require('events');



class Entity extends EventEmitter
{
    constructor(image, hitbox=(new Polygon()), name="Entity")
    {
        super();
        this.active = true;
        this.id = uuidv4();
        this._pose = new Pose(0, 0, 0);
        this._last_pose = new Pose(0, 0, 0);
        this.name = name;
        this.hitbox = hitbox;
        this.moved_last_frame = false;
        
        this.image = image;
        this.last_image = this.image;

        this.map_location = null;

        
    }

    in_viewport(viewport)
    {
        let col = viewport.view_rect.CollidesWith(this.hitbox);
        return col.collides;
    }

    set_position(x, y)
    {
        this._pose.x = x;
        this._pose.y = y;

        this.hitbox.MoveTo(new Vector2(x, y));
    }

    step_forward(distance)
    {
        let dx = Math.sin(this._pose.angle) * distance;
        let dy = -Math.cos(this._pose.angle) * distance;

        this.move_by(dx, dy);
    }

    move_by(dx, dy)
    {
        this._pose.x += dx;
        this._pose.y += dy;

        let hitbox_delta = new Vector2(dx, dy);

        this.hitbox.MoveBy(hitbox_delta);
    }

    rotate(angle)
    {
        this._pose.angle += angle;
        this.hitbox.RotateBy(angle);
    }

    update()
    {


        //Check if the entity moved last frame
        this.moved_last_frame = this._pose.x != this._last_pose.x || this._pose.y != this._last_pose.y || this._pose.angle != this._last_pose.angle;

        this.image_changed_last_frame = this.image != this.last_image;

        this.last_image = this.image;

        //Update last pose
        this._last_pose.from_other(this._pose);
    }

    serialize()
    {
        return {
            id: this.id,
            pose: this._pose,
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