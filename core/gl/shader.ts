namespace TSE {
    /**
     * Represents a WebGL Shader
     */
    export class Shader {
        private _name: string;
        private _program: WebGLProgram | undefined;
        private _attributes: { [name: string]: number } = {};
        private _uniforms: { [name: string]: WebGLUniformLocation } = {};

        /**
         * Creates a new shader
         * @param name The name of the shader
         * @param vertexSource The source of the vertex shader
         * @param fragmentSource The source of the fragment shader
         */
        public constructor(
            name: string,
            vertexSource: string,
            fragmentSource: string
        ) {
            this._name = name;
            const vertexShader = this.loadShader(
                vertexSource,
                gl.VERTEX_SHADER
            );
            const fragmentShader = this.loadShader(
                fragmentSource,
                gl.FRAGMENT_SHADER
            );

            this.createProgram(vertexShader, fragmentShader);

            this.detectAtttributes();
            this.detectUniforms();
        }

        /**
         * The name of the shader
         */
        public get name(): string {
            return this._name;
        }

        /**
         * Gets the location of an attribute with the specified name
         * @param name The name of the attribute
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
         * @param name The name of the uniform
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
         */
        public use(): void {
            gl.useProgram(this._program!!);
        }

        private loadShader(source: string, shaderType: number): WebGLShader {
            let shader: WebGLShader = gl.createShader(
                shaderType
            ) as WebGLShader;

            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            const error = gl.getShaderInfoLog(shader);
            if (error)
                throw new Error(
                    `Error compiling shader "${this._name}": ${error}`
                );

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

            const error = gl.getProgramInfoLog(this._program);
            if (error)
                throw new Error(
                    `Error linking shader "${this._name}": ${error}`
                );
        }

        private detectAtttributes(): void {
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
}
