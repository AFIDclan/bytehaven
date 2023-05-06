
class NovaEngine
{
    constructor()
    {
        this.entities = [];
        this.viewports = [];
    }

    add_entity(entity)
    {
        this.entities.push(entity);
    }

    add_viewport(viewport)
    {
        this.viewports.push(viewport);
    }
}

module.exports = NovaEngine;