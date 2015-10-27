import DivisionRingOperators = require('../math/DivisionRingOperators');
import QQ = require('../math/QQ');
/**
 * @class Dimensions
 */
declare class Dimensions implements DivisionRingOperators<Dimensions> {
    M: QQ;
    L: QQ;
    T: QQ;
    Q: QQ;
    temperature: QQ;
    amount: QQ;
    intensity: QQ;
    /**
     * @property ONE
     * @type {Dimensions}
     * @static
     */
    static ONE: Dimensions;
    /**
     * @property MASS
     * @type {Dimensions}
     * @static
     */
    static MASS: Dimensions;
    /**
     * @property LENGTH
     * @type {Dimensions}
     * @static
     */
    static LENGTH: Dimensions;
    /**
     * @property TIME
     * @type {Dimensions}
     * @static
     */
    static TIME: Dimensions;
    /**
     * @property CHARGE
     * @type {Dimensions}
     * @static
     */
    static CHARGE: Dimensions;
    /**
     * @property CURRENT
     * @type {Dimensions}
     * @static
     */
    static CURRENT: Dimensions;
    /**
     * @property TEMPERATURE
     * @type {Dimensions}
     * @static
     */
    static TEMPERATURE: Dimensions;
    /**
     * @property AMOUNT
     * @type {Dimensions}
     * @static
     */
    static AMOUNT: Dimensions;
    /**
     * @property INTENSITY
     * @type {Dimensions}
     * @static
     */
    static INTENSITY: Dimensions;
    /**
     * The Dimensions class captures the physical dimensions associated with a unit of measure.
     *
     * @class Dimensions
     * @constructor
     * @param {QQ} M The mass component of the dimensions object.
     * @param {QQ} L The length component of the dimensions object.
     * @param {QQ} T The time component of the dimensions object.
     * @param {QQ} Q The charge component of the dimensions object.
     * @param {QQ} temperature The temperature component of the dimensions object.
     * @param {QQ} amount The amount component of the dimensions object.
     * @param {QQ} intensity The intensity component of the dimensions object.
     */
    constructor(M: QQ, L: QQ, T: QQ, Q: QQ, temperature: QQ, amount: QQ, intensity: QQ);
    /**
     * Returns the dimensions if they are all equal, otherwise throws an <code>Error</code>
     * @method compatible
     * @param rhs {Dimensions}
     * @return {Dimensions} <code>this</code>
     */
    compatible(rhs: Dimensions): Dimensions;
    /**
     * Multiplies dimensions by adding rational exponents.
     * @method mul
     * @param rhs {Dimensions}
     * @return {Dimensions} <code>this * rhs</code>
     */
    mul(rhs: Dimensions): Dimensions;
    /**
     * Divides dimensions by subtracting rational exponents.
     * @method div
     * @param rhs {Dimensions}
     * @return {Dimensions} <code>this / rhs</code>
     */
    div(rhs: Dimensions): Dimensions;
    /**
     * Computes the power function by multiplying rational exponents.
     * @method div
     * @param rhs {Dimensions}
     * @return {Dimensions} <code>pow(this, rhs)</code>
     */
    pow(exponent: QQ): Dimensions;
    /**
     * Computes the square root by dividing each rational component by two.
     * @method sqrt
     * @return {Dimensions}
     */
    sqrt(): Dimensions;
    /**
     * Determines whether all the exponents of this dimensions number are zero.
     *
     * @method isOne
     * @return {boolean} <code>true</code> if all the components are zero, otherwise <code>false</code>.
     */
    isOne(): boolean;
    isZero(): boolean;
    /**
     * Computes the multiplicative inverse of this dimensions number.
     * This is achived by changing the signs of all the exponent quantities.
     * @method inv
     * @return {Dimensions}
     */
    inv(): Dimensions;
    neg(): Dimensions;
    /**
     * Creates a representation of this <code>Dimensions</code> instance.
     * @method toString
     * @return {string}
     */
    toString(): string;
    /**
     * @method __add__
     * @param rhs {any}
     * @return {Dimensions}
     */
    __add__(rhs: any): Dimensions;
    /**
     * @method __radd__
     * @param lhs {any}
     * @return {Dimensions}
     */
    __radd__(lhs: any): Dimensions;
    /**
     * @method __sub__
     * @param rhs {any}
     * @return {Dimensions}
     */
    __sub__(rhs: any): Dimensions;
    /**
     * @method __rsub__
     * @param lhs {any}
     * @return {Dimensions}
     */
    __rsub__(lhs: any): Dimensions;
    /**
     * @method __mul__
     * @param rhs {any}
     * @return {Dimensions}
     */
    __mul__(rhs: any): Dimensions;
    /**
     * @method __rmul__
     * @param lhs {any}
     * @return {Dimensions}
     */
    __rmul__(lhs: any): Dimensions;
    /**
     * @method __div__
     * @param rhs {any}
     * @return {Dimensions}
     */
    __div__(rhs: any): Dimensions;
    /**
     * @method __rdiv__
     * @param lhs {any}
     * @return {Dimensions}
     */
    __rdiv__(lhs: any): Dimensions;
    /**
     * @method __pos__
     * @return {Dimensions}
     */
    __pos__(): Dimensions;
    /**
     * @method __neg__
     * @return {Dimensions}
     */
    __neg__(): Dimensions;
}
export = Dimensions;
