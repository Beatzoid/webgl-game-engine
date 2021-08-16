import { Message } from "../message/message";
import { IAsset } from "./IAsset";
import { IAssetLoader } from "./IAssetLoader";
import { ImageAssetLoader } from "./imageAssetLoader";

export const MESSAGE_ASSET_LOADER_ASSET_LOADED =
    "MESSAGE_ASSET_LOADER_ASSET_LOADED::";

export class AssetManager {
    private static _loaders: IAssetLoader[] = [];
    private static _loadedAssets: { [name: string]: IAsset } = {};

    private constructor() {}

    /* Initialize the asset manager */
    public static initialize(): void {
        AssetManager._loaders.push(new ImageAssetLoader());
    }

    /**
     * Register a loader for an asset type
     * @param loader The loader to register
     */
    public static registerLoader(loader: IAssetLoader): void {
        this._loaders.push(loader);
    }

    /**
     * Called when an asset is loaded
     * @param asset The asset that loaded
     */
    public static onAssetLoaded(asset: IAsset): void {
        AssetManager._loadedAssets[asset.name] = asset;
        Message.send(
            MESSAGE_ASSET_LOADER_ASSET_LOADED + asset.name,
            this,
            asset
        );
    }

    /**
     * Load an asset
     * @param name The name of the asset to load
     */
    public static loadAsset(name: string): void {
        const extension = name.split(".").pop()?.toLowerCase();

        for (const loader of AssetManager._loaders) {
            // If this loader supports the extension
            if (
                loader.supportedFileExtensions.indexOf(extension ?? "") !== -1
            ) {
                loader.loadAsset(name);
                return;
            }
        }

        console.warn(
            `Unable to load asset with extension ${extension} because there is no loader associated with it`
        );
    }

    /**
     * Check if an asset is loaded
     * @param name The name of the asset to check
     */
    public static isAssetLoaded(name: string): boolean {
        return AssetManager._loadedAssets[name] !== undefined;
    }

    /**
     * Get an asset
     * @param name The name of the asset to get
     *
     * @returns The asset if it exists, otherwise it tries to load the asset and returns undefined
     */
    public static getAsset(name: string): IAsset | undefined {
        if (AssetManager._loadedAssets[name] !== undefined) {
            return AssetManager._loadedAssets[name];
        } else {
            AssetManager.loadAsset(name);
        }

        return undefined;
    }
}
