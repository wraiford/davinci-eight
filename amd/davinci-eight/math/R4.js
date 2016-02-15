var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/VectorN'], function (require, exports, VectorN_1) {
    var R4 = (function (_super) {
        __extends(R4, _super);
        function R4(data, modified) {
            if (data === void 0) { data = [0, 0, 0, 0]; }
            if (modified === void 0) { modified = false; }
            _super.call(this, data, modified, 4);
        }
        Object.defineProperty(R4.prototype, "x", {
            get: function () {
                return this.coords[0];
            },
            set: function (value) {
                this.modified = this.modified || this.x !== value;
                this.coords[0] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(R4.prototype, "y", {
            get: function () {
                return this.coords[1];
            },
            set: function (value) {
                this.modified = this.modified || this.y !== value;
                this.coords[1] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(R4.prototype, "z", {
            get: function () {
                return this.coords[2];
            },
            set: function (value) {
                this.modified = this.modified || this.z !== value;
                this.coords[2] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(R4.prototype, "w", {
            get: function () {
                return this.coords[3];
            },
            set: function (value) {
                this.modified = this.modified || this.w !== value;
                this.coords[3] = value;
            },
            enumerable: true,
            configurable: true
        });
        R4.prototype.setW = function (w) {
            this.w = w;
            return this;
        };
        R4.prototype.add = function (vector, α) {
            if (α === void 0) { α = 1; }
            this.x += vector.x * α;
            this.y += vector.y * α;
            this.z += vector.z * α;
            this.w += vector.w * α;
            return this;
        };
        R4.prototype.add2 = function (a, b) {
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            this.z = a.z + b.z;
            this.w = a.w + b.w;
            return this;
        };
        R4.prototype.applyMatrix = function (m) {
            var x = this.x;
            var y = this.y;
            var z = this.z;
            var w = this.w;
            var e = m.elements;
            this.x = e[0x0] * x + e[0x4] * y + e[0x8] * z + e[0xC] * w;
            this.y = e[0x1] * x + e[0x5] * y + e[0x9] * z + e[0xD] * w;
            this.z = e[0x2] * x + e[0x6] * y + e[0xA] * z + e[0xE] * w;
            this.w = e[0x3] * x + e[0x7] * y + e[0xB] * z + e[0xF] * w;
            return this;
        };
        R4.prototype.clone = function () {
            return new R4([this.x, this.y, this.z, this.w], this.modified);
        };
        R4.prototype.copy = function (v) {
            this.x = v.x;
            this.y = v.y;
            this.z = v.z;
            this.w = v.w;
            return this;
        };
        R4.prototype.divByScalar = function (α) {
            this.x /= α;
            this.y /= α;
            this.z /= α;
            this.w /= α;
            return this;
        };
        R4.prototype.lerp = function (target, α) {
            this.x += (target.x - this.x) * α;
            this.y += (target.y - this.y) * α;
            this.z += (target.z - this.z) * α;
            this.w += (target.w - this.w) * α;
            return this;
        };
        R4.prototype.lerp2 = function (a, b, α) {
            this.sub2(b, a).scale(α).add(a);
            return this;
        };
        R4.prototype.neg = function () {
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
            this.w = -this.w;
            return this;
        };
        R4.prototype.scale = function (α) {
            this.x *= α;
            this.y *= α;
            this.z *= α;
            this.w *= α;
            return this;
        };
        R4.prototype.reflect = function (n) {
            return this;
        };
        R4.prototype.rotate = function (rotor) {
            return this;
        };
        R4.prototype.slerp = function (target, α) {
            return this;
        };
        R4.prototype.sub = function (v, α) {
            this.x -= v.x * α;
            this.y -= v.y * α;
            this.z -= v.z * α;
            this.w -= v.w * α;
            return this;
        };
        R4.prototype.sub2 = function (a, b) {
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            this.z = a.z - b.z;
            this.w = a.w - b.w;
            return this;
        };
        R4.prototype.magnitude = function () {
            throw new Error("TODO: R4.magnitude()");
        };
        R4.prototype.squaredNorm = function () {
            throw new Error("TODO: R4.squaredNorm()");
        };
        R4.prototype.toExponential = function () {
            return "TODO R4.toExponential";
        };
        R4.prototype.toFixed = function (digits) {
            return "TODO R4.toFixed";
        };
        R4.prototype.zero = function () {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.w = 0;
            return this;
        };
        return R4;
    })(VectorN_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = R4;
});
