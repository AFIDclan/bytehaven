
class I {
    constructor(json_image) {

        this.json_image = json_image;
        this.src = json_image.src
        this.sprites_x = json_image.sprites_x;
        this.sprites_y = json_image.sprites_y;
        this.framerate = json_image.framerate;

        this.icon = json_image.icon;
        this.icon_zoomlevel = json_image.icon_zoomlevel;

        this.has_resource = false;
        this.last_frame = 0;
    }

    load() {
        this.resource = new Image();
        this.resource.src = "images/" + this.src;
        
        if (this.sprites_x > 1 || this.sprites_y > 1)
        {
            console.log("Loading spritesheet: " + this.src);
            console.log("Framerate: " + this.framerate)
            this.sprite_size = {
                x: this.resource.width / this.sprites_x,
                y: this.resource.height / this.sprites_y,
            }

            this.is_sprite = true;
            this.sprites = [];
            this.sprite_index = 0;
            this.sprite_count = this.sprites_x * this.sprites_y;

            for (let y = 0; y < this.sprites_y; y++)
            {
                for (let x = 0; x < this.sprites_x; x++)
                {

                    this.sprites.push(
                    {
                        x1: x*this.sprite_size.x, 
                        y1: y*this.sprite_size.y, 
                        x2: (x+1)*this.sprite_size.x, 
                        y2: (y+1)*this.sprite_size.y
                    });
            }
            }
            console.log("Loaded " + this.sprites.length + " sprites")
        }
        

        if (this.resource)
            this.has_resource = true;
    }

    clone() {
        let clone = new I(this.json_image);
       
        clone.resource = this.resource;
        clone.has_resource = this.has_resource;
        clone.sprites = this.sprites;
        clone.sprite_index = this.sprite_index;
        clone.sprite_count = this.sprite_count;
        clone.sprite_size = this.sprite_size;
        clone.is_sprite = this.is_sprite;
        clone.last_frame = this.last_frame;

        return clone;
        
    }


    draw(ctx) {
        
        if (this.is_sprite)
        {
            let sprite = this.sprites[this.sprite_index];

            if (Date.now() - this.last_frame > 1000/this.framerate)
            {
                this.last_frame = Date.now();
                this.sprite_index++;

                if (this.sprite_index >= this.sprite_count)
                this.sprite_index = 0;
            }
            
            

            ctx.drawImage(this.resource, sprite.x1, sprite.y1, sprite.x2-sprite.x1, sprite.y2-sprite.y1, -this.sprite_size.x/2, -this.sprite_size.y/2, this.sprite_size.x, this.sprite_size.y); // Draw the image centered on the origin
        } else {
            ctx.drawImage(this.resource, -this.resource.width/2, -this.resource.height/2); // Draw the image centered on the origin
        }
    }
}
module.exports = I