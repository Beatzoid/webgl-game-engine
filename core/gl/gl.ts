/**
 * The WebGL rendering context
 */
export let gl: WebGL2RenderingContext;

/**
 * Responsible for setting up a WebGL renderer
 */
export class GLUtilities {
    /**
     * Initializes WebGL, optionally using the canvas element id provided
     * @param elementId The Id of the canvas element
     */
    public static initialize(elementId?: string): HTMLCanvasElement {
        let canvas: HTMLCanvasElement;

        if (elementId) {
            canvas = document.getElementById(elementId) as HTMLCanvasElement;
            if (!canvas)
                throw new Error(
                    `Cannot find a canvas element with the id "${elementId}"`
                );
        } else {
            canvas = document.createElement("canvas");
            document.body.appendChild(canvas);
        }

        gl = canvas.getContext("webgl2") as WebGL2RenderingContext;
        if (!gl) throw new Error("Unable to initialize WebGL");

        return canvas;
    }
}
