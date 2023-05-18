const { set } = require('yalls/lib/utils');
const { PhysicsEntity, Engine, Viewport } = require('../engine');
const { RemoteViewport } = require('../engine');
const Vec2 = require('../engine/utils/Vec2');
const Player = require('./Player.js');
const Match = require('./Match.js');
const EventEmitter = require('events')
const Timer = require('./Timer.js');
const fs = require('fs');



class Game extends EventEmitter
{
    constructor(log)
    {
        super()
        this.log = log;
        this.engine = new Engine();
       
        
        this.updating = false;
        this.last_update = Date.now();
        this.last_update_rates = [];
        this.match_history = [];

        this.match_start_interval = new Timer(async () => {
            let match = await this.open_registration()
            this.registering_match = null;

            this.engine.remove_all_entities();

            let spawn_points = [];

            let _spawn_seg_len = 1000;
            let _spawn_seg_delta = Math.PI * 2 / match.teams.length;

            let _spawn_radius = _spawn_seg_len * match.teams.length / (2 * Math.PI);

            for (let i = 0; i < match.teams.length; i++)
            {
                let angle = _spawn_seg_delta * i;
                let x = Math.cos(angle) * _spawn_radius;
                let y = Math.sin(angle) * _spawn_radius;

                spawn_points.push(new Vec2(x, y));
            }

            match.spawn_teams(spawn_points);

            if (this.match && this.match.teams.length > 1)
            {
                // Sort teams by players left
                let player_board = this.match.teams.sort((a, b) => b.players.length - a.players.length);


                let most_players = player_board[0];
                let runner_up = player_board[1];

                let player_diff = most_players.players.length - runner_up.players.length;

                this.match_history.push({
                    winner: most_players.team_name,
                    score: player_diff
                });

            }


            this.match = match;

            this.emit("match_started", match);

        }, 1000*10);



        setInterval(() => {
            if (this.updating)
                return;

            this.updating = true;

            
            this.engine.update();

            if (this.match)
            {
                this.match.teams.forEach((team) => {
                    team.socket.emit("update", {players: team.players.map((player) => player.serialize())});
                });
            }
            

            this.updating = false;
            this.last_update_rates.push(Date.now() - this.last_update);

            if (this.last_update_rates.length > 10)
                this.last_update_rates.shift();

            this.last_update = Date.now();

        }, 30);
        
    }

    get time_till_match_start()
    {
        if (!this.match_start_interval)
            return 0;

        return this.match_start_interval.time_remaining;
    }


    get update_rate()
    {
        return this.last_update_rates.reduce((a, b) => a + b, 0) / this.last_update_rates.length;
    }

    execute_commands(sock, commands)
    {
        let team = this.match.get_team_for_sock(sock)

        if (!team)
            return;

        commands.forEach((command) => {
            let player = team.players.find((p)=> p.id == command.player_id);

            if (!player)
                return;

            player.execute_command(command);
        });
    }

    get_entities_for_sock(sock)
    {
        if (!this.match)
            return [];

        let team = this.match.get_team_for_sock(sock)
        if (!team)
            return [];

        return team.players;
    }
    
    add_remote_viewport(sock, view_rect)
    {
        let remote_viewport = new RemoteViewport(sock, this.engine, view_rect);
        this.engine.add_viewport(remote_viewport);
    }

    async open_registration()
    {
        this.registering_match = new Match(this.engine);

        this.emit("registration_opened");

        // Wait for teams to register
        await new Promise((resolve, reject) => setTimeout(resolve, 2000));

        this.emit("registration_closed");
        
        return this.registering_match;
    }

    register_team(sock, team)
    {
        if (!this.registering_match)
            return;

        this.registering_match.add_team(sock, team);
    }
}


module.exports = Game;