
class Map {
    constructor(engine, width, height, spawn_count) {

        this.width = width;
        this.height = height;

        this.engine = engine;

        this.spawn_count = spawn_count;
        this.spawn_points = [];

        this.grid = [];

    }

    random_fill_grid()
    {
        for (let x=-this.width/2;x<this.width/2;x++)
        {
            for (let y=-this.height/2;y<this.height/2;y++)
            {
                this.grid[x][y] = Math.random() < 0.5;
            }
        }
    }

    load()
    {
        
    }
}