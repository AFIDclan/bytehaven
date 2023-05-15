const Vec2 = require('./Vec2');
class Pose extends Vec2 {

    constructor(x=0, y=0, angle=0)
    {
        super(x, y);
        this.angle = angle;
    }

    step_forward(distance)
    {
        this.x += distance * Math.sin(this.angle);
        this.y += distance * -Math.cos(this.angle);
    }

    turn(angle)
    {
        this.angle += angle;
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

    rotate_vec(other)
    {
        let result = new Vec2();
        result.x = other.x * Math.cos(this.angle) - other.y * Math.sin(this.angle);
        result.y = other.x * Math.sin(this.angle) + other.y * Math.cos(this.angle);
        return result;
    }

    from_other(other)
    {
        this.x = other.x;
        this.y = other.y;
        this.angle = other.angle;
    }
    
}

module.exports = Pose;