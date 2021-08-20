export class Vector2 {
    private _x: number;
    private _y: number;

    /**
     * Creates a new Vector2
     *
     * @param x The x value of the Vector
     * @param y The y value of the Vector
     *
     * @example
     * const vector = new Vector2(1, 2);
     */
    public constructor(x = 0, y = 0) {
        this._x = x;
        this._y = y;
    }

    public get x(): number {
        return this._x;
    }
    public set x(value: number) {
        this._x = value;
    }

    public get y(): number {
        return this._y;
    }
    public set y(value: number) {
        this._y = value;
    }

    /**
     * Returns the Vector3 data as an array
     *
     * @example
     * new Vector3(1, 2, 3).toArray();
     *
     * @returns the Vector3 data as an array
     *
     */
    public toArray(): number[] {
        return [this._x, this._y];
    }

    /**
     * Returns the Vector3 data as a Float32Array
     *
     * @example
     * new Vector3(1, 2, 3).toFloat32Array();
     *
     * @returns the Vector3 data as a Float32Array
     */
    public toFloat32Array(): Float32Array {
        return new Float32Array(this.toArray());
    }
}
