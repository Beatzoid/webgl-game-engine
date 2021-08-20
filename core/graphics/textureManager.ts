import { Texture } from "./texture";

class TextureReferenceNode {
    public texture: Texture;
    public referenceCount = 1;

    public constructor(texture: Texture) {
        this.texture = texture;
    }
}

export class TextureManager {
    private static _textures: {
        [name: string]: TextureReferenceNode | undefined;
    } = {};

    private constructor() {}

    /**
     * Gets a texture, or creates it if it doesn't exist
     *
     * @param textureName The name of the texture to get
     *
     * @example
     * const texture = TextureManager.getTexture("example");
     *
     * @returns The texture
     */
    public static getTexture(textureName: string): Texture {
        let foundTexture = TextureManager._textures[textureName];

        if (!foundTexture) {
            const texture = new Texture(textureName);
            foundTexture = new TextureReferenceNode(texture);
        } else {
            foundTexture.referenceCount++;
        }

        return foundTexture.texture;
    }

    /**
     * Release a texture
     *
     * @param textureName The name of the texture to release
     *
     * @example
     * TextureManager.releaseTexture("example");
     */
    public static releaseTexture(textureName: string) {
        let texture = TextureManager._textures[textureName];

        if (!texture) {
            console.warn(
                `A texture named ${textureName} does not exist and therefore cannot be released`
            );
        } else {
            texture.referenceCount--;
            if (texture.referenceCount < 1) {
                texture.texture.destroy();
                texture = undefined;

                delete TextureManager._textures[textureName];
            }
        }
    }
}
