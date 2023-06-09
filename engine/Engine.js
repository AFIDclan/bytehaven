const { set } = require("yalls/lib/utils");
const EventEmitter = require("events");

class Engine extends EventEmitter
{
    constructor()
    {
        super();
        this.entities = [];
        this.viewports = [];
        this.entity_map = {};

        this.map_grid_size = 100;

        this.last_update = Date.now();
        this.delta_time = 0;

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
        this.emit('entity_removed', entity);
    }

    remove_all_entities()
    {
        this.entities = [];
        this.entity_map = {};
    }

    add_viewport(viewport)
    {
        this.viewports.push(viewport);
    }

    update()
    {
        this.delta_time = Date.now() - this.last_update;
        this.last_update = Date.now();
        
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

        let checked_pairs = {}

        for (let entity of this.entities.filter((entity) => entity.moved_last_frame))
        {
            for (let other_entity of this.get_adjacent_entities(entity))
            {
                if (entity.id != other_entity.id && !checked_pairs[entity.id + other_entity.id])
                {
                    checked_pairs[entity.id + other_entity.id] = true;
                    if (entity.hitbox.intersects(other_entity.hitbox))
                    {
                        entity.on_collision(other_entity);
                        other_entity.on_collision(entity);
                    }
                }
            } 
        }
    }

    get_adjacent_entities(entity, grid_search_radius=1)
    {
        let x = entity.map_location.x;
        let y = entity.map_location.y;

        let adjacent_entities = [];

        for (let i = x-grid_search_radius; i <= x+grid_search_radius; i++)
        {
            for (let j = y-grid_search_radius; j <= y+grid_search_radius; j++)
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