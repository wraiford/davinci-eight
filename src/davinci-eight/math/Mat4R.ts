import AbstractMatrix from '../math/AbstractMatrix';
import add4x4 from '../math/add4x4';
import inv4x4 from '../math/inv4x4';
import Matrix from '../math/Matrix';
import mul4x4 from '../math/mul4x4';
import Ring from '../math/MutableRingElement';
import SpinorE3 from '../math/SpinorE3';
import VectorE3 from '../math/VectorE3';
import VectorE4 from '../math/VectorE4';

/**
 * @class Mat4R
 * @extends AbstractMatrix
 */
export default class Mat4R extends AbstractMatrix<Mat4R> implements Matrix<Mat4R, VectorE4, VectorE3>, Ring<Mat4R> {

    // The correspondence between the elements property index and the matrix entries is...
    //
    //  0  4  8 12
    //  1  5  9 13
    //  2  6 10 14
    //  3  7 11 15
    /**
     * 4x4 (square) matrix of numbers.
     * Constructs a Mat4R by wrapping a Float32Array.
     * @class Mat4R
     * @constructor
     */
    constructor(elements: Float32Array) {
        super(elements, 4);
    }

    /**
     * <p>
     * Creates a new matrix with all elements zero except those along the main diagonal which have the value unity.
     * </p>
     * @method one
     * @return {Mat4R}
     * @chainable
     * @static
     */
    public static one() {
        return new Mat4R(new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]));
    }

    /**
     * <p>
     * Creates a new matrix with all elements zero.
     * </p>
     * @method zero
     * @return {Mat4R}
     * @chainable
     * @static
     */
    public static zero() {
        return new Mat4R(new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
    }

    /**
     * @method scaling
     * @param scale {VectorE3}
     * @return {Mat4R}
     * @chainable
     * @static
     */
    public static scaling(scale: VectorE3): Mat4R {
        return Mat4R.one().scaling(scale);
    }

    /**
     * @method translation
     * @param vector {VectorE3}
     * @return {Mat4R}
     * @chainable
     * @static
     */
    public static translation(vector: VectorE3): Mat4R {
        return Mat4R.one().translation(vector);
    }

    /**
     * @method rotation
     * @param spinor {SpinorE3}
     * @return {Mat4R}
     * @chainable
     * @static
     */
    public static rotation(spinor: SpinorE3): Mat4R {
        return Mat4R.one().rotation(spinor);
    }

    /**
     * @method add
     * @param rhs {Mat4R}
     * @return {Mat4R}
     * @chainable
     */
    add(rhs: Mat4R): Mat4R {
        return this.add2(this, rhs);
    }

    /**
     * @method add2
     * @param a {Mat4R}
     * @param b {Mat4R}
     * @return {Mat4R}
     * @chainable
     */
    add2(a: Mat4R, b: Mat4R): Mat4R {
        add4x4(a.elements, b.elements, this.elements)
        return this
    }

    /**
     * Returns a copy of this Mat4R instance.
     * @method clone
     * @return {Mat4R}
     * @chainable
     */
    clone(): Mat4R {
        return Mat4R.zero().copy(this);
    }

    /**
     * @method compose
     * @param scale {VectorE3}
     * @param attitude {SpinorE3}
     * @param position {VectorE3}
     * @return {Mat4R}
     * @chainable
     */
    compose(scale: VectorE3, attitude: SpinorE3, position: VectorE3): Mat4R {
        // We 
        // this.one();
        // this.scale(scale);
        this.scaling(scale);
        this.rotate(attitude);
        this.translate(position);
        return this;
    }

    /**
     * @method copy
     * @param m {Mat4R}
     * @return {Mat4R}
     * @chainable
     */
    copy(m: Mat4R): Mat4R {
        this.elements.set(m.elements)
        return this;
    }

    /**
     * Computes the determinant.
     * @method det
     * @return {number}
     */
    det(): number {
        let te = this.elements;

        let n11 = te[0], n12 = te[4], n13 = te[8], n14 = te[12];
        let n21 = te[1], n22 = te[5], n23 = te[9], n24 = te[13];
        let n31 = te[2], n32 = te[6], n33 = te[10], n34 = te[14];
        let n41 = te[3], n42 = te[7], n43 = te[11], n44 = te[15];

        let n1122 = n11 * n22;
        let n1123 = n11 * n23;
        let n1124 = n11 * n24;
        let n1221 = n12 * n21;
        let n1223 = n12 * n23;
        let n1224 = n12 * n24;
        let n1321 = n13 * n21;
        let n1322 = n13 * n22;
        let n1324 = n13 * n24;
        let n1421 = n14 * n21;
        let n1422 = n14 * n22;
        let n1423 = n14 * n23;

        return n41 * ((n1423 - n1324) * n32 + (n1224 - n1422) * n33 + (n1322 - n1223) * n34) +
            n42 * ((n1324 - n1423) * n31 + (n1421 - n1124) * n33 + (n1123 - n1321) * n34) +
            n43 * ((n1422 - n1224) * n31 + (n1124 - n1421) * n32 + (n1221 - n1122) * n34) +
            n44 * ((n1223 - n1322) * n31 + (n1321 - n1123) * n32 + (n1122 - n1221) * n33);
    }

    /**
     * @method inv
     * @return {Mat4R}
     */
    inv(): Mat4R {
        inv4x4(this.elements, this.elements)
        return this
    }

    /**
     * @method invert
     * @param m {Mat4R}
     * @return {Mat4R}
     * @deprecated
     * @private
     */
    invert(m: Mat4R): Mat4R {
        inv4x4(m.elements, this.elements)
        return this
    }

    /**
     * Sets this matrix to the identity element for multiplication, <b>1</b>.
     * @method one
     * @return {Mat4R}
     * @chainable
     */
    one(): Mat4R {
        return this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }

    /**
     * @method scale
     * @param s {number}
     * @return {Mat4R}
     * @chainable
     */
    scale(s: number): Mat4R {
        let te = this.elements;
        te[0] *= s; te[4] *= s; te[8] *= s; te[12] *= s;
        te[1] *= s; te[5] *= s; te[9] *= s; te[13] *= s;
        te[2] *= s; te[6] *= s; te[10] *= s; te[14] *= s;
        te[3] *= s; te[7] *= s; te[11] *= s; te[15] *= s;
        return this;
    }

    /**
     * @method transpose
     * @return {Mat4R}
     * @chainable
     */
    transpose(): Mat4R {
        let te: Float32Array = this.elements;
        var tmp: number;

        tmp = te[1]; te[1] = te[4]; te[4] = tmp;
        tmp = te[2]; te[2] = te[8]; te[8] = tmp;
        tmp = te[6]; te[6] = te[9]; te[9] = tmp;

        tmp = te[3]; te[3] = te[12]; te[12] = tmp;
        tmp = te[7]; te[7] = te[13]; te[13] = tmp;
        tmp = te[11]; te[11] = te[14]; te[14] = tmp;

        return this;
    }

    /**
     * @method frustum
     * @param left {number}
     * @param right {number}
     * @param bottom {number}
     * @param top {number}
     * @param near {number}
     * @param far {number}
     * @return {Mat4R}
     * @chainable
     */
    frustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Mat4R {
        let te = this.elements;
        let x = 2 * near / (right - left);
        let y = 2 * near / (top - bottom);

        let a = (right + left) / (right - left);
        let b = (top + bottom) / (top - bottom);
        let c = - (far + near) / (far - near);
        let d = - 2 * far * near / (far - near);

        te[0] = x; te[4] = 0; te[8] = a; te[12] = 0;
        te[1] = 0; te[5] = y; te[9] = b; te[13] = 0;
        te[2] = 0; te[6] = 0; te[10] = c; te[14] = d;
        te[3] = 0; te[7] = 0; te[11] = -1; te[15] = 0;

        return this;
    }

    /**
     * @method rotationAxis
     * @param axis {VectorE3}
     * @param angle {number}
     * @return {Mat4R}
     * @chainable
     * @beta
     */
    rotationAxis(axis: VectorE3, angle: number): Mat4R {

        // Based on http://www.gamedev.net/reference/articles/article1199.asp

        let c = Math.cos(angle);
        let s = Math.sin(angle);
        let t = 1 - c;
        let x = axis.x, y = axis.y, z = axis.z;
        let tx = t * x, ty = t * y;

        return this.set(
            tx * x + c, tx * y - s * z, tx * z + s * y, 0,
            tx * y + s * z, ty * y + c, ty * z - s * x, 0,
            tx * z - s * y, ty * z + s * x, t * z * z + c, 0,
            0, 0, 0, 1
        );
    }

    /**
     * @method mul
     * @param rhs {Mat4R}
     * @return {Mat4R}
     * @chainable
     */
    mul(rhs: Mat4R): Mat4R {
        return this.mul2(this, rhs);
    }

    /**
     * @method mul2
     * @param a {Mat4R}
     * @param b {Mat4R}
     * @return {Mat4R}
     * @chainable
     */
    mul2(a: Mat4R, b: Mat4R): Mat4R {
        mul4x4(a.elements, b.elements, this.elements);
        return this;
    }

    /**
     * @method rmul
     * @param lhs {Mat4R}
     * @return {Mat4R}
     * @chainable
     */
    rmul(lhs: Mat4R): Mat4R {
        return this.mul2(lhs, this);
    }

    /**
     * Sets this matrix to the transformation for a
     * reflection in the plane normal to the unit vector <code>n</code>.
     * <p>
     * <code>this ⟼ reflection(n)</code>
     * </p>
     * @method reflection
     * @param n {VectorE3}
     * @return {Mat4R}
     * @chainable
     */
    reflection(n: VectorE3): Mat4R {
        const nx = n.x;
        const ny = n.y;
        const nz = n.z;

        const aa = -2 * nx * ny;
        const cc = -2 * ny * nz;
        const bb = -2 * nz * nx;

        const xx = 1 - 2 * nx * nx;
        const yy = 1 - 2 * ny * ny;
        const zz = 1 - 2 * nz * nz;

        this.set(
            xx, aa, bb, 0,
            aa, yy, cc, 0,
            bb, cc, zz, 0,
            0, 0, 0, 1
        );
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ rotation(spinor) * this</code>
     * </p>
     * @method rotate
     * @param spinor {SpinorE3}
     * @return {Mat4R}
     * @chainable
     */
    rotate(spinor: SpinorE3): Mat4R {
        return this.rmul(Mat4R.rotation(spinor))
    }

    /**
     * <p>
     * <code>this ⟼ rotation(spinor)</code>
     * </p>
     * @method rotation
     * @param attitude  The spinor from which the rotation will be computed.
     * @return {Mat4R}
     * @chainable
     */
    rotation(spinor: SpinorE3): Mat4R {
        // The correspondence between quaternions and spinors is
        // i <=> -e2^e3, j <=> -e3^e1, k <=> -e1^e2.
        const x: number = -spinor.yz;
        const y: number = -spinor.zx;
        const z: number = -spinor.xy;
        const α: number = spinor.α;

        const x2 = x + x;
        const y2 = y + y;
        const z2 = z + z;
        const xx = x * x2;
        const xy = x * y2;
        const xz = x * z2;
        const yy = y * y2;
        const yz = y * z2;
        const zz = z * z2;
        const wx = α * x2;
        const wy = α * y2;
        const wz = α * z2;

        this.set(
            1 - yy - zz, xy - wz, xz + wy, 0,
            xy + wz, 1 - xx - zz, yz - wx, 0,
            xz - wy, yz + wx, 1 - xx - yy, 0,
            0, 0, 0, 1
        );

        return this;
    }

    /**
     * @method row
     * @param i {number} the zero-based index of the row.
     * @return {Array<number>}
     */
    row(i: number): Array<number> {
        let te = this.elements;
        return [te[0 + i], te[4 + i], te[8 + i], te[12 + i]];
    }

    /**
     * @method scaleXYZ
     * @param scale {VectorE3}
     * @return {Mat4R}
     * @chainable
     */
    scaleXYZ(scale: VectorE3): Mat4R {
        // We treat the scale operation as pre-multiplication: 
        // |x 0 0 0|   |m[0] m[4] m[8] m[C]|   |x * m[0] x * m[4] x * m[8] x * m[C]|
        // |0 y 0 0| * |m[1] m[5] m[9] m[D]| = |y * m[1] y * m[5] y * m[9] y * m[D]|
        // |0 0 z 0|   |m[2] m[6] m[A] m[E]|   |z * m[2] z * m[6] z * m[A] z * m[E]|
        // |0 0 0 1|   |m[3] m[7] m[B] m[F]|   |    m[3]     m[7]     m[B]     m[F]|

        // The following would be post-multiplication:
        // |m[0] m[4] m[8] m[C]|   |x 0 0 0|   |x * m[0] y * m[4] z * m[8]     m[C]|
        // |m[1] m[5] m[9] m[D]| * |0 y 0 0| = |x * m[1] y * m[5] z * m[9]     m[D]|
        // |m[2] m[6] m[A] m[E]|   |0 0 z 0|   |x * m[2] y * m[6] z * m[A]     m[E]|
        // |m[3] m[7] m[B] m[F]|   |0 0 0 1|   |x * m[3] y * m[7] z * m[B]     m[F]|
        return this.rmul(Mat4R.scaling(scale))
    }

    /**
     * @method scaling
     * @param scale {VectorE3}
     * @return {Mat4R}
     * @chainable
     */
    scaling(scale: VectorE3): Mat4R {
        return this.set(scale.x, 0, 0, 0, 0, scale.y, 0, 0, 0, 0, scale.z, 0, 0, 0, 0, 1);
    }

    /**
     * @method set
     * @return {Mat4R}
     * @chainable
     * @private
     */
    private set(
        n11: number,
        n12: number,
        n13: number,
        n14: number,
        n21: number,
        n22: number,
        n23: number,
        n24: number,
        n31: number,
        n32: number,
        n33: number,
        n34: number,
        n41: number,
        n42: number,
        n43: number,
        n44: number): Mat4R {

        var te = this.elements;

        te[0x0] = n11; te[0x4] = n12; te[0x8] = n13; te[0xC] = n14;
        te[0x1] = n21; te[0x5] = n22; te[0x9] = n23; te[0xD] = n24;
        te[0x2] = n31; te[0x6] = n32; te[0xA] = n33; te[0xE] = n34;
        te[0x3] = n41; te[0x7] = n42; te[0xB] = n43; te[0xF] = n44;

        return this;
    }

    /**
     * @method toFixed
     * @param [digits] {number}
     * @return {string}
     */
    toFixed(digits?: number): string {
        const text: string[] = [];
        for (let i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function(element: number, index: number) { return element.toFixed(digits) }).join(' '));
        }
        return text.join('\n');
    }

    /**
     * @method toString
     * @return {string}
     */
    toString(): string {
        let text: string[] = [];
        for (var i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function(element: number, index: number) { return element.toString() }).join(' '));
        }
        return text.join('\n');
    }

    /**
     * <p>
     * <code>this ⟼ translation(spinor) * this</code>
     * </p>
     * @method translate
     * @param d {VectorE3}
     * @return {Mat4R}
     * @chainable
     */
    translate(d: VectorE3): Mat4R {
        return this.rmul(Mat4R.translation(d))
    }

    /**
     * @method translation
     * @param d {VectorE3}
     * @return {Mat4R}
     * @chainable
     */
    translation(d: VectorE3): Mat4R {
        let x = d.x
        let y = d.y
        let z = d.z
        return this.set(
            1, 0, 0, x,
            0, 1, 0, y,
            0, 0, 1, z,
            0, 0, 0, 1)
    }

    /**
     * Sets this matrix to the identity element for addition, <b>0</b>.
     * @method zero
     * @return {Mat4R}
     * @chainable
     */
    zero(): Mat4R {
        return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }

    /**
     * @method __mul__
     * @param rhs {Mat4R|number}
     * @return {Mat4R}
     * @chainable
     * @private
     */
    public __mul__(rhs: Mat4R | number): Mat4R {
        if (rhs instanceof Mat4R) {
            return Mat4R.one().mul2(this, rhs)
        }
        else if (typeof rhs === 'number') {
            return this.clone().scale(rhs)
        }
        else {
            return void 0
        }
    }

    /**
     * @method __rmul__
     * @param lhs {Mat4R|number}
     * @return {Mat4R}
     * @chainable
     * @private
     */
    public __rmul__(lhs: Mat4R | number): Mat4R {
        if (lhs instanceof Mat4R) {
            return Mat4R.one().mul2(lhs, this)
        }
        else if (typeof lhs === 'number') {
            return this.clone().scale(lhs)
        }
        else {
            return void 0
        }
    }
}