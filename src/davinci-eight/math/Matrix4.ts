import AbstractMatrix = require('../math/AbstractMatrix');
import expectArg = require('../checks/expectArg');
import isDefined = require('../checks/isDefined');
import GeometricElement = require('../math/GeometricElement');
import Matrix = require('../math/Matrix');
import _M4_x_M4_ = require('../math/_M4_x_M4_');

// TODO: Anything after this line hints of excessive coupling.
import Spinor3Coords = require('../math/Spinor3Coords');
import Cartesian3 = require('../math/Cartesian3');
// TODO: Probably better not to couple this way.
import frustumMatrix = require('../cameras/frustumMatrix');
/**
 * 4x4 matrix integrating with WebGL.
 *
 * @class Matrix4
 */
class Matrix4 extends AbstractMatrix implements Matrix<Matrix4> {
// The correspondence between the data property index and the matrix entries is...
//
//  0  4  8 12
//  1  5  9 13
//  2  6 10 14
//  3  7 11 15
  /**
   * Constructs a Matrix4 by wrapping a Float32Array.
   * @constructor
   */
  constructor(data: Float32Array) {
    super(data, 16);
  }
  public static identity() {
    return new Matrix4(new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]));
  }
  public static scaling(scale: Cartesian3): Matrix4 {
    return Matrix4.identity().scaling(scale);
  }
  public static translation(vector: Cartesian3): Matrix4 {
    return Matrix4.identity().translation(vector);
  }
  public static rotation(spinor: Spinor3Coords): Matrix4 {
    return Matrix4.identity().rotation(spinor);
  }
  clone(): Matrix4 {
    return Matrix4.identity().copy(this);
  }
  compose(scale: Cartesian3, attitude: Spinor3Coords, position: Cartesian3): Matrix4 {
    // We 
    // this.identity();
    // this.scale(scale);
    this.scaling(scale);
    this.rotate(attitude);
    this.translate(position);
    return this;
  }
  copy(m: Matrix4) {
    this.data.set(m.data);
    return this;
  }
  determinant(): number {
    let te = this.data;

    let n11 = te[0], n12 = te[4], n13 = te[8], n14 = te[12];
    let n21 = te[1], n22 = te[5], n23 = te[9], n24 = te[13];
    let n31 = te[2], n32 = te[6], n33 = te[10], n34 = te[14];
    let n41 = te[3], n42 = te[7], n43 = te[11], n44 = te[15];

    //( based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm )

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
  invert(m: Matrix4, throwOnSingular: boolean = false): Matrix4 {

    // based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
    var te = this.data;
    var me = m.data;

    var n11 = me[ 0 ], n12 = me[ 4 ], n13 = me[ 8 ], n14 = me[ 12 ];
    var n21 = me[ 1 ], n22 = me[ 5 ], n23 = me[ 9 ], n24 = me[ 13 ];
    var n31 = me[ 2 ], n32 = me[ 6 ], n33 = me[ 10 ], n34 = me[ 14 ];
    var n41 = me[ 3 ], n42 = me[ 7 ], n43 = me[ 11 ], n44 = me[ 15 ];

    te[ 0 ] = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
    te[ 4 ] = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
    te[ 8 ] = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
    te[ 12 ] = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
    te[ 1 ] = n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44;
    te[ 5 ] = n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44;
    te[ 9 ] = n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44;
    te[ 13 ] = n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34;
    te[ 2 ] = n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44;
    te[ 6 ] = n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44;
    te[ 10 ] = n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44;
    te[ 14 ] = n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34;
    te[ 3 ] = n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43;
    te[ 7 ] = n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43;
    te[ 11 ] = n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43;
    te[ 15 ] = n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33;

    let det = n11 * te[ 0 ] + n21 * te[ 4 ] + n31 * te[ 8 ] + n41 * te[ 12 ];

    if (det !== 0) {
      return this.multiplyScalar(1 / det);
    }
    else {
      let msg = "Matrix4.getInverse(): can't invert matrix, determinant is 0";
      if (throwOnSingular) {
        throw new Error( msg );
      }
      else {
        console.warn( msg );
      }
      this.identity();
      return this;
    }
  }
  identity(): Matrix4 {
    return this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }
  multiplyScalar(s: number) {
    let te = this.data;
    te[ 0 ] *= s; te[ 4 ] *= s; te[ 8 ] *= s; te[ 12 ] *= s;
    te[ 1 ] *= s; te[ 5 ] *= s; te[ 9 ] *= s; te[ 13 ] *= s;
    te[ 2 ] *= s; te[ 6 ] *= s; te[ 10 ] *= s; te[ 14 ] *= s;
    te[ 3 ] *= s; te[ 7 ] *= s; te[ 11 ] *= s; te[ 15 ] *= s;
    return this;
  }
  transpose(): Matrix4 {
    let te: Float32Array = this.data;
    var tmp: number;

    tmp = te[ 1 ]; te[ 1 ] = te[ 4 ]; te[ 4 ] = tmp;
    tmp = te[ 2 ]; te[ 2 ] = te[ 8 ]; te[ 8 ] = tmp;
    tmp = te[ 6 ]; te[ 6 ] = te[ 9 ]; te[ 9 ] = tmp;

    tmp = te[ 3 ]; te[ 3 ] = te[ 12 ]; te[ 12 ] = tmp;
    tmp = te[ 7 ]; te[ 7 ] = te[ 13 ]; te[ 13 ] = tmp;
    tmp = te[ 11 ]; te[ 11 ] = te[ 14 ]; te[ 14 ] = tmp;

    return this;
  }
  /**
   *
   */
  frustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4 {
    let te = this.data;
    let x = 2 * near / ( right - left );
    let y = 2 * near / ( top - bottom );

    let a = ( right + left ) / ( right - left );
    let b = ( top + bottom ) / ( top - bottom );
    let c = - ( far + near ) / ( far - near );
    let d = - 2 * far * near / ( far - near );

    te[ 0 ] = x;  te[ 4 ] = 0;  te[ 8 ]  = a;  te[ 12 ] = 0;
    te[ 1 ] = 0;  te[ 5 ] = y;  te[ 9 ]  = b;  te[ 13 ] = 0;
    te[ 2 ] = 0;  te[ 6 ] = 0;  te[ 10 ] = c;  te[ 14 ] = d;
    te[ 3 ] = 0;  te[ 7 ] = 0;  te[ 11 ] = -1;  te[ 15 ] = 0;

    return this;
  }
  rotationAxis(axis: Cartesian3, angle: number) {

    // Based on http://www.gamedev.net/reference/articles/article1199.asp

    let c = Math.cos( angle );
    let s = Math.sin( angle );
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
  multiply(rhs: Matrix4): Matrix4 {
    return this.product(this, rhs);
  }
  product(a: Matrix4, b: Matrix4): Matrix4 {
    _M4_x_M4_(a.data, b.data, this.data);
    return this;
  }
  // TODO: This should not be here.
  rotate(spinor: Spinor3Coords): Matrix4 {
    let S: Matrix4 = Matrix4.rotation(spinor);
    _M4_x_M4_(S.data, this.data, this.data);
    return this;
  }
  /**
   * @method rotate
   * @param attitude  The spinor from which the rotation will be computed.
   */
  rotation(spinor: Spinor3Coords): Matrix4 {
    // The correspondence between quaternions and spinors is
    // i <=> -e2^e3, j <=> -e3^e1, k <=> -e1^e2.
    let x: number = -expectArg('spinor.yz', spinor.yz).toBeNumber().value;
    let y: number = -expectArg('spinor.zx', spinor.zx).toBeNumber().value;
    let z: number = -expectArg('spinor.xy', spinor.xy).toBeNumber().value;
    let w: number =  expectArg('spinor.w',  spinor.w).toBeNumber().value;

    let x2 = x + x, y2 = y + y, z2 = z + z;
    let xx = x * x2, xy = x * y2, xz = x * z2;
    let yy = y * y2, yz = y * z2, zz = z * z2;
    let wx = w * x2, wy = w * y2, wz = w * z2;

    this.set(
      1 - yy - zz, xy - wz,     xz + wy,     0,
      xy + wz,     1 - xx - zz, yz - wx,     0,
      xz - wy,     yz + wx,     1 - xx - yy, 0,
      0,           0,           0,           1
      );

    return this;
  }
  /**
   * @method
   * @param i {number} the zero-based index of the row.
   */
  row(i: number): number[] {
    let te = this.data;
    return [te[0 + i], te[4 + i], te[8 + i], te[12 + i]];
  }
  /**
   *
   */
  scale(scale: Cartesian3): Matrix4 {
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
    let S: Matrix4 = Matrix4.scaling(scale);
    _M4_x_M4_(S.data, this.data, this.data);
    return this;
  }
  scaling(scale: Cartesian3): Matrix4 {
    return this.set(scale.x, 0, 0, 0, 0, scale.y, 0, 0, 0, 0, scale.z, 0, 0, 0, 0, 1);
  }
  set(
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
    n44: number): Matrix4 {

    var te = this.data;

    te[ 0 ] = n11; te[ 4 ] = n12; te[ 8 ] = n13; te[ 12 ] = n14;
    te[ 1 ] = n21; te[ 5 ] = n22; te[ 9 ] = n23; te[ 13 ] = n24;
    te[ 2 ] = n31; te[ 6 ] = n32; te[ 10 ] = n33; te[ 14 ] = n34;
    te[ 3 ] = n41; te[ 7 ] = n42; te[ 11 ] = n43; te[ 15 ] = n44;

    return this;
  }
  toFixed(digits?: number): string {
    if (isDefined(digits)) {expectArg('digits', digits).toBeNumber();}
    let text: string[] = [];
    for (var i = 0; i <= 3;i++) {
      text.push(this.row(i).map(function(element: number, index: number) { return element.toFixed(digits) }).join(' '));
    }
    return text.join('\n');
  }
  toString(): string {
    let text: string[] = [];
    for (var i = 0; i <= 3;i++) {
      text.push(this.row(i).map(function(element: number, index: number) { return element.toString() }).join(' '));
    }
    return text.join('\n');
  }
  translate(displacement: Cartesian3): Matrix4 {
    let T: Matrix4 = Matrix4.translation(displacement);
    _M4_x_M4_(T.data, this.data, this.data);
    return this;
  }
  translation(displacement: Cartesian3): Matrix4 {
    return this.set(1, 0, 0, displacement.x, 0, 1, 0, displacement.y, 0, 0, 1, displacement.z, 0, 0, 0, 1);
  }
  __mul__(other: any): Matrix4 {
    if (other instanceof Matrix4) {
      return Matrix4.identity().product(this, other);
    }
    else if (typeof other === 'number') {
      return this.clone().multiplyScalar(other);
    }
  }
  __rmul__(other: any): Matrix4 {
    if (other instanceof Matrix4) {
      return Matrix4.identity().product(other, this);
    }
    else if (typeof other === 'number') {
      return this.clone().multiplyScalar(other);
    }
  }
}

export = Matrix4;
