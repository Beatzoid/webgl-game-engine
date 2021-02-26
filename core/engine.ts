import { gl, GLUtilities } from "./gl/gl";
import { Shader } from "./gl/shader";

export class Engine {
    private _canvas: HTMLCanvasElement | undefined;
    private _shader: Shader | undefined;

    private _buffer: WebGLBuffer | undefined;

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

        this.createBuffer();

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

            gl.viewport(0, 0, this._canvas.width, this._canvas.height);
        }
    }

    private loop(): void {
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer as WebGLBuffer);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        requestAnimationFrame(this.loop.bind(this));
    }

    private createBuffer(): void {
        this._buffer = gl.createBuffer() as WebGLBuffer;

        // prettier-ignore
        const vertices = [
        //  x  y  z
            0, 0, 0,
            0, 0.5, 0,
            0.5, 0.5, 0
        ];

        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(vertices),
            gl.STATIC_DRAW
        );

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.disableVertexAttribArray(0);
    }

    private loadShaders(): void {
        const vertexShaderSource = `
        attribute vec3 a_position;

        void main() {
            gl_Position = vec4(a_position, 1.0);
        }`;

        const fragmentShaderSource = `
        precision mediump float;

        void main() {
            gl_FragColor = vec4(1.0);
        }
        `;

        this._shader = new Shader(
            "basic",
            vertexShaderSource,
            fragmentShaderSource
        );
    }
}
