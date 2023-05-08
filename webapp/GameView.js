const { Page } = require('slitan')
const DOMViewport = require('./lib/DOMViewport');
const Entity = require('./lib/Entity.js');
const Rect = require('../engine/utils/Rect.js');

class GameView extends Page 
{
    constructor() {

        // Run this page only on when the 'page=calendar' query params is true
        super("gameview", "/"); 
        
        

        this.entities = [];

        this.viewport = new DOMViewport(this.entities, "game-viewport", 800, 600, new Rect(-500, -375, 1000, 750));

        this.io.on("new_entities", (entities) => {

            console.log("New entities", entities);
            entities.forEach((entity) => {
                let e = new Entity();
                e.pose.from_other(entity.pose)
                e.id = entity.id;
                e.svg_data = entity.svg_data;
                e.hitbox = entity.hitbox;
                //TODO: Update hitbox



                e.reload_image();
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

    }

    async load() {
    }
}

module.exports = GameView;