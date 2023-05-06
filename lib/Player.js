const { slitan_bundle_resource } = require('slitan');
const { Entity } = require('../engine');

class Player extends Entity
{
    constructor(team_id, color)
    {

        let player_default_svg = slitan_bundle_resource("player.svg");

        // Find rgb(213, 47, 47) in the svg and replace it with the team color
        let player_svg = player_default_svg.replace("rgb(213, 47, 47)", color);

        const blob = new Blob([player_svg], { type: 'image/svg+xml' });

        super(URL.createObjectURL(blob));

        this.team_id = team_id;
        this.color = color;

        // Create a new URL for the Blob object and set it as the image source
        this.image.src = URL.createObjectURL(blob);

    }

}

module.exports = Player;