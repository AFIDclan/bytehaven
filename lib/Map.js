const { Entity, Image, PhysicsEntity } = require("../engine");
const { Polygon, Vector2 } = require("collidify");

class Map {
    constructor(engine, width, height) {

        this.width = width;
        this.height = height;

        this.engine = engine;

        this.wall_image = "wall.png";

        this.block_size = 32;

        this.fill_amount = 0.45;

        this.grid = [];

    }


    get_grid_bounds()
    {
        let size_x = this.width/this.block_size;
        let size_y = this.height/this.block_size;

        return {
            start_x: Math.floor(-size_x/2), 
            start_y: Math.floor(-size_y/2), 
            end_x: Math.ceil(size_x/2), 
            end_y: Math.ceil(size_y/2)};
    }

    random_fill_grid()
    {

        let bounds = this.get_grid_bounds();
        
        for (let x=bounds.start_x;x<bounds.end_x;x++)
        {
            for (let y=bounds.start_y;y<bounds.end_y;y++)
            {
                if (!this.grid[x]) this.grid[x] = [];

                if (x < bounds.start_x+2 || y < bounds.start_y+2 || x >= bounds.end_x-2 || y >= bounds.end_y-2)
                    this.grid[x][y] = true;
            }
        }
    }

    get_surronding_blocks(x, y)
    {
        let blocks = [];

        for (let i=-1;i<=1;i++)
        {
            for (let j=-1;j<=1;j++)
            {
                if (i == 0 && j == 0) continue;
                if (!this.grid[x+i]) continue;
                if (!this.grid[x+i][y+j]) continue;

                blocks.push({x: x+i, y: y+j});
            }
        }

        return blocks;
    }

    smooth_grid()
    {
        let bounds = this.get_grid_bounds();

        let new_grid = [];

        for (let x=bounds.start_x;x<bounds.end_x;x++)
        {
            for (let y=bounds.start_y;y<bounds.end_y;y++)
            {
                let blocks = this.get_surronding_blocks(x, y);

                let count = blocks.length;

                if (!new_grid[x]) new_grid[x] = [];

                if (count > 4)
                    new_grid[x][y] = true;
                else if (count < 4)
                    new_grid[x][y] = false;
                else
                    new_grid[x][y] = this.grid[x][y];
            }
        }

        this.grid = new_grid;
    }

    load()
    {

        this.random_fill_grid();

        for (let i=0;i<5;i++)
        {
            this.smooth_grid();
        }

        let bounds = this.get_grid_bounds();
        
        for (let x=bounds.start_x;x<bounds.end_x;x++)
        {
            for (let y=bounds.start_y;y<bounds.end_y;y++)
            {
                if (this.grid[x][y])
                {
                    let hitbox = new Polygon([new Vector2(0, 0), 
                        new Vector2(this.block_size, 0), 
                        new Vector2(this.block_size, this.block_size), 
                        new Vector2(0, this.block_size)]);

                    let block = new PhysicsEntity(this.wall_image, hitbox, "DirtBlock", true);
                    block.set_position(x*this.block_size, y*this.block_size);
                    this.engine.add_entity(block);
                }
            }
        }
    }
}

module.exports = Map;