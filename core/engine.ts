import { AssetManager } from "./assets/assetManager";

import { GLUtilities, gl } from "./gl/gl";
import { BasicShader } from "./gl/shaders/basicShader";
import { Color } from "./graphics/color";
import { Material } from "./graphics/material";
import { MaterialManager } from "./graphics/materialManager";

import { Sprite } from "./graphics/sprite";

import { Matrix4x4 } from "./math/matrix4x4";

import { MessageBus } from "./message/messageBus";

export class Engine {
    private _canvas: HTMLCanvasElement | undefined;
    private _basicShader: BasicShader | undefined;
    private _projection: Matrix4x4 | undefined;

    private _sprite: Sprite | undefined;

    /**
     * Creates a new Engine
     *
     * @example
     * const engine = new Engine();
     */
    public constructor() {}

    /**
     * Start up the Engine
     *
     * @example
     * engine.start();
     */
    public start(): void {
        this._canvas = GLUtilities.initialize();
        gl.clearColor(0, 0, 0, 1);

        AssetManager.initialize();

        this._basicShader = new BasicShader();
        this._basicShader.use();

        // Load materials
        MaterialManager.registerMaterial(
            new Material(
                "crate",
                "assets/textures/crate.jpg",
                new Color(0, 128, 255, 255)
            )
        );

        this._projection = Matrix4x4.orthographic(
            0,
            this._canvas.width,
            this._canvas.height,
            0,
            -100.0,
            100
        );

        this._sprite = new Sprite("Test", "crate");
        this._sprite.load();

        this._sprite.position.x = 200;
        this._sprite.position.y = 100;

        this.resize();
        this.loop();
    }

    /**
     * Resizes the canvas to fit the window
     *
     * @example
     * engine.resize();
     */
    public resize(): void {
        if (this._canvas) {
            this._canvas.width = window.innerWidth;
            this._canvas.height = window.innerHeight;

            this._projection = Matrix4x4.orthographic(
                0,
                this._canvas.width,
                this._canvas.height,
                0,
                -100.0,
                100
            );
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        }
    }

    private loop(): void {
        MessageBus.update();

        gl.clear(gl.COLOR_BUFFER_BIT);

        // Set uniforms
        const projectionPosition =
            this._basicShader?.getUniformLocation("u_projection");
        gl.uniformMatrix4fv(
            projectionPosition!,
            false,
            new Float32Array(this._projection?.data ?? [])
        );

        this._sprite?.draw(this._basicShader!);

        requestAnimationFrame(this.loop.bind(this));
    }
}
