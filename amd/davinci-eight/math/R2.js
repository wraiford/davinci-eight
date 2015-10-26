var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/VectorN'], function (require, exports, VectorN) {
    /**
     * @class R2
     */
    var R2 = (function (_super) {
        __extends(R2, _super);
        /**
         * @class R2
         * @constructor
         * @param data {number[]} Default is [0, 0].
         * @param modified {boolean} Default is false.
         */
        function R2(data, modified) {
            if (data === void 0) { data = [0, 0]; }
            if (modified === void 0) { modified = false; }
            _super.call(this, data, modified, 2);
        }
        Object.defineProperty(R2.prototype, "x", {
            /**
             * @property x
             * @type Number
             */
            get: function () {
                return this.data[0];
            },
            set: function (value) {
                this.modified = this.modified || this.x !== value;
                this.data[0] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(R2.prototype, "y", {
            /**
             * @property y
             * @type Number
             */
            get: function () {
                return this.data[1];
            },
            set: function (value) {
                this.modified = this.modified || this.y !== value;
                this.data[1] = value;
            },
            enumerable: true,
            configurable: true
        });
        R2.prototype.set = function (x, y) {
            this.x = x;
            this.y = y;
            return this;
        };
        R2.prototype.setX = function (x) {
            this.x = x;
            return this;
        };
        R2.prototype.setY = function (y) {
            this.y = y;
            return this;
        };
        R2.prototype.copy = function (v) {
            this.x = v.x;
            this.y = v.y;
            return this;
        };
        R2.prototype.add = function (v, alpha) {
            if (alpha === void 0) { alpha = 1; }
            this.x += v.x * alpha;
            this.y += v.y * alpha;
            return this;
        };
        R2.prototype.add2 = function (a, b) {
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            return this;
        };
        R2.prototype.sub = function (v) {
            this.x -= v.x;
            this.y -= v.y;
            return this;
        };
        R2.prototype.subScalar = function (s) {
            this.x -= s;
            this.y -= s;
            return this;
        };
        R2.prototype.sub2 = function (a, b) {
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            return this;
        };
        R2.prototype.scale = function (s) {
            this.x *= s;
            this.y *= s;
            return this;
        };
        R2.prototype.divByScalar = function (scalar) {
            if (scalar !== 0) {
                var invScalar = 1 / scalar;
                this.x *= invScalar;
                this.y *= invScalar;
            }
            else {
                this.x = 0;
                this.y = 0;
            }
            return this;
        };
        R2.prototype.min = function (v) {
            if (this.x > v.x) {
                this.x = v.x;
            }
            if (this.y > v.y) {
                this.y = v.y;
            }
            return this;
        };
        R2.prototype.max = function (v) {
            if (this.x < v.x) {
                this.x = v.x;
            }
            if (this.y < v.y) {
                this.y = v.y;
            }
            return this;
        };
        R2.prototype.floor = function () {
            this.x = Math.floor(this.x);
            this.y = Math.floor(this.y);
            return this;
        };
        R2.prototype.ceil = function () {
            this.x = Math.ceil(this.x);
            this.y = Math.ceil(this.y);
            return this;
        };
        R2.prototype.round = function () {
            this.x = Math.round(this.x);
            this.y = Math.round(this.y);
            return this;
        };
        R2.prototype.roundToZero = function () {
            this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
            this.y = (this.y < 0) ? Math.ceil(this.y) : Math.floor(this.y);
            return this;
        };
        /**
         * @method neg
         * @return {R2} <code>this</code>
         * @chainable
         */
        R2.prototype.neg = function () {
            this.x = -this.x;
            this.y = -this.y;
            return this;
        };
        R2.prototype.distanceTo = function (position) {
            return Math.sqrt(this.quadranceTo(position));
        };
        R2.prototype.dot = function (v) {
            return this.x * v.x + this.y * v.y;
        };
        R2.prototype.magnitude = function () {
            return Math.sqrt(this.quaditude());
        };
        R2.prototype.normalize = function () {
            return this.divByScalar(this.magnitude());
        };
        R2.prototype.quaditude = function () {
            return this.x * this.x + this.y * this.y;
        };
        R2.prototype.quadranceTo = function (position) {
            var dx = this.x - position.x;
            var dy = this.y - position.y;
            return dx * dx + dy * dy;
        };
        R2.prototype.reflect = function (n) {
            // FIXME: TODO
            return this;
        };
        R2.prototype.rotate = function (rotor) {
            return this;
        };
        R2.prototype.setMagnitude = function (l) {
            var oldLength = this.magnitude();
            if (oldLength !== 0 && l !== oldLength) {
                this.scale(l / oldLength);
            }
            return this;
        };
        /**
         * this ⟼ this + (v - this) * α
         * @method lerp
         * @param v {VectorE2}
         * @param α {number}
         * @return {R2}
         * @chainable
         */
        R2.prototype.lerp = function (v, α) {
            this.x += (v.x - this.x) * α;
            this.y += (v.y - this.y) * α;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a + α * (b - a)</code>
         * </p>
         * @method lerp2
         * @param a {VectorE2}
         * @param b {VectorE2}
         * @param α {number}
         * @return {R2} <code>this</code>
         * @chainable
         */
        R2.prototype.lerp2 = function (a, b, α) {
            this.copy(a).lerp(b, α);
            return this;
        };
        R2.prototype.equals = function (v) {
            return ((v.x === this.x) && (v.y === this.y));
        };
        R2.prototype.slerp = function (v, α) {
            return this;
        };
        R2.prototype.toExponential = function () {
            return "TODO: R2.toExponential";
        };
        R2.prototype.toFixed = function (digits) {
            return "TODO: R2.toString";
        };
        R2.prototype.fromArray = function (array, offset) {
            if (offset === void 0) { offset = 0; }
            this.x = array[offset];
            this.y = array[offset + 1];
            return this;
        };
        R2.prototype.fromAttribute = function (attribute, index, offset) {
            if (offset === void 0) { offset = 0; }
            index = index * attribute.itemSize + offset;
            this.x = attribute.array[index];
            this.y = attribute.array[index + 1];
            return this;
        };
        R2.prototype.clone = function () {
            return new R2([this.x, this.y]);
        };
        return R2;
    })(VectorN);
    return R2;
});