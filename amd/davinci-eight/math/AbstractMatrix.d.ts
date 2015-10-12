import Mutable = require('../math/Mutable');
/**
 * @class AbstractMatrix
 */
declare class AbstractMatrix implements Mutable<Float32Array> {
    private _data;
    private _callback;
    private _length;
    private _dimensions;
    modified: boolean;
    /**
     * @class AbstractMatrix
     * @constructor
     * @param data {Float32Array}
     * @param dimensions {number}
     */
    constructor(data: Float32Array, dimensions: number);
    /**
     * @property data
     * @type {Float32Array}
     */
    data: Float32Array;
    /**
     * @property callback
     * @type {() => Float32Array}
     */
    callback: () => Float32Array;
    /**
     * @property dimensions
     * @type {number}
     * @readOnly
     */
    dimensions: number;
}
export = AbstractMatrix;
