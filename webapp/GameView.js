const { Page } = require('slitan')
const DOMViewport = require('./lib/DOMViewport');
const Entity = require('./lib/Entity.js');
const Rect = require('../engine/utils/Rect.js');

class GameView extends Page 
{
    constructor() {

        // Run this page only on when the 'page=calendar' query params is true
        super("gameview", "/"); 
        
        

    }

    async load() {

        let images = [
            "player_red.svg", 
            "player_blue.svg", 
            "player_green.svg",
            "bullet.svg"
        ]

        // GET svgs and load into an IMAGE object using $.GET
        this.images = images.map((imagepath) => {
            let img = new Image();
            img.src = "svg/" + imagepath;
            return {name: imagepath, svg: img};
        })


        this.entities = [];

        let dom_width = document.body.clientWidth-100;
        let dom_height = document.body.clientHeight;
        let aspect_ratio = dom_width / dom_height;

        let game_width = 3000;
        let game_height = game_width / aspect_ratio;

        let game_view_rect  = Rect.from_coordinates(-game_width / 2, -game_height / 2, game_width, game_height);

        this.viewport = new DOMViewport(this.entities, "game-viewport", dom_width, dom_height, game_view_rect);

        this.io.on("new_entities", (entities) => {

            entities.forEach((entity) => {
                let e = new Entity();
                e.pose.from_other(entity.pose)
                e.id = entity.id;

                //let svg = this.images.find((i) => i.name == entity.image_path).svg;
                let svg = this.images.find((i) => i.name == entity.image_path).svg;

                console.log(entity.image_path)
                
                if (svg)
                    e.image = svg
                else
                    console.log(entity)

                e.hitbox = entity.hitbox;
                //TODO: Update hitbox


                this.entities.push(e);

            });

            document.getElementById("entities-total-text").innerHTML = "Entities Total:" + this.entities.length;
            this.viewport.render();

        });

        this.io.on("moved_entities", (entities) => {
            entities.forEach((entity) => {
                let e = this.entities.find((e) => e.id == entity.id);
                if (!e)
                    return;
                e.pose.from_other(entity.pose);
            });

            this.viewport.render();
        });

        this.io.on("removed_entities", (ids) => {
            ids.forEach((id) => {
                let index = this.entities.findIndex((e) => e.id == id);
                this.entities.splice(index, 1);
            });

            document.getElementById("entities-total-text").innerHTML = "Entities Total:" + this.entities.length;
            this.viewport.render();
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

            if (this.viewport.view_rect.size.x + delta > 5000 || this.viewport.view_rect.size.y + delta > 5000)
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


    }
}

module.exports = GameView;