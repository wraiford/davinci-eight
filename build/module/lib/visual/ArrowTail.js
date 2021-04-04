import { __extends } from "tslib";
import { isDefined } from '../checks/isDefined';
import { mustBeNumber } from '../checks/mustBeNumber';
import { Color } from '../core/Color';
import { Mesh } from '../core/Mesh';
import { referenceAxis } from '../core/referenceAxis';
import { referenceMeridian } from '../core/referenceMeridian';
import { ArrowTailGeometry } from '../geometries/ArrowTailGeometry';
import { SimplexMode } from '../geometries/SimplexMode';
import { normVectorE3 } from '../math/normVectorE3';
import { ds } from './Defaults';
import { materialFromOptions } from './materialFromOptions';
import { offsetFromOptions } from './offsetFromOptions';
import { setAxisAndMeridian } from './setAxisAndMeridian';
import { setColorOption } from './setColorOption';
import { setDeprecatedOptions } from './setDeprecatedOptions';
import { simplexModeFromOptions } from './simplexModeFromOptions';
import { spinorE3Object } from './spinorE3Object';
import { vectorE3Object } from './vectorE3Object';
/**
 * @hidden
 */
var ArrowTail = /** @class */ (function (_super) {
    __extends(ArrowTail, _super);
    /**
     * @param contextManager This will usually be provided by the `Engine`.
     * @param options
     * @param levelUp Leave as zero unless you are extending this class.
     */
    function ArrowTail(contextManager, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, void 0, void 0, contextManager, { axis: referenceAxis(options, ds.axis).direction(), meridian: referenceMeridian(options, ds.meridian).direction() }, levelUp + 1) || this;
        _this.setLoggingName('Arrow');
        var geoOptions = {};
        geoOptions.offset = offsetFromOptions(options);
        geoOptions.tilt = spinorE3Object(options.tilt);
        geoOptions.axis = vectorE3Object(referenceAxis(options, ds.axis).direction());
        geoOptions.meridian = vectorE3Object(referenceMeridian(options, ds.meridian).direction());
        geoOptions.heightShaft = heightShaftFromOptions(options, 0.80);
        geoOptions.radiusShaft = radiusShaftFromOptions(options, 0.01);
        geoOptions.thetaSegments = thetaSegmentsFromOptions(options, 16);
        var geometry = new ArrowTailGeometry(contextManager, geoOptions);
        _this.geometry = geometry;
        geometry.release();
        var material = materialFromOptions(contextManager, simplexModeFromOptions(options, SimplexMode.TRIANGLE), options);
        _this.material = material;
        material.release();
        setAxisAndMeridian(_this, options);
        setColorOption(_this, options, Color.gray);
        setDeprecatedOptions(_this, options);
        if (isDefined(options.length)) {
            _this.length = mustBeNumber('length', options.length);
        }
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     * @hidden
     */
    ArrowTail.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    Object.defineProperty(ArrowTail.prototype, "vector", {
        /**
         * The vector that is represented by the Arrow.
         *
         * magnitude(Arrow.vector) = Arrow.length
         * direction(Arrow.vector) = Arrow.axis
         * Arrow.vector = Arrow.length * Arrow.axis
         */
        get: function () {
            return _super.prototype.getAxis.call(this).scale(this.length);
        },
        set: function (axis) {
            this.length = normVectorE3(axis);
            // Don't try to set the direction for the zero vector.
            if (this.length !== 0) {
                this.setAxis(axis);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ArrowTail.prototype, "length", {
        /**
         * The length of the Arrow.
         * This property determines the scaling of the Arrow in all directions.
         */
        get: function () {
            return this.getScaleX();
        },
        set: function (length) {
            this.setScale(length, length, length);
        },
        enumerable: false,
        configurable: true
    });
    return ArrowTail;
}(Mesh));
export { ArrowTail };
function heightShaftFromOptions(options, defaultValue) {
    if (options) {
        if (typeof options.heightShaft === 'number') {
            return options.heightShaft;
        }
        else {
            return defaultValue;
        }
    }
    else {
        return defaultValue;
    }
}
function radiusShaftFromOptions(options, defaultValue) {
    if (options) {
        if (typeof options.radiusShaft === 'number') {
            return options.radiusShaft;
        }
        else {
            return defaultValue;
        }
    }
    else {
        return defaultValue;
    }
}
function thetaSegmentsFromOptions(options, defaultValue) {
    if (options) {
        if (typeof options.thetaSegments === 'number') {
            return options.thetaSegments;
        }
        else {
            return defaultValue;
        }
    }
    else {
        return defaultValue;
    }
}
