
class Pose {

    constructor(x=0, y=0, angle=0)
    {
        this.x = x;
        this.y = y;
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
}

module.exports = Pose;