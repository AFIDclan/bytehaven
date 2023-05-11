
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
            entity.update();
        
        //Check for collisions
        for (let entity of this.entities)
        {
            for (let other_entity of this.entities)
            {
                if (entity.id != other_entity.id)
                {
                    if (entity.hitbox.intersects(other_entity.hitbox))
                    {
                        entity.on_collision(other_entity);
                    }
                }
            } 
        }
        

        for (let viewport of this.viewports)
            viewport.render();

    }
}

module.exports = Engine;