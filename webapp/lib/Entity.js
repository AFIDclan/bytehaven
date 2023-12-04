const Pose = require('../../engine/utils/Pose.js');
const Rect = require('../../engine/utils/Rect.js');
const Image = require('./Image.js');
const uuidv4 = require('uuid').v4;

const debug = false;

class Entity
{
    constructor(json_entity, game_view)
    {
        this.game_view = game_view;

        this.id = json_entity.id || uuidv4();
        this.type = json_entity.type;
        this.name = "UNSET";
        this.pose = Pose.from_other(json_entity.pose)
        this.hitbox = json_entity.hitbox || new Rect();

        this.update_image(json_entity.image);
 
    }


    update_image(json_image)
    {
        this.image = new Image(json_image);
        this.image.load(this.game_view.images);
    }


    draw(ctx, view_rect)
    {
        if (!this.image || !this.image.has_resource) return;

        ctx.save(); // Save the current canvas state
        ctx.translate(this.pose.x, this.pose.y); // Move the origin to the player's position
        ctx.rotate(this.pose.angle); // Rotate the canvas by the player's angle
        ctx.drawImage(this.image.resource, -this.image.resource.width/2, -this.image.resource.height/2); // Draw the image centered on the origin

        if (debug)
        {
            //Draw hitbox
            ctx.strokeStyle = "red";
            ctx.strokeRect(-this.hitbox.size.x/2, -this.hitbox.size.y/2, this.hitbox.size.x, this.hitbox.size.y);

            if (this.type == "Player")
            {   
                //Draw view circle (500px radius)
                ctx.strokeStyle = "blue";
                ctx.beginPath();
                ctx.arc(0, 0, 900, 0, 2 * Math.PI);
                ctx.stroke();

            }
        }
        
        
        ctx.restore(); // Restore the saved canvas state
    }
}

module.exports = Entity;