import {
    AssetManager,
    MESSAGE_ASSET_LOADER_ASSET_LOADED
} from "../assets/assetManager";
import { ImageAsset } from "../assets/imageAssetLoader";
import { gl } from "../gl/gl";
import { IMessageHandler } from "../message/IMessageHandler";
import { Message } from "../message/message";

const LEVEL = 0;
const BORDER = 0;
const TEMP_IMAGE_DATA: Uint8Array = new Uint8Array([255, 255, 255, 255]);

export class Texture implements IMessageHandler {
    private _name: string;
    private _handle: WebGLTexture | null;
    private _isLoaded = false;
    private _width: number;
    private _height: number;

    /**
     * Creates a new texture
     *
     * @param name The name of the texture
     * @param width The width of the texture
     * @param height The height of the texture
     *
     * @example
     * const texture = new Texture("example", 256, 256);
     *
     * @example
     * // Width and height both default to 1
     * const texture = new Texture("example");
     * texture.width; // 1
     * texture.height; // 1
     */
    constructor(name: string, width = 1, height = 1) {
        this._name = name;
        this._width = width;
        this._height = height;

        this._handle = gl.createTexture();

        Message.subscribe(MESSAGE_ASSET_LOADER_ASSET_LOADED + this._name, this);

        this.bind();

        gl.texImage2D(
            gl.TEXTURE_2D,
            LEVEL,
            gl.RGBA,
            1,
            1,
            BORDER,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            TEMP_IMAGE_DATA
        );

        const asset = AssetManager.getAsset(this._name);
        if (asset) {
            this.loadTextureFromAsset(asset as ImageAsset);
        }
    }

    public get isLoaded() {
        return this._isLoaded;
    }

    public get name() {
        return this._name;
    }

    public get width() {
        return this._width;
    }

    public get height() {
        return this._height;
    }

    /**
     * Active and bind the texture
     *
     * @param textureUnit The unit to active and bind
     *
     * @example
     * const texture = new Texture("example");
     * texture.activeAndBind(); // textureUnit defaults to 0
     */
    public activateAndBind(textureUnit = 0) {
        gl.activeTexture(gl.TEXTURE0 + textureUnit);

        this.bind();
    }

    /**
     * Destroy the texture
     *
     * @example
     * const texture = new Texture("example");
     * texture.destroy();
     */
    public destroy() {
        gl.deleteTexture(this._handle);
    }

    /**
     * Bind the texture
     *
     * @example
     * const texture = new Texture("example");
     * texture.bind();
     */
    public bind() {
        gl.bindTexture(gl.TEXTURE_2D, this._handle);
    }

    /**
     * Unbind the texture
     *
     * @example
     * const texture = new Texture("example");
     * texture.unbind();
     */
    public unbind() {
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    public onMessage(message: Message): void {
        // If we receive a message saying that our asset has been loaded
        if (message.code === MESSAGE_ASSET_LOADER_ASSET_LOADED + this._name) {
            this.loadTextureFromAsset(message.context as ImageAsset);
        }
    }

    private loadTextureFromAsset(asset: ImageAsset) {
        this._width = asset.width;
        this._height = asset.height;

        this.bind();

        gl.texImage2D(
            gl.TEXTURE_2D,
            LEVEL,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            asset.data
        );

        if (this.isPowerOfTwo()) {
            gl.generateMipmap(gl.TEXTURE_2D);
        } else {
            // Do not generate a mip map and clamp wrapping to edge.
            gl.texParameteri(
                gl.TEXTURE_2D,
                gl.TEXTURE_WRAP_S,
                gl.CLAMP_TO_EDGE
            );

            gl.texParameteri(
                gl.TEXTURE_2D,
                gl.TEXTURE_WRAP_T,
                gl.CLAMP_TO_EDGE
            );

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        }

        this._isLoaded = true;
    }

    private isPowerOfTwo(): boolean {
        return (
            this.isValuePowerOfTwo(this._width) &&
            this.isValuePowerOfTwo(this._height)
        );
    }

    private isValuePowerOfTwo(value: number): boolean {
        return (value & (value - 1)) === 0;
    }
}
