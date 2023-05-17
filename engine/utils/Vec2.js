/**
 * A 2-dimensional vector class.
 *
 * @class
 */
class Vec2 {
  /**
   * Creates a new vector with the given x and y components.
   *
   * @constructor
   * @param {number} [x=0] - The x component of the vector.
   * @param {number} [y=0] - The y component of the vector.
   */
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  /**
   * Returns the result of subtracting another vector from this vector.
   *
   * @param {Vec2} other - The other vector to subtract from this vector.
   * @returns {Vec2} A new vector representing the result of the subtraction.
   */
  subtract(other) {
    return new Vec2(this.x - other.x, this.y - other.y);
  }

  /**
   * Returns a new vector that is scaled by the given factor.
   *
   * @param {number} factor - The factor to scale the vector by.
   * @returns {Vec2} A new vector that is scaled by the given factor.
   */
  scale(factor) {
    return new Vec2(this.x * factor, this.y * factor);
  }

  /**
   * Returns the dot product of this vector and another vector.
   *
   * @param {Vec2} other - The other vector to take the dot product with.
   * @returns {number} The dot product of this vector and the other vector.
   */
  dot(other) {
    return this.x * other.x + this.y * other.y;
  }

  /**
   * Returns a new vector that has the same direction as this vector, but with a length of 1.
   *
   * If the length of the vector is 0, this method returns a new vector with both x and y components set to 0.
   *
   * @returns {Vec2} A new vector with length 1 that has the same direction as this vector.
   */
  normalize() {
    const length = Math.sqrt(this.x * this.x + this.y * this.y);
    if (length === 0) {
      return new Vec2();
    } else {
      return new Vec2(this.x / length, this.y / length);
    }
  }

  /*
    * Returns the magnitude of this vector.
    * @returns {number} The magnitude of this vector.
    * 
    */
  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  static from_json(json) {
    return new Vec2(json.x, json.y);
  }
}

module.exports = Vec2;
