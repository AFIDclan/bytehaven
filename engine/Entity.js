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

    draw(ctx)
    {


        ctx.save(); // Save the current canvas state
        ctx.translate(this.pose.x, this.pose.y); // Move the origin to the player's position
        ctx.rotate(this.pose.angle); // Rotate the canvas by the player's angle
        ctx.drawImage(this.image, -this.image.width/2, -this.image.height/2); // Draw the image centered on the origin
        ctx.restore(); // Restore the saved canvas state
    }

    update()
    {

        //TODO: Hitbox needs to rotate with the entity?
        this.hitbox.x = this.pose.x;
        this.hitbox.y = this.pose.y;

        //Check if the entity moved last frame
        this.moved_last_frame = this.pose.x != this.last_pose.x || this.pose.y != this.last_pose.y || this.pose.angle != this.last_pose.angle;

        //Update last pose
        this.last_pose.from_other(this.pose);
    }
}

module.exports = Entity;