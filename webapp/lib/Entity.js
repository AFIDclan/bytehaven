const Pose = require('../../engine/utils/Pose.js');
const Rect = require('../../engine/utils/Rect.js');
const uuidv4 = require('uuid').v4;

const debug = false;

class Entity
{
    constructor()
    {
        this.id = uuidv4();
        this.pose = new Pose();
        this.name = "UNSET";
        this.hitbox = new Rect();

    }



    draw(ctx)
    {
        if (!this.image) return;

        ctx.save(); // Save the current canvas state
        ctx.translate(this.pose.x, this.pose.y); // Move the origin to the player's position
        ctx.rotate(this.pose.angle); // Rotate the canvas by the player's angle
        ctx.drawImage(this.image, -this.image.width/2, -this.image.height/2); // Draw the image centered on the origin

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