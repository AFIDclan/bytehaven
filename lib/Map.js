const { Entity, Rect } = require("../engine");

class Map {
    constructor(engine, width, height, spawn_count) {

        this.width = width;
        this.height = height;

        this.engine = engine;

        this.spawn_count = spawn_count;
        this.spawn_points = [];

        this.dirt_image = "dirt.png";

        this.block_size = 30;

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
                else
                    this.grid[x][y] = Math.random() < this.fill_amount;
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
                    let block = new Entity(this.dirt_image, Rect.from_coordinates(0, 0, this.block_size, this.block_size), "DirtBlock");
                    block.pose.x = x*this.block_size;
                    block.pose.y = y*this.block_size;
                    this.engine.add_entity(block);
                }
            }
        }
    }
}

module.exports = Map;