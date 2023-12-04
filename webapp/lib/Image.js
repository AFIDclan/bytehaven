
class Image {
    constructor(json_image) {
        this.src = json_image.src
        this.sprites_x = json_image.sprites_x;
        this.sprites_y = json_image.sprites_y;

        this.icon = json_image.icon;
        this.icon_zoomlevel = json_image.icon_zoomlevel;

        this.has_resource = false;
    }

    load(images) {
        this.resource = images.find((i) => i.path == this.src).img;

        if (this.sprites_x > 1 || this.sprites_y > 1)
        {
            console.log("Loading spritesheet: " + this.src);
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
                    let sprite_canvas = document.createElement("canvas");
                    sprite_canvas.width = this.sprite_size.x;
                    sprite_canvas.height = this.sprite_size.y;

                    let ctx = sprite_canvas.getContext("2d");

                    ctx.drawImage(this.resource, -x * this.sprite_size.x, -y * this.sprite_size.y);


                    //TODO: Rendering canvas to canvas is slow and breaks things
                    this.sprites.push(sprite_canvas);
                }
            }
            console.log("Loaded " + this.sprites.length + " sprites")
        }
        

        if (this.resource)
            this.has_resource = true;
    }


    get_drawable() {
        if (!this.has_resource)
            return null;

        if (this.is_sprite)
        {
            let sprite = this.sprites[this.sprite_index];
            this.sprite_index++;
            if (this.sprite_index >= this.sprite_count)
                this.sprite_index = 0;

            return sprite;
        }

        return this.resource;
    }
}
module.exports = Image