import { Vector3 } from "./vector3";

export class Matrix4x4 {
    private _data: number[] = [];

    private constructor() {
        // prettier-ignore
        this._data = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ];
    }

    /** Returns the data contained in this matrix as an array of numbers */
    public get data(): number[] {
        return this._data;
    }

    /** Returns a new identity matrix */
    public static identity(): Matrix4x4 {
        return new Matrix4x4();
    }

    /**
     * Creates and returns a new orthographic projection matrix.
     * @param left The left extents of the viewport.
     * @param right The right extents of the viewport.
     * @param bottom The bottom extents of the viewport.
     * @param top The top extents of the viewport.
     * @param nearClip The near clipping plane.
     * @param farClip The far clipping plane.
     */
    public static orthographic(
        left: number,
        right: number,
        bottom: number,
        top: number,
        nearClip: number,
        farClip: number
    ): Matrix4x4 {
        const m = new Matrix4x4();

        const lr = 1.0 / (left - right);
        const bt = 1.0 / (bottom - top);
        const nf = 1.0 / (nearClip - farClip);

        // First Row
        m._data[0] = -2.0 * lr;

        // Second Row
        m._data[5] = -2.0 * bt;

        // Third Row
        m._data[11] = 2.0 * nf;

        // Fourth Row
        m._data[12] = (left + right) * lr;
        m._data[13] = (top + bottom) * bt;
        m._data[14] = (farClip + nearClip) * nf;

        return m;
    }

    /**
     * Creates a transformation matrix using the provided position.
     * @param position The position to be used in transformation.
     */
    public static translation(position: Vector3): Matrix4x4 {
        const m = new Matrix4x4();

        m._data[12] = position.x;
        m._data[13] = position.y;
        m._data[14] = position.z;

        return m;
    }
}
