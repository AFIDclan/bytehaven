const fs = require("fs");
const Player = require("./Player.js");

class Match
{
    constructor(engine)
    {
        this.players_per_team = 25;
        this.teams = []
        this.available_team_colors = fs.readdirSync("webapp/public/images").filter((file) => file.startsWith("player_")).map((file) => file.split("_")[1]).map((file) => file.split(".")[0]);

        this.engine = engine;

        //Randomize the order of the available team colors
        for (let i=0; i<this.available_team_colors.length; i++)
        {
            let j = Math.floor(Math.random() * this.available_team_colors.length);
            let temp = this.available_team_colors[i];
            this.available_team_colors[i] = this.available_team_colors[j];
            this.available_team_colors[j] = temp;
        }

        this.engine.on("entity_removed", (entity) => {
            if (entity instanceof Player)
            {
                let team = this.teams.find((team) => team.team_name == entity.team_id);

                if (team)
                {
                    let player_index = team.players.indexOf(entity);

                    if (player_index != -1)
                        team.players.splice(player_index, 1);

                    team.deaths++;
      
                }
            }
        });
    }

    get_scoreboard()
    {
        return this.teams.map((team) => ({
            score: (team.kills / (team.deaths || 1)) * 100,
            team_name: team.team_name,
            deaths: team.deaths,
            kills: team.kills
        }))
        .sort((a, b) => b.score - a.score);
    }

    add_team(socket, team_name)
    {

        if (this.teams.find((team) => team.team_name == team_name))
            throw new Error("Team name already taken: " + team_name);

        let team_color = this.available_team_colors.pop();

        this.teams.push({socket, team_name, team_color, players: [], kills: 0, deaths: 0});
    }

    get_team_for_sock(sock)
    {
        return this.teams.find((team) => team.socket == sock);
    }

    spawn_teams(spawn_points)
    {
        if (this.teams.length == 0)
            return;

        if (spawn_points.length < this.teams.length)
            throw new Error("Not enough spawn points for all teams");


            for (let i=0; i<this.teams.length; i++)
            {
                let team = this.teams[i];
                let spawn_point = spawn_points[i];

                //Form a square formation around the spawn point
                let formation_size = Math.ceil(Math.sqrt(this.players_per_team));
                let formation_spacing = 100;
                let formation_offset = (formation_size-1) * formation_spacing / 2;
                let formation_angle = Math.atan2(spawn_point.y, spawn_point.x) - Math.PI / 2;

                for (let x=0; x<formation_size; x++)
                {
                    for (let y=0; y<formation_size; y++)
                    {
                        let player = new Player(this.engine, team.team_name, team.team_color);
                        player.pose.x = spawn_point.x + (x * formation_spacing) - formation_offset;
                        player.pose.y = spawn_point.y + (y * formation_spacing) - formation_offset;
                        player.pose.angle = formation_angle;

                        this.engine.add_entity(player);
                        team.players.push(player);

                        player.on("kill", ()=>team.kills++)
                    }
                }
            }
        
    }

    serialize()
    {
        return {
            teams: this.teams.map((team) => {
                return {
                    team_name: team.team_name,
                    team_color: team.team_color
                    // players: team.players.map((player) => {
                    //     return {
                    //         pose: player.pose,
                    //         health: player.health,
                    //         max_health: player.max_health,
                    //         team_id: player.team_id,
                    //         team_color: player.team_color,
                    //         id: player.id
                    //     }
                    // })
                }
            })
        }
    }
}

module.exports = Match;