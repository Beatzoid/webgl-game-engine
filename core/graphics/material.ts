import { Color } from "./color";
import { Texture } from "./texture";
import { TextureManager } from "./textureManager";

export class Material {
    private _name: string;
    private _diffuseTextureName: string;

    private _diffuseTexture: Texture | undefined;
    private _tint: Color;

    /**
     * The Material class is resonsible for managing Materials
     *
     * @param name The name of the material
     * @param diffuseTextureName The name of the diffuse texture
     * @param tint The tint of the material
     *
     * @example
     * const material = new Material("myMaterial", "myTexture", new Color(1, 1, 1, 1));
     */
    public constructor(name: string, diffuseTextureName: string, tint: Color) {
        this._name = name;
        this._diffuseTextureName = diffuseTextureName;
        this._tint = tint;

        if (this._diffuseTextureName !== undefined)
            this._diffuseTexture = TextureManager.getTexture(
                this._diffuseTextureName
            );
    }

    public get name(): string {
        return this._name;
    }

    public get diffuseTexture(): Texture | undefined {
        return this._diffuseTexture;
    }

    public get diffuseTextureName(): string {
        return this._diffuseTextureName;
    }

    public set diffuseTextureName(name: string) {
        if (this.diffuseTextureName !== undefined)
            TextureManager.releaseTexture(this.diffuseTextureName);

        this._diffuseTextureName = name;

        if (this._diffuseTextureName !== undefined)
            this._diffuseTexture = TextureManager.getTexture(
                this._diffuseTextureName
            );
    }

    public get tint(): Color {
        return this._tint;
    }

    public destroy(): void {
        TextureManager.releaseTexture(this._diffuseTextureName);
        this._diffuseTexture = undefined;
    }
}
