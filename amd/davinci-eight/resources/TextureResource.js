define(["require", "exports", '../checks/expectArg', '../utils/refChange', '../utils/uuid4'], function (require, exports, expectArg, refChange, uuid4) {
    /**
     * Name used for reference count monitoring and logging.
     */
    var LOGGING_NAME_ITEXTURE = 'ITexture';
    var ms = new Array();
    var os = [];
    // What is the difference?
    var TextureResource = (function () {
        function TextureResource(monitors, target) {
            this._refCount = 1;
            this._uuid = uuid4().generate();
            // FIXME: Supprt multiple canvas.
            var monitor = monitors[0];
            this._monitor = expectArg('montor', monitor).toBeObject().value;
            this._target = target;
            refChange(this._uuid, LOGGING_NAME_ITEXTURE, +1);
            monitor.addContextListener(this);
        }
        TextureResource.prototype.addRef = function () {
            this._refCount++;
            refChange(this._uuid, LOGGING_NAME_ITEXTURE, +1);
            return this._refCount;
        };
        TextureResource.prototype.release = function () {
            this._refCount--;
            refChange(this._uuid, LOGGING_NAME_ITEXTURE, -1);
            if (this._refCount === 0) {
                this._monitor.removeContextListener(this);
                this.contextFree();
            }
            return this._refCount;
        };
        TextureResource.prototype.contextFree = function () {
            // FIXME: I need to know which context.
            if (this._texture) {
                this._gl.deleteTexture(this._texture);
                this._texture = void 0;
            }
            this._gl = void 0;
        };
        TextureResource.prototype.contextGain = function (manager) {
            // FIXME: Support multiple canvas.
            var gl = manager.gl;
            if (this._gl !== gl) {
                this.contextFree();
                this._gl = gl;
                // I must create a texture for each monitor.
                // But I only get gl events one at a time.
                this._texture = gl.createTexture();
            }
        };
        TextureResource.prototype.contextLoss = function () {
            // FIXME: I need to know which context.
            this._texture = void 0;
            this._gl = void 0;
        };
        /**
         * @method bind
         */
        TextureResource.prototype.bind = function () {
            if (this._gl) {
                this._gl.bindTexture(this._target, this._texture);
            }
            else {
                console.warn(LOGGING_NAME_ITEXTURE + " bind() missing WebGL rendering context.");
            }
        };
        /**
         * @method unbind
         */
        TextureResource.prototype.unbind = function () {
            if (this._gl) {
                this._gl.bindTexture(this._target, null);
            }
            else {
                console.warn(LOGGING_NAME_ITEXTURE + " unbind() missing WebGL rendering context.");
            }
        };
        return TextureResource;
    })();
    return TextureResource;
});