
class Engine
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

    remove_entity(entity)
    {
        this.entities = this.entities.filter((e) => e.id != entity.id);
    }

    add_viewport(viewport)
    {
        this.viewports.push(viewport);
    }

    update()
    {
        for (let entity of this.entities)
        {
            entity.update();
        }
    }
}

module.exports = Engine;