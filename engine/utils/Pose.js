const Vec2 = require('./Vec2');
class Pose extends Vec2 {

    constructor(x=0, y=0, angle=0)
    {
        super(x, y);
        this.angle = angle;
    }

    after(other)
    {
        //Return a new pose that is the result of applying this pose in the coordinate system of the other pose
        let result = new Pose();
        result.x = this.x * Math.cos(other.angle) - this.y * Math.sin(other.angle) + other.x;
        result.y = this.x * Math.sin(other.angle) + this.y * Math.cos(other.angle) + other.y;
        result.angle = this.angle + other.angle;

        
        return result;
    }


    from_other(other)
    {
        this.x = other.x;
        this.y = other.y;
        this.angle = other.angle;
    }

    static from_other(other)
    {
        return new Pose(other.x, other.y, other.angle);
    }
    
}

module.exports = Pose;