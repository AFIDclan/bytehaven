
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

        if (this.resource)
            this.has_resource = true;
    }
}

module.exports = Image