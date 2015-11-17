var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../checks/mustBeString', '../math/G3', '../math/R3', '../math/SpinG3', '../i18n/readOnly', '../utils/Shareable'], function (require, exports, mustBeString, G3, R3, SpinG3, readOnly, Shareable) {
    /**
     * @class ModelE3
     */
    var ModelE3 = (function (_super) {
        __extends(ModelE3, _super);
        /**
         * <p>
         * A collection of properties for Rigid Body Modeling.
         * </p>
         * <p>
         * ModelE3 implements IFacet required for manipulating a drawable object.
         * </p>
         * <p>
         * Constructs a ModelE3 at the origin and with unity attitude.
         * </p>
         * @class ModelE3
         * @constructor
         * @param type [string = 'ModelE3'] The name used for reference counting.
         */
        function ModelE3(type) {
            if (type === void 0) { type = 'ModelE3'; }
            _super.call(this, mustBeString('type', type));
            /**
             * @property _position
             * @type {G3}
             * @private
             */
            this._position = new G3().zero();
            /**
             * @property _attitude
             * @type {G3}
             * @private
             */
            this._attitude = new G3().zero().addScalar(1);
            /**
             * Used for exchanging number[] data to achieve integrity and avoid lots of temporaries.
             * @property _posCache
             * @type {R3}
             * @private
             */
            this._posCache = new R3();
            /**
             * Used for exchanging number[] data to achieve integrity and avoid lots of temporaries.
             * @property _attCache
             * @type {SpinG3}
             * @private
             */
            this._attCache = new SpinG3();
            this._position.modified = true;
            this._attitude.modified = true;
        }
        /**
         * @method destructor
         * @return {void}
         * @protected
         */
        ModelE3.prototype.destructor = function () {
            this._position = void 0;
            this._attitude = void 0;
            _super.prototype.destructor.call(this);
        };
        Object.defineProperty(ModelE3.prototype, "R", {
            /**
             * <p>
             * The <em>attitude</em>, a unitary spinor.
             * </p>
             * @property R
             * @type G3
             * @readOnly
             */
            get: function () {
                return this._attitude;
            },
            set: function (unused) {
                throw new Error(readOnly(ModelE3.PROP_ATTITUDE).message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModelE3.prototype, "X", {
            /**
             * <p>
             * The <em>position</em>, a vector.
             * The vector <b>X</b> designates the center of mass of the body (Physics).
             * The vector <b>X</b> designates the displacement from the local origin (Computer Graphics).
             * </p>
             *
             * @property X
             * @type G3
             * @readOnly
             */
            get: function () {
                return this._position;
            },
            set: function (unused) {
                throw new Error(readOnly(ModelE3.PROP_POSITION).message);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method getProperty
         * @param name {string}
         * @return {number[]}
         */
        ModelE3.prototype.getProperty = function (name) {
            switch (name) {
                case ModelE3.PROP_ATTITUDE: {
                    return this._attCache.copy(this._attitude).coords;
                }
                case ModelE3.PROP_POSITION: {
                    return this._posCache.copy(this._position).coords;
                }
                default: {
                    console.warn("ModelE3.getProperty " + name);
                    return void 0;
                }
            }
        };
        /**
         * @method setProperty
         * @param name {string}
         * @param data {number[]}
         * @return {void}
         */
        ModelE3.prototype.setProperty = function (name, data) {
            switch (name) {
                case ModelE3.PROP_ATTITUDE:
                    {
                        this._attCache.coords = data;
                        this._attitude.copySpinor(this._attCache);
                    }
                    break;
                case ModelE3.PROP_POSITION:
                    {
                        this._posCache.coords = data;
                        this._position.copyVector(this._posCache);
                    }
                    break;
                default: {
                    console.warn("ModelE3.setProperty " + name);
                }
            }
        };
        /**
         * The name of the property that designates the attitude.
         * @property PROP_ATTITUDE
         * @type {string}
         * @default 'R'
         * @static
         * @readOnly
         */
        ModelE3.PROP_ATTITUDE = 'R';
        /**
         * The name of the property that designates the position.
         * @property PROP_POSITION
         * @type {string}
         * @default 'X'
         * @static
         * @readOnly
         */
        ModelE3.PROP_POSITION = 'X';
        return ModelE3;
    })(Shareable);
    return ModelE3;
});