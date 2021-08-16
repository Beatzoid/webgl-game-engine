export interface IAssetLoader {
    /* FIle extensions supported by this asset loader */
    readonly supportedFileExtensions: string[];

    /**
     * Load an asset
     * @param assetName The name of the asset to load
     */
    loadAsset(assetName: string): void;
}
