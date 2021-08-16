import { gl } from "./gl";

/**
 * Represents the information needed for a GLBuffer attribute.
 */
export class AttributeInfo {
    /**
     *  The location of the attribute.
     */
    public location: number | undefined;

    /**
     * The size (number of elements) in the attribute (i.e Vector3 = 3).
     */
    public size: number | undefined;

    /**
     * The number of elements from the beginning of the Buffer
     */
    public offset: number | undefined;
}

/**
 * Represents a WebGL Buffer
 */
export class GlBuffer {
    private _hasAttributeLocation = false;
    private _elementSize: number;
    private _stride: number;
    private _buffer: WebGLBuffer | null;

    private _targetBufferType: number;
    private _dataType: number;
    private _mode: number;
    private _typeSize: number;

    private _data: number[] = [];
    private _attributes: AttributeInfo[] = [];

    /**
     * Creates a new Gl Buffer
     * @param elementSize The size of each element in the buffer
     * @param dataType The data type of the buffer. Default: `gl.FLOAT`
     * @param targetBufferType The buffer target type. Can be either `gl.ARRAY_BUFFER` or `gl.ELEMENT_ARRAY_BUFFER`. Default: `gl.ARRAY_BUFFER`
     * @param mode The drawing mode of this buffer. (i.e. `gl.TRIANGLES` or `gl.LINES`). Defaukt: `gl.TRIANGLES`
     */
    public constructor(
        elementSize: number,
        dataType: number = gl.FLOAT,
        targetBufferType: number = gl.ARRAY_BUFFER,
        mode: number = gl.TRIANGLES
    ) {
        this._elementSize = elementSize;
        this._dataType = dataType;
        this._targetBufferType = targetBufferType;
        this._mode = mode;

        // Determine byte size
        switch (this._dataType) {
            case gl.FLOAT:
            case gl.INT:
            case gl.UNSIGNED_INT:
                this._typeSize = 4;
                break;

            case gl.SHORT:
            case gl.UNSIGNED_SHORT:
                this._typeSize = 2;
                break;

            case gl.BYTE:
            case gl.UNSIGNED_BYTE:
                this._typeSize = 1;
                break;

            default:
                throw new Error(`Unrecognized data type "${dataType}"`);
        }

        this._stride = this._elementSize * this._typeSize;
        this._buffer = gl.createBuffer();
    }

    /**
     * Destroy the Buffer
     */
    public destroy(): void {
        gl.deleteBuffer(this._buffer);
    }

    /**
     * Bind the Buffer
     * @param noramlized Indicates if the data should be normalized. Default: `false`
     */
    public bind(noramlized = false): void {
        gl.bindBuffer(this._targetBufferType, this._buffer);

        if (this._hasAttributeLocation) {
            for (const it of this._attributes) {
                gl.vertexAttribPointer(
                    it.location!!,
                    it.size!!,
                    this._dataType,
                    noramlized,
                    this._stride,
                    it.offset!! * this._typeSize
                );
                gl.enableVertexAttribArray(it.location!!);
            }
        }
    }

    /**
     * Unbind the Buffer
     */
    public unbind(): void {
        for (const it of this._attributes) {
            gl.disableVertexAttribArray(it.location!!);
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
    }

    /**
     * Adds an attribute with the provided information to the Buffer
     * @param info The information to add
     */
    public addAttributeLocation(info: AttributeInfo): void {
        this._hasAttributeLocation = true;
        this._attributes.push(info);
    }

    /**
     * Add data to the Buffer
     * @param data The data to add
     */
    public pushBackData(data: number[]): void {
        for (const d of data) {
            this._data.push(d);
        }
    }

    /**
     * Upload the Buffer data to the GPU
     */
    public upload(): void {
        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);

        let bufferData: ArrayBuffer;
        switch (this._dataType) {
            case gl.FLOAT:
                bufferData = new Float32Array(this._data);
                break;

            case gl.INT:
                bufferData = new Int32Array(this._data);
                break;

            case gl.UNSIGNED_INT:
                bufferData = new Uint32Array(this._data);
                break;

            case gl.SHORT:
                bufferData = new Int16Array(this._data);
                break;

            case gl.UNSIGNED_SHORT:
                bufferData = new Uint16Array(this._data);
                break;

            case gl.BYTE:
                bufferData = new Int8Array(this._data);
                break;

            case gl.UNSIGNED_BYTE:
                bufferData = new Uint8Array(this._data);
                break;
        }

        gl.bufferData(this._targetBufferType, bufferData!!, gl.STATIC_DRAW);
    }

    /**
     * Draw the Buffer
     */
    public draw(): void {
        if (this._targetBufferType === gl.ARRAY_BUFFER) {
            gl.drawArrays(this._mode, 0, this._data.length / this._elementSize);
        } else if (this._targetBufferType === gl.ELEMENT_ARRAY_BUFFER) {
            gl.drawElements(this._mode, this._data.length, this._dataType, 0);
        }
    }
}
