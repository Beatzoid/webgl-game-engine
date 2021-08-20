import { AssetManager } from "./assetManager";
import { IAsset } from "./IAsset";
import { IAssetLoader } from "./IAssetLoader";

export class ImageAsset implements IAsset {
    public readonly name: string;
    public readonly data: HTMLImageElement;

    public constructor(name: string, data: HTMLImageElement) {
        this.name = name;
        this.data = data;
    }

    public get width(): number {
        return this.data.width;
    }

    public get height(): number {
        return this.data.height;
    }
}

export class ImageAssetLoader implements IAssetLoader {
    public get supportedFileExtensions(): string[] {
        return ["png", "gif", "jpg"];
    }

    public loadAsset(assetName: string): void {
        const image: HTMLImageElement = new Image();
        image.onload = this.onImageLoaded.bind(this, assetName, image);
        image.src = assetName;
    }

    private onImageLoaded(name: string, image: HTMLImageElement) {
        console.log(
            `On image loaded called with name "${name}" and image`,
            image
        );
        const asset = new ImageAsset(name, image);
        AssetManager.onAssetLoaded(asset);
    }
}
