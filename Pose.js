
class Pose {

    constructor(x, y, angle)
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