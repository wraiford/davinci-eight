define(["require", "exports", '../math/det3x3'], function (require, exports, det3x3_1) {
    function inv3x3(m, te) {
        var det = det3x3_1.default(m);
        var m11 = m[0x0], m12 = m[0x3], m13 = m[0x6];
        var m21 = m[0x1], m22 = m[0x4], m23 = m[0x7];
        var m31 = m[0x2], m32 = m[0x5], m33 = m[0x8];
        var o11 = m22 * m33 - m23 * m32;
        var o12 = m13 * m32 - m12 * m33;
        var o13 = m12 * m23 - m13 * m22;
        var o21 = m23 * m31 - m21 * m33;
        var o22 = m11 * m33 - m13 * m31;
        var o23 = m13 * m21 - m11 * m23;
        var o31 = m21 * m32 - m22 * m31;
        var o32 = m12 * m31 - m11 * m32;
        var o33 = m11 * m22 - m12 * m21;
        var α = 1 / det;
        te[0x0] = o11 * α;
        te[0x3] = o12 * α;
        te[0x6] = o13 * α;
        te[0x1] = o21 * α;
        te[0x4] = o22 * α;
        te[0x7] = o23 * α;
        te[0x2] = o31 * α;
        te[0x5] = o32 * α;
        te[0x8] = o33 * α;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = inv3x3;
});