export class Color {
    private _r: number;
    private _g: number;
    private _b: number;
    private _a: number;

    /**
     * The color class is responsible for managing colors
     *
     * @param r The red value of the color. Defaults to 255
     * @param g The green value of the color. Defaults to 255
     * @param b The blue value of the color. Defaults to 255
     * @param a The alpha value of the color. Defaults to 255
     *
     * @example
     * const color = new Color(); // r g b and a all equal 255
     *
     * @example
     * const color = new Color(100, 100, 255, 0.5);
     */
    public constructor(r = 255, g = 255, b = 255, a = 255) {
        this._r = r;
        this._g = g;
        this._b = b;
        this._a = a;
    }

    public get r(): number {
        return this._r;
    }

    public set r(value: number) {
        this._r = value;
    }

    public get rFloat(): number {
        return this._r / 255.0;
    }

    public get g(): number {
        return this._g;
    }

    public set g(value: number) {
        this._g = value;
    }

    public get gFloat(): number {
        return this._g / 255.0;
    }

    public get b(): number {
        return this._b;
    }

    public set b(value: number) {
        this._b = value;
    }

    public get bFloat(): number {
        return this._b / 255.0;
    }

    public get a(): number {
        return this._r;
    }

    public set a(value: number) {
        this._a = value;
    }

    public get aFloat(): number {
        return this._a / 255.0;
    }

    public toArray(): number[] {
        return [this._r, this._g, this._b, this._a];
    }

    public toFloatArray(): number[] {
        return [
            this._r / 255.0,
            this._g / 255.0,
            this._b / 255.0,
            this._a / 255.0
        ];
    }

    public toFloat32Array(): Float32Array {
        return new Float32Array(this.toFloatArray());
    }

    public static white(): Color {
        return new Color(255, 255, 255, 255);
    }

    public static black(): Color {
        return new Color(0, 0, 0, 255);
    }

    public static red(): Color {
        return new Color(255, 0, 0, 255);
    }

    public static green(): Color {
        return new Color(0, 255, 0, 255);
    }

    public static blue(): Color {
        return new Color(0, 0, 255, 255);
    }
}
