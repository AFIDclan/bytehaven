
const { Entity } = require('../engine');
const Rect = require('../engine/Rect.js');

class Player extends Entity
{
    constructor(team_id, color, serverside=true)
    {

        if(!serverside)
        {
            let player_default_svg = slitan_bundle_resource("player.svg");

            // Find rgb(213, 47, 47) in the svg and replace it with the team color
            let player_svg = player_default_svg.replace("rgb(213, 47, 47)", color);
    
            const blob = new Blob([player_svg], { type: 'image/svg+xml' });
    
            super(URL.createObjectURL(blob));
    

    
            // Create a new URL for the Blob object and set it as the image source
            this.image.src = URL.createObjectURL(blob);
        } else {
            super("player.png", new Rect(0, 0, 45,64), "Player", serverside);
        }

        this.team_id = team_id;
        this.color = color;
        

    }

}

module.exports = Player;