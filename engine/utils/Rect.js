

class Rect
{
    constructor(x=0, y=0, width=0, height=0)
    {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
        
    }

    intersects(other)
    {
        //TODO: This may be wrong
        return this.left < other.right && this.right > other.left && this.top < other.bottom && this.bottom > other.top;
    }

    set x(x)
    {
        this._x = x;
    }

    set y(y)
    {
        this._y = y;
    }

    set width(width)
    {
        this._width = width;
    }

    set height(height)
    {
        this._height = height;
    }

    get x()
    {
        return this._x;
    }

    get y()
    {
        return this._y;
    }

    get width()
    {
        return this._width;
    }

    get height()
    {
        return this._height;
    }

    get center()
    {
        return {x: this._x + this._width / 2, y: this._y + this._height / 2};
    }

    get left()
    {
        return this._x;
    }

    get right()
    {
        return this._x + this._width;
    }

    get top()
    {
        return this._y;
    }

    get bottom()
    {
        return this._y + this._height;
    }

    toJSON()
    {
        return {x: this._x, y: this._y, width: this._width, height: this._height};
    }

    static from_json(json)
    {   
        return new Rect(json.x, json.y, json.width, json.height);
    }
    
}

module.exports = Rect;