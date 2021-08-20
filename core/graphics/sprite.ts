import { gl } from "../gl/gl";
import { GlBuffer, AttributeInfo } from "../gl/glBuffer";
import { Shader } from "../gl/shader";
import { Vector3 } from "../math/vector3";
import { Texture } from "./texture";
import { TextureManager } from "./textureManager";

export class Sprite {
    private _width: number;
    private _height: number;
    private _name: string;

    private _buffer: GlBuffer | undefined;
    private _textureName: string;
    private _texture: Texture;

    /** The position of the sprite */
    public position: Vector3 = new Vector3();

    /**
     * Create a new sprite
     *
     * @param name The name of the sprite
     * @param textureName The name of the texture
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
        textureName: string,
        width = 100,
        height = 100
    ) {
        this._name = name;
        this._width = width;
        this._height = height;
        this._textureName = textureName;

        this._texture = TextureManager.getTexture(this._textureName);
    }

    public get name(): string {
        return this._name;
    }

    public destory() {
        this._buffer?.destroy();
        TextureManager.releaseTexture(this._textureName);
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
        this._texture.activateAndBind(0);

        const diffuseLocation = shader.getUniformLocation("u_diffuse") ?? null;
        gl.uniform1i(diffuseLocation, 0);

        this._buffer?.bind();
        this._buffer?.draw();
    }
}
