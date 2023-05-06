const Pose = require('./Pose.js');
const uuidv4 = require('uuid').v4;

class Entity
{
    constructor(image_path)
    {
        this.id = uuidv4();
        this.pose = new Pose(0, 0, 0);
        this.name = 'Player';
        this.image = new Image();
        this.image.src = image_path;
    }

    in_viewport(viewport)
    {
        let x = this.pose.x;
        let y = this.pose.y;
        let width = this.image.width;
        let height = this.image.height;

        let left = x - width/2;
        let right = x + width/2;
        let top = y - height/2;
        let bottom = y + height/2;

        let viewport_left = viewport.center.x - viewport.game_width/2;
        let viewport_right = viewport.center.x + viewport.game_width/2;
        let viewport_top = viewport.center.y - viewport.game_height/2;
        let viewport_bottom = viewport.center.y + viewport.game_height/2;

        return (left < viewport_right && right > viewport_left && top < viewport_bottom && bottom > viewport_top);
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
        // Do nothing
    }
}

module.exports = Entity;