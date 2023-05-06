const Pose = require('./Pose.js');

class Entity
{
    constructor(image_path)
    {
        this.pose = new Pose(0, 0, 0);
        this.name = 'Player';
        this.image = new Image();
        this.image.src = image_path;
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