const EventEmitter = require('events');
class Pose extends EventEmitter {

    constructor(x=0, y=0, angle=0)
    {
        super();
        this._x = x;
        this._y = y;
        this._angle = angle;
    }

    get x()
    {
        return this._x;
    }

    get y()
    {
        return this._y;
    }

    get angle()
    {
        return this._angle;
    }

    set x(x)
    {
        this._x = x;
        this.emit('move', this)
    }

    set y(y)
    {
        this._y = y;
        this.emit('move', this)
    }

    set angle(angle)
    {
        this._angle = angle;
        this.emit('turn', this)
    }

    step_forward(distance)
    {
        this._x += distance * Math.sin(this.angle);
        this._y += distance * -Math.cos(this.angle);
        this.emit('move', this)

    }

    turn(angle)
    {
        this._angle += angle;
        this.emit('turn', this)
    }
}

module.exports = Pose;