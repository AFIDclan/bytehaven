
class Image {
    constructor(src, opts={}) {
        this.src = src

        this.sprites_x = opts.sprites_x || 1
        this.sprites_y = opts.sprites_y || 1
        this.framerate = opts.framerate || 15;

        this.icon = opts.icon || false
        this.icon_zoomlevel = opts.icon_zoomlevel || 1
    }

}

module.exports = Image