import Cartesian3 = require('../math/Cartesian3');
import VectorN = require('../math/VectorN');
import GeometricElement = require('../math/GeometricElement');
import Mutable = require('../math/Mutable');
import Spinor3Coords = require('../math/Spinor3Coords');
/**
 * @class Spinor3
 */
declare class Spinor3 extends VectorN<number> implements Spinor3Coords, Mutable<number[]>, GeometricElement<Spinor3Coords, Spinor3, Spinor3Coords, Cartesian3> {
    constructor(data?: number[], modified?: boolean);
    /**
     * @property yz
     * @type Number
     */
    yz: number;
    /**
     * @property zx
     * @type Number
     */
    zx: number;
    /**
     * @property xy
     * @type Number
     */
    xy: number;
    /**
     * @property w
     * @type Number
     */
    w: number;
    add(rhs: Spinor3Coords): Spinor3;
    clone(): Spinor3;
    conjugate(): Spinor3;
    copy(spinor: Spinor3Coords): Spinor3;
    difference(a: Spinor3Coords, b: Spinor3Coords): Spinor3;
    divideScalar(scalar: number): Spinor3;
    exp(): Spinor3;
    inverse(): Spinor3;
    lerp(target: Spinor3Coords, alpha: number): Spinor3;
    log(): Spinor3;
    magnitude(): number;
    multiply(rhs: Spinor3Coords): Spinor3;
    scale(scalar: number): Spinor3;
    product(a: Spinor3Coords, b: Spinor3Coords): Spinor3;
    quaditude(): number;
    reverse(): Spinor3;
    /**
     * Sets this Spinor to the value of its reflection in the plane orthogonal to n.
     * The geometric formula for bivector reflection is B' = n * B * n.
     * @method reflect
     * @param n {Cartesian3}
     * @return {Spinor3}
     */
    reflect(n: Cartesian3): Spinor3;
    rotate(rotor: Spinor3Coords): Spinor3;
    sub(rhs: Spinor3Coords): Spinor3;
    sum(a: Spinor3Coords, b: Spinor3Coords): Spinor3;
    spinor(a: Cartesian3, b: Cartesian3): Spinor3;
    /**
     * @method toString
     * @return {string} A non-normative string representation of the target.
     */
    toString(): string;
    static copy(spinor: Spinor3Coords): Spinor3;
    static lerp(a: Spinor3Coords, b: Spinor3Coords, alpha: number): Spinor3;
}
export = Spinor3;
