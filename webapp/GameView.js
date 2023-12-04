const { Page } = require('slitan')
const DOMViewport = require('./lib/DOMViewport');
const Entity = require('./lib/Entity.js');
const Rect = require('../engine/utils/Rect.js');


const player_colors = [
    ["red", "rgb(213, 47, 47)"],
    ["pink", "rgb(240, 98, 146)"],
    ["purple", "rgb(142, 36, 170)"],
    ["deep-purple", "rgb(94, 53, 177)"],
    ["indigo", "rgb(64, 81, 181)"],
    ["blue", "rgb(25, 118, 210)"],
    ["light-blue", "rgb(2, 136, 209)"],
    ["cyan", "rgb(0, 151, 167)"],
    ["teal", "rgb(0, 121, 107)"],
    ["green", "rgb(56, 142, 60)"],
    ["light-green", "rgb(104, 159, 56)"],
    ["lime", "rgb(175, 180, 43)"],
    ["yellow", "rgb(251, 192, 45)"],
    ["amber", "rgb(255, 160, 0)"],
    ["orange", "rgb(255, 87, 34)"],
    ["deep-orange", "rgb(244, 81, 30)"],
    ["brown", "rgb(121, 85, 72)"],
    ["grey", "rgb(158, 158, 158)"],
    ["blue-grey", "rgb(96, 125, 139)"]
]

class GameView extends Page 
{
    constructor() {

        // Run this page only on when the 'page=calendar' query params is true
        super("gameview", "/"); 
        
        

    }

    async load() {
        // Get a list of .png files in the /images folder
        let images = await $.get("images");


        // GET imgs and load into an IMAGE object using $.GET
        this.images = images.map((imagepath) => {
            let img = new Image();
            img.src = "images/" + imagepath;
            return {path: imagepath, img: img};
        })


        this.entities = [];

        let dom_width = document.body.clientWidth;
        let dom_height = document.body.clientHeight;
        let aspect_ratio = dom_width / dom_height;

        let game_width = 8000;
        let game_height = game_width / aspect_ratio;

        let game_view_rect  = Rect.from_coordinates(-game_width / 2, -game_height / 2, game_width, game_height);

        this.viewport = new DOMViewport(this.entities, "game-viewport", dom_width, dom_height, game_view_rect, this.images.filter((i) => i.path && i.path.startsWith("bg_space")).map((i) => i.img));

        this.io.on("stats_update", (stats) => {
            $("#time-till-match-start").html("Time Till Match Start: " + Math.round(stats.time_till_match_start / 1000) + "s");
            $("#leaderboard-teams").empty()
            $("#current-match-teams").empty()

            if (stats.match_history.length > 0)
            {
                let teams = {}

                for (let match of stats.match_history)
                {
                    for (let team of match)
                    {
                        if (!teams[team.team_name])
                            teams[team.team_name] = {score: 0, name: team.team_name};

                        teams[team.team_name].score += team.score;
                    }
                }

                teams = Object.values(teams).sort((a, b) => b.score - a.score);
    
                for (let team of teams)
                    $("#leaderboard-teams").append(`<team><teamname>${team.name}:</teamname><teamscore>${Math.round(team.score)}</teamscore></team>`)
                
                $("#last-win-text").html("Last Win: " + stats.match_history.slice(-1)[0][0].team_name);
            }

            if (stats.current_match)
            {
                for (let team of stats.current_match.teams)
                {
                    let color = player_colors.find((c)=>c[0] == team.team_color);

                    if (color)
                        color = color[1];
                    else
                        color = "white";
                        
                    $("#current-match-teams").append(`<team><teamname style="color: ${color};padding-right: 0px;margin: auto;">${team.team_name}</teamname></team>`)
                }
            }


        });


        this.io.on("new_entities", (entities) => {

            entities.forEach((entity) => {
                let e = new Entity(entity, this);

                this.entities.push(e);

            });

            document.getElementById("entities-total-text").innerHTML = "Entities Total:" + this.entities.length;
        });

        this.io.on("entities_moved", (entities) => {
            entities.forEach((entity) => {
                
                let e = this.entities.find((e) => e.id == entity.id);
                if (!e)
                    return;

                e.pose.from_other(entity.pose);
            });

        });

        this.io.on("entities_image_changed", (entities) => {
            console.log("Image changed for " + entities.length + " entities")
            entities.forEach((entity) => {
                
                let e = this.entities.find((e) => e.id == entity.id);
                if (e) e.update_image(entity.image);

            });

        });



        this.io.on("removed_entities", (ids) => {
            ids.forEach((id) => {
                let index = this.entities.findIndex((e) => e.id == id);
                this.entities.splice(index, 1);
            });

            document.getElementById("entities-total-text").innerHTML = "Entities Total:" + this.entities.length;
        });

        this.io.emit("register_viewport", this.viewport.view_rect)

        //Click and drag to move the viewport
        let mouse_down = false;
        let last_mouse_pos = null;

        $("#game-viewport").on("mousedown", (e) => {
            mouse_down = true;
            last_mouse_pos = {x: e.clientX, y: e.clientY};
        });

        $("#game-viewport").on("mouseup", (e) => {
            mouse_down = false;
        }   );

        $("#game-viewport").on("mousemove", (e) => {
            if (!mouse_down)
                return;

            let dx = e.clientX - last_mouse_pos.x;
            let dy = e.clientY - last_mouse_pos.y;
            
            let scale = this.viewport.view_rect.size.x / this.viewport.dom_width;

            this.viewport.view_rect.center.x -= dx * scale;
            this.viewport.view_rect.center.y -= dy * scale;
            last_mouse_pos = {x: e.clientX, y: e.clientY};

            this.io.emit("viewport_update", this.viewport.view_rect)

            this.viewport.render();
        });

        $("#game-viewport").on("wheel", (e) => {
            let delta = Math.sign(e.originalEvent.deltaY) * 100;

            if (this.viewport.view_rect.size.x + delta < 400 || this.viewport.view_rect.size.y + delta < 400)
                return;

            if (this.viewport.view_rect.size.x + delta > 9000 || this.viewport.view_rect.size.y + delta > 9000)
                return;

            let aspect_ratio = this.viewport.view_rect.size.x / this.viewport.view_rect.size.y;

            let delta_x = delta * aspect_ratio;
            let delta_y = delta;

            this.viewport.view_rect.size.x += delta_x;
            this.viewport.view_rect.size.y += delta_y;

            this.viewport.view_rect.x -= delta_x / 2;
            this.viewport.view_rect.y -= delta_y / 2;

            this.io.emit("viewport_update", this.viewport.view_rect)

            this.viewport.render();
        });

        setInterval(() => {
            this.viewport.render();
        }, 30);
    }
}

module.exports = GameView;