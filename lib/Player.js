
const { Entity } = require('../engine');
const Rect = require('../engine/utils/Rect.js');
const fs = require('fs');

class Player extends Entity
{
    constructor(team_id, color)
    {

        let player_default_svg = fs.readFileSync("./lib/player.svg", 'utf8');

        // Find rgb(213, 47, 47) in the svg and replace it with the team color
        let player_svg = player_default_svg.replace("rgb(213, 47, 47)", color);

        super(player_svg, new Rect(0, 0, 45,64), "Player");

        this.team_id = team_id;
        this.color = color;
        

    }

}

module.exports = Player;