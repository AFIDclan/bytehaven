const { Page } = require('slitan')
const { DOMViewport } = require('../engine');

class GameView extends Page 
{
    constructor() {

        // Run this page only on when the 'page=calendar' query params is true
        super("gameview", "/"); 
        
        

        this.entities = [];

        this.viewport = new DOMViewport(this.entities, "game-viewport", 800, 600);

        this.io.on("entities", (entities) => {
            this.entities = entities;
            this.viewport.render();

        });
        this.io.emit("register_viewport", this.viewport)

    }

    async load() {
    }
}

module.exports = GameView;