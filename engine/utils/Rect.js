const Vec2 = require('./Vec2');

/**
 * A rectangle class defined by a center position, a size, and a rotation angle (in radians).
 *
 * @class
 */
class Rect {
    /**
     * Creates a new rectangle with the given center position, size, and rotation angle.
     *
     * @constructor
     * @param {Vec2} [center=new Vec2()] - The center position of the rectangle.
     * @param {Vec2} [size=new Vec2()] - The size of the rectangle.
     * @param {number} [angle=0] - The rotation angle of the rectangle (in radians).
     */
    constructor(center = new Vec2(), size = new Vec2(), angle = 0) {
        this.center = center;
        this.size = size;
        this.angle = angle;
        this.update_corners();
    }


    /**
     * Updates the rectangle's center position, size, and rotation angle based on the given pose.
     * @param {Pose} pose - The pose to update the rectangle from.
     */

    update_from_pose(pose) {
        this.center = new Vec2(pose.x, pose.y);
        this.angle = pose.angle;
        this.update_corners();
    }

    /**
     * Updates the corner positions of the rectangle based on its center position, size, and rotation angle.
     *
     * @private
     */
    update_corners() {
        const half_size = this.size.scale(0.5);
        const cos = Math.cos(this.angle);
        const sin = Math.sin(this.angle);
        this.corners = [
            new Vec2(this.center.x - half_size.x * cos - half_size.y * sin, this.center.y + half_size.x * sin - half_size.y * cos),
            new Vec2(this.center.x + half_size.x * cos - half_size.y * sin, this.center.y - half_size.x * sin - half_size.y * cos),
            new Vec2(this.center.x + half_size.x * cos + half_size.y * sin, this.center.y - half_size.x * sin + half_size.y * cos),
            new Vec2(this.center.x - half_size.x * cos + half_size.y * sin, this.center.y + half_size.x * sin + half_size.y * cos)
        ];
    }

    get width() {
        return this.size.x;
    }

    get height() {
        return this.size.y;
    }

    /**
     * Creates a new rectangle from the given coordinates (x, y, width, height).
     *
     * @static
     * @param {number} x - The x-coordinate of the rectangle's top-left corner.
     * @param {number} y - The y-coordinate of the rectangle's top-left corner.
     * @param {number} width - The width of the rectangle.
     * @param {number} height - The height of the rectangle.
     * @returns {Rect} A new rectangle created from the given coordinates.
     */
    static from_coordinates(x, y, width, height) {
        let center = new Vec2(x + width / 2, y + height / 2);
        let size = new Vec2(width, height);
        return new Rect(center, size);
    }


    static from_json(json) {
        return new Rect(
            Vec2.from_json(json.center),
            Vec2.from_json(json.size),
            json.angle
        );   
    }


    /**
     * Returns a vector representing the overlap between this rectangle and another axis-aligned rectangle.
     * The vector points from the center of this rectangle to the center of the other.
     * Its magnitude represents the estimated overlap distance along each axis.
     *
     * @param {Rect} other - The other rectangle to calculate the overlap vector with.
     * @returns {Vec2} The overlap vector.
     */
    get_overlap_vector(other) {
        const dx = Math.max(0, Math.min(this.center.x + this.size.x / 2, other.center.x + other.size.x / 2) - Math.max(this.center.x - this.size.x / 2, other.center.x - other.size.x / 2));
        const dy = Math.max(0, Math.min(this.center.y + this.size.y / 2, other.center.y + other.size.y / 2) - Math.max(this.center.y - this.size.y / 2, other.center.y - other.size.y / 2));

        return new Vec2(dx, dy);
    }

    /**
     * Returns true if this rectangle intersects another rectangle
     *
     * @param {Rect} other - The other rotated rectangle to test for intersection.
     */
    intersects(other) {
        // Get the separating axes
        let axes = this.get_separating_axes().concat(other.get_separating_axes());

        // Check overlap for each axis
        for (let axis of axes) {
            if (!this.overlaps_on_axis(axis, other)) {
                // Separation found
                return false;
            }
        }
        // No separation found
        return true;
    }

    /**
   * Returns true if this rectangle overlaps another rectangle on the given axis.
   *
   * @param {Vec2} axis - The axis to test for overlap on.
   * @param {Rect} other - The other rectangle to test for overlap with.
   * @returns {boolean} True if the two rectangles overlap on the given axis, false otherwise.
   */
    overlaps_on_axis(axis, other) {
        // Project both shapes onto the axis
        let projectionA = this.project_onto_axis(axis);
        let projectionB = other.project_onto_axis(axis);

        // Check for overlap on the axis
        return projectionA[0] < projectionB[1] && projectionB[0] < projectionA[1];
    }

    /**
     * Projects the corners of the rectangle onto the given axis, and returns the min and max dot products.
     *
     * @param {Vec2} axis - The axis to project the corners onto.
     * @returns {number[]} An array containing the min and max dot products of the corners projected onto the axis.
     */
    project_onto_axis(axis) {
        let dots = this.corners.map(corner => corner.dot(axis));
        return [Math.min(...dots), Math.max(...dots)];
    }

    /**
     * Returns the separating axes of this rectangle.
     *
     * The separating axes of a rectangle are its normal vectors (normal to its edges).
     *
     * @returns {Vec2[]} An array containing the separating axes of this rectangle.
     */
    get_separating_axes() {
        return [
            this.corners[1].subtract(this.corners[0]).normalize(),
            this.corners[1].subtract(this.corners[2]).normalize()
        ];
    }
}

module.exports = Rect;