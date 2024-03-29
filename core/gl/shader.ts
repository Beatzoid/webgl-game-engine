import { gl } from "./gl";

/**
 * Represents a WebGL Shader
 */
export abstract class Shader {
    private _name: string;
    private _program: WebGLProgram | undefined;
    private _attributes: { [name: string]: number } = {};
    private _uniforms: { [name: string]: WebGLUniformLocation } = {};

    /**
     * Creates a new shader
     *
     * @param name The name of the shader
     *
     * @example
     *  new Shader("example");
     */
    public constructor(name: string) {
        this._name = name;
    }

    public get name(): string {
        return this._name;
    }

    /**
     * Gets the location of an attribute with the specified name
     *
     * @param name The name of the attribute
     *
     * @example
     * Shader.getAttributeLocation("position");
     *
     * @returns The location of the attribute
     *
     * @throws an error if it can't find the attribute in the shader
     */
    public getAttributeLocation(name: string): number {
        if (this._attributes[name] === undefined)
            throw new Error(
                `Unable to find an attribute named "${name}" in shader "${this._name}"`
            );

        return this._attributes[name];
    }

    /**
     * Gets the location of an uniform with the specified name
     *
     * @param name The name of the uniform
     *
     * @example
     * Shader.getUniformLocation("u_color");
     *
     * @returns The location of the uniform
     *
     * @throws an error if it can't find the uniform in the shader
     */
    public getUniformLocation(name: string): WebGLUniformLocation {
        if (this._uniforms[name] === undefined)
            throw new Error(
                `Unable to find an uniform named "${name}" in shader "${this._name}"`
            );

        return this._uniforms[name];
    }

    /**
     * Use this shader
     *
     * @example
     * Shader.use();
     */
    public use(): void {
        gl.useProgram(this._program!!);
    }

    /**
     * Load the shader
     *
     * @param vertexSource The vertex source for the shader
     * @param fragmentSource The fragment source for the shader
     *
     * @example
     * const shader = new Shader("example");
     * shader.load(vertexSource, fragmentSource);
     */
    protected load(vertexSource: string, fragmentSource: string): void {
        const vertexShader = this.loadShader(vertexSource, gl.VERTEX_SHADER);
        const fragmentShader = this.loadShader(
            fragmentSource,
            gl.FRAGMENT_SHADER
        );

        this.createProgram(vertexShader, fragmentShader);

        this.detectAttributes();
        this.detectUniforms();
    }

    private loadShader(source: string, shaderType: number): WebGLShader {
        const shader: WebGLShader = gl.createShader(shaderType) as WebGLShader;

        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const info = gl.getShaderInfoLog(shader);
            throw new Error(`Error compiling shader '${this._name}' : ${info}`);
        }

        return shader;
    }

    private createProgram(
        vertexShader: WebGLShader,
        fragmentShader: WebGLShader
    ): void {
        this._program = gl.createProgram() as WebGLProgram;

        gl.attachShader(this._program, vertexShader);
        gl.attachShader(this._program, fragmentShader);

        gl.linkProgram(this._program);

        if (!gl.getProgramParameter(this._program, gl.LINK_STATUS)) {
            const info = gl.getProgramInfoLog(this._program);
            throw new Error(
                `Could not compile WebGL program ${this._name} : ${info}`
            );
        }
    }

    private detectAttributes(): void {
        const attributeCount = gl.getProgramParameter(
            this._program!!,
            gl.ACTIVE_ATTRIBUTES
        );
        for (let i = 0; i < attributeCount; i++) {
            const info: WebGLActiveInfo | null = gl.getActiveAttrib(
                this._program!!,
                i
            );
            if (!info) break;

            this._attributes[info.name] = gl.getAttribLocation(
                this._program!!,
                info.name
            );
        }
    }

    private detectUniforms(): void {
        const uniformCount = gl.getProgramParameter(
            this._program!!,
            gl.ACTIVE_UNIFORMS
        );
        for (let i = 0; i < uniformCount; i++) {
            const info: WebGLActiveInfo | null = gl.getActiveUniform(
                this._program!!,
                i
            );
            if (!info) break;

            this._uniforms[info.name] = gl.getUniformLocation(
                this._program!!,
                info.name
            )!!;
        }
    }
}
