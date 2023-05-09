const { EntryPoint } = require('slitan')

class Index extends EntryPoint
{

    async load()
    {
        //Add some pages to be rendered
        this.add_page(require("./GameView"))
    }
}


let index = new Index()
index.start()