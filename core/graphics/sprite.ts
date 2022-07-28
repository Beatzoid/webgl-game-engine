import { gl } from "../gl/gl";
import { GlBuffer, AttributeInfo } from "../gl/glBuffer";
import { Shader } from "../gl/shader";
import { Matrix4x4 } from "../math/matrix4x4";
import { Vector3 } from "../math/vector3";
import { Material } from "./material";
import { MaterialManager } from "./materialManager";

export class Sprite {
    private _width: number;
    private _height: number;
    private _name: string;

    private _buffer: GlBuffer | undefined;
    private _materialName: string | undefined;
    private _material: Material | undefined;

    /** The position of the sprite */
    public position: Vector3 = new Vector3();

    /**
     * Create a new sprite
     *
     * @param name The name of the sprite
     * @param materialName The name of the material
     * @param width The width of the sprite
     * @param height The height of the sprite
     *
     * @example
     * const sprite = new Sprite("example", "player", 100, 100);
     *
     * @example
     * // If no width/height are specified, then they default to 100x100
     * const sprite = new Sprite("example", "player"); // Width=100, Height=100
     */
    public constructor(
        name: string,
        materialName: string,
        width = 100,
        height = 100
    ) {
        this._name = name;
        this._width = width;
        this._height = height;
        this._materialName = materialName;

        this._material = MaterialManager.getMaterial(this._materialName);
    }

    public get name(): string {
        return this._name;
    }

    public destroy() {
        this._buffer?.destroy();
        MaterialManager.releaseMaterial(this._materialName!);
        this._material = undefined;
        this._materialName = undefined;
    }

    /**
     * Load the sprite
     *
     * @example
     * Sprite.load();
     */
    public load(): void {
        this._buffer = new GlBuffer(5);

        const positionAttribute = new AttributeInfo();
        positionAttribute.location = 0;
        positionAttribute.offset = 0;
        positionAttribute.size = 3;
        this._buffer.addAttributeLocation(positionAttribute);

        const texCoordAttribute = new AttributeInfo();
        texCoordAttribute.location = 1;
        texCoordAttribute.offset = 3;
        texCoordAttribute.size = 2;
        this._buffer.addAttributeLocation(texCoordAttribute);

        // prettier-ignore
        const vertices = [
            //  x  y  z,  u,  v
                0, 0, 0, 0, 0,
                0, this._height, 0, 0, 1.0,
                this._width, this._height, 0, 1.0, 1.0,

                this._width, this._height, 0, 1.0, 1.0,
                this._width, 0, 0, 1.0, 0,
                0, 0, 0, 0, 0
            ];

        this._buffer.pushBackData(vertices);
        this._buffer.upload();
        this._buffer.unbind();
    }

    public update(): void {}

    /**
     * Draw the sprite
     *
     * @param shader The shader to use
     *
     * @example
     * Sprite.draw(new Shader("player", vertexShaderSource, fragmentShaderSource));
     */
    public draw(shader: Shader): void {
        const modelLocation = shader.getUniformLocation("u_model") ?? null;
        gl.uniformMatrix4fv(
            modelLocation,
            false,
            new Float32Array(Matrix4x4.translation(this.position).data)
        );

        const colorLocation = shader.getUniformLocation("u_tint") ?? null;

        gl.uniform4fv(colorLocation, this._material!.tint.toFloat32Array()!);

        if (this._material?.diffuseTexture !== undefined) {
            this._material.diffuseTexture.activateAndBind(0);

            const diffuseLocation =
                shader.getUniformLocation("u_diffuse") ?? null;
            gl.uniform1i(diffuseLocation, 0);
        }

        this._buffer?.bind();
        this._buffer?.draw();
    }
}
