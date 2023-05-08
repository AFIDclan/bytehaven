const Pose = require('../../engine/utils/Pose.js');
const Rect = require('../../engine/utils/Rect.js');
const uuidv4 = require('uuid').v4;

class Entity
{
    constructor()
    {
        this.id = uuidv4();
        this.pose = new Pose();
        this.name = "UNSET";
        this.hitbox = new Rect();
        this.svg_data = "<svg></svg>";
    }

    reload_image()
    {
        const blob = new Blob([this.svg_data], { type: 'image/svg+xml' });
        this.image = new Image();
        this.image.src = URL.createObjectURL(blob);
    }

    draw(ctx)
    {


        ctx.save(); // Save the current canvas state
        ctx.translate(this.pose.x, this.pose.y); // Move the origin to the player's position
        ctx.rotate(this.pose.angle); // Rotate the canvas by the player's angle
        ctx.drawImage(this.image, -this.image.width/2, -this.image.height/2); // Draw the image centered on the origin
        ctx.restore(); // Restore the saved canvas state
    }
}

module.exports = Entity;