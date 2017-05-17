import { GraphicsProgramSymbols as ProgramSymbols } from '../core/GraphicsProgramSymbols';
import { Matrix4 } from '../math/Matrix4';
import { mustBeGE } from '../checks/mustBeGE';
import { mustBeLE } from '../checks/mustBeLE';
import { mustBeNumber } from '../checks/mustBeNumber';
/**
 *
 */
var PerspectiveTransform = (function () {
    /**
     *
     */
    function PerspectiveTransform(fov, aspect, near, far) {
        if (fov === void 0) { fov = 45 * Math.PI / 180; }
        if (aspect === void 0) { aspect = 1; }
        if (near === void 0) { near = 0.1; }
        if (far === void 0) { far = 1000; }
        /**
         *
         */
        this.matrix = Matrix4.one.clone();
        /**
         *
         */
        this.matrixName = ProgramSymbols.UNIFORM_PROJECTION_MATRIX;
        /**
         *
         */
        this.matrixNeedsUpdate = true;
        // Initialize properties through setters in order to incorporate validation.
        this.fov = fov;
        this.aspect = aspect;
        this.near = near;
        this.far = far;
    }
    Object.defineProperty(PerspectiveTransform.prototype, "aspect", {
        /**
         * The aspect ratio (width / height) of the camera viewport.
         */
        get: function () {
            return this._aspect;
        },
        set: function (aspect) {
            if (this._aspect !== aspect) {
                mustBeNumber('aspect', aspect);
                mustBeGE('aspect', aspect, 0);
                this._aspect = aspect;
                this.matrixNeedsUpdate = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PerspectiveTransform.prototype, "fov", {
        /**
         * The field of view is the (planar) angle (magnitude) in the camera horizontal plane that encloses object that can be seen.
         * Measured in radians.
         */
        get: function () {
            return this._fov;
        },
        set: function (fov) {
            if (this._fov !== fov) {
                mustBeNumber('fov', fov);
                mustBeGE('fov', fov, 0);
                mustBeLE('fov', fov, Math.PI);
                this._fov = fov;
                this.matrixNeedsUpdate = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PerspectiveTransform.prototype, "near", {
        /**
         * The distance to the near plane.
         */
        get: function () {
            return this._near;
        },
        set: function (near) {
            if (this._near !== near) {
                mustBeNumber('near', near);
                mustBeGE('near', near, 0);
                this._near = near;
                this.matrixNeedsUpdate = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PerspectiveTransform.prototype, "far", {
        /**
         * The distance to the far plane.
         */
        get: function () {
            return this._far;
        },
        set: function (far) {
            if (this._far !== far) {
                mustBeNumber('far', far);
                mustBeGE('far', far, 0);
                this._far = far;
                this.matrixNeedsUpdate = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     */
    PerspectiveTransform.prototype.setUniforms = function (visitor) {
        if (this.matrixNeedsUpdate) {
            this.matrix.perspective(this._fov, this._aspect, this._near, this._far);
            this.matrixNeedsUpdate = false;
        }
        visitor.matrix4fv(this.matrixName, this.matrix.elements, false);
    };
    /**
     * Converts from image cube coordinates to camera coordinates.
     * This method performs the inverse of the perspective transformation.
     */
    PerspectiveTransform.prototype.imageToCameraCoords = function (x, y, z) {
        /**
         * Near plane distance.
         */
        var n = this.near;
        /**
         * Far plane distance.
         */
        var f = this.far;
        /**
         * Difference of f and n.
         */
        var d = f - n;
        /**
         * Sum of f and n.
         */
        var s = f + n;
        /**
         * Homogeneous coordinates weight.
         */
        var weight = (s - d * z) / (2 * f * n);
        var t = Math.tan(this.fov / 2);
        var u = this.aspect * t * x / weight;
        var v = t * y / weight;
        var w = -1 / weight;
        return [u, v, w];
    };
    return PerspectiveTransform;
}());
export { PerspectiveTransform };
