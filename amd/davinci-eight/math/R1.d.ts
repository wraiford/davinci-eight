import VectorE1 = require('../math/VectorE1');
import GeometricElement = require('../math/GeometricElement');
import Matrix = require('../math/Matrix');
import SpinorE1 = require('../math/SpinorE1');
import VectorN = require('../math/VectorN');
/**
 * @class R1
 */
declare class R1 extends VectorN<number> implements VectorE1, GeometricElement<VectorE1, R1, SpinorE1, VectorE1, VectorE1>, Matrix<R1> {
    /**
     * @class R1
     * @constructor
     * @param data {number[]} Default is [0].
     * @param modified {boolean} Default is false.
     */
    constructor(data?: number[], modified?: boolean);
    /**
     * @property x
     * @type Number
     */
    x: number;
    set(x: number): R1;
    setX(x: number): R1;
    add(vector: VectorE1, alpha?: number): R1;
    add2(a: VectorE1, b: VectorE1): R1;
    align(v: VectorE1): R1;
    /**
     * @method arg
     * @return {number}
     */
    arg(): number;
    conj(): R1;
    copy(v: VectorE1): R1;
    determinant(): number;
    dual(): R1;
    exp(): R1;
    identity(): R1;
    inv(): R1;
    lco(v: VectorE1): R1;
    log(): R1;
    mul(v: VectorE1): R1;
    norm(): R1;
    div(v: VectorE1): R1;
    divideByScalar(scalar: number): R1;
    min(v: VectorE1): R1;
    max(v: VectorE1): R1;
    floor(): R1;
    ceil(): R1;
    reverse(): R1;
    rco(v: VectorE1): R1;
    round(): R1;
    roundToZero(): R1;
    scale(scalar: number): R1;
    sub(v: VectorE1): R1;
    subScalar(s: number): R1;
    sub2(a: VectorE1, b: VectorE1): R1;
    /**
     * @method neg
     * @return {R1} <code>this</code>
     */
    neg(): R1;
    distanceTo(position: VectorE1): number;
    dot(v: VectorE1): number;
    magnitude(): number;
    normalize(): R1;
    mul2(a: VectorE1, b: VectorE1): R1;
    quaditude(): number;
    quadranceTo(position: VectorE1): number;
    reflect(n: VectorE1): R1;
    rotate(rotor: SpinorE1): R1;
    setMagnitude(l: number): R1;
    /**
     * this ⟼ this + α * (v - this)</code>
     * @method lerp
     * @param v {VectorE1}
     * @param α {number}
     * @return {MutanbleNumber}
     * @chainable
     */
    lerp(v: VectorE1, α: number): R1;
    /**
     * <p>
     * <code>this ⟼ a + α * (b - a)</code>
     * </p>
     * @method lerp2
     * @param a {R1}
     * @param b {R1}
     * @param α {number}
     * @return {R1}
     * @chainable
     */
    lerp2(a: R1, b: R1, α: number): R1;
    equals(v: VectorE1): boolean;
    fromArray(array: number[], offset?: number): R1;
    toArray(array?: number[], offset?: number): number[];
    fromAttribute(attribute: {
        itemSize: number;
        array: number[];
    }, index: number, offset?: number): R1;
    clone(): R1;
    wedge(v: VectorE1): R1;
}
export = R1;
