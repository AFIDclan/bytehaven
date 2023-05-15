const { set } = require("yalls/lib/utils");

class Engine
{
    constructor()
    {
        this.entities = [];
        this.viewports = [];
        this.entity_map = {};

        this.map_grid_size = 100;

        // Clean up any stragglers in the entity map
        setInterval(()=>{
            this.garbage_collect_entity_map();
        }, 1000)
    }

    add_entity(entity)
    {
        this.entities.push(entity);

        this.update_entity_in_map(entity);
    }

    remove_entity(entity)
    {
        this.remove_entity_from_map(entity);
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


        // Maintain the entity map
        this.entities.filter((entity) => entity.moved_last_frame).forEach((entity) => this.update_entity_in_map(entity));

        this.check_collisions();

        for (let viewport of this.viewports)
            viewport.render();

    }

    check_collisions()
    {
        for (let entity of this.entities)
        {
            for (let other_entity of this.get_adjacent_entities(entity))
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
    }

    get_adjacent_entities(entity)
    {
        let x = entity.map_location.x;
        let y = entity.map_location.y;

        let adjacent_entities = [];

        for (let i = x-1; i <= x+1; i++)
        {
            for (let j = y-1; j <= y+1; j++)
            {
                if (this.entity_map[i] != undefined && this.entity_map[i][j] != undefined)
                {
                    adjacent_entities = adjacent_entities.concat(this.entity_map[i][j]);
                }
            }
        }
        return adjacent_entities;
    }

    garbage_collect_entity_map()
    {
        for (let x in this.entity_map)
        {
            for (let y in this.entity_map[x])
            {
                this.entity_map[x][y] = this.entity_map[x][y].filter((entity) => this.entities.find((e) => e.id == entity.id));
            }
        }
    }

    remove_entity_from_map(entity)
    {
        let x = Math.round(entity.pose.x/this.map_grid_size);
        let y = Math.round(entity.pose.y/this.map_grid_size);

        if (this.entity_map[x] != undefined && this.entity_map[x][y] != undefined)
        {
            this.entity_map[x][y] = this.entity_map[x][y].filter((e) => e.id != entity.id);
        }
    }

    update_entity_in_map(entity)
    {
        let x = Math.round(entity.pose.x/this.map_grid_size);
        let y = Math.round(entity.pose.y/this.map_grid_size);

        if (this.entity_map[x] == undefined)
            this.entity_map[x] = {};

        if (this.entity_map[x][y] == undefined)
            this.entity_map[x][y] = [];

        

        if (entity.map_location != undefined)
        {
            let old_x = entity.map_location.x;
            let old_y = entity.map_location.y;
            

            if (this.entity_map[old_x] != undefined && this.entity_map[old_x][old_y] != undefined)
            {
                this.entity_map[old_x][old_y] = this.entity_map[old_x][old_y].filter((e) => e.id != entity.id);
            }
        }


        this.entity_map[x][y].push(entity);

        entity.map_location = {x: x, y: y};

    }
}

module.exports = Engine;