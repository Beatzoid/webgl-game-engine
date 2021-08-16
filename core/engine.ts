import { GLUtilities, gl } from "./gl/gl";
import { Shader } from "./gl/shader";
import { Sprite } from "./graphics/sprite";
import { Matrix4x4 } from "./math/matrix4x4";

export class Engine {
    private _canvas: HTMLCanvasElement | undefined;
    private _shader: Shader | undefined;
    private _projection: Matrix4x4 | undefined;

    private _sprite: Sprite | undefined;

    /**
     * Creates a new Engine
     */
    public constructor() {}

    /**
     * Start up the Engine
     */
    public start(): void {
        this._canvas = GLUtilities.initialize();
        gl.clearColor(0, 0, 0, 1);

        this.loadShaders();
        this._shader?.use();

        this._projection = Matrix4x4.orthographic(
            0,
            this._canvas.width,
            0,
            this._canvas.height,
            -100,
            100
        );

        this._sprite = new Sprite("Test");
        this._sprite.load();

        this._sprite.position.x = 200;

        this.resize();
        this.loop();
    }

    /**
     * Resizes the canvas to fit the window
     */
    public resize(): void {
        if (this._canvas) {
            this._canvas.width = window.innerWidth;
            this._canvas.height = window.innerHeight;

            gl.viewport(-1, 1, -1, -1);
        }
    }

    private loop(): void {
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Set uniforms
        const colorPosition = this._shader?.getUniformLocation("u_color")!!;
        gl.uniform4f(colorPosition, 1, 0.5, 0, 1);

        const projectionPosition =
            this._shader?.getUniformLocation("u_projection");
        gl.uniformMatrix4fv(
            projectionPosition!,
            false,
            new Float32Array(this._projection?.data!)
        );

        let modelLocation = this._shader?.getUniformLocation("u_model")!;
        gl.uniformMatrix4fv(
            modelLocation,
            false,
            new Float32Array(
                Matrix4x4.translation(this._sprite?.position!).data
            )
        );

        this._sprite?.draw();

        requestAnimationFrame(this.loop.bind(this));
    }

    private loadShaders(): void {
        const vertexShaderSource = `
        attribute vec3 a_position;

        uniform mat4 u_projection;
        uniform mat4 u_model;

        void main() {
            gl_Position = u_projection * u_model * vec4(a_position, 1.0);
        }`;

        const fragmentShaderSource = `
        precision mediump float;

        uniform vec4 u_color;

        void main() {
            gl_FragColor = u_color;
        }
        `;

        this._shader = new Shader(
            "basic",
            vertexShaderSource,
            fragmentShaderSource
        );
    }
}
