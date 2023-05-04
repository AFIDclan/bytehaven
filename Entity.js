const Pose = require('./Pose.js');

class Entity
{
    constructor()
    {
        this.pose = new Pose(0, 0, 0);
    }
}

module.exports = Entity;