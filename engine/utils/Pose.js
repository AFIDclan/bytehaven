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

    from_other(other)
    {
        this.x = other.x;
        this.y = other.y;
        this.angle = other.angle;
    }
    
}

module.exports = Pose;