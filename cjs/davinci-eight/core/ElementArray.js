function computeUsage(attributes, context) {
    return attributes.dynamics() ? context.DYNAMIC_DRAW : context.STATIC_DRAW;
}
/**
 * Manages the (optional) WebGLBuffer used to support gl.drawElements().
 * @class ElementArray
 */
var ElementArray = (function () {
    /**
     * @class ElementArray
     * @constructor
     * @param attributes {VertexAttributeProvider}
     */
    function ElementArray(attributes) {
        this.attributes = attributes;
    }
    /**
     * @method contextFree
     */
    ElementArray.prototype.contextFree = function () {
        if (this.buffer) {
            this.context.deleteBuffer(this.buffer);
            this.buffer = void 0;
        }
        this.context = void 0;
    };
    /**
     * @method contextGain
     * @param context {WebGLRenderingContext}
     */
    ElementArray.prototype.contextGain = function (context) {
        if (this.attributes.hasElements()) {
            this.buffer = context.createBuffer();
        }
        this.context = context;
    };
    /**
     * @method contextLoss
     */
    ElementArray.prototype.contextLoss = function () {
        this.buffer = void 0;
        this.context = void 0;
    };
    /**
     * @method bufferData
     * @param attributes {VertexAttributeProvider}
     */
    ElementArray.prototype.bufferData = function (attributes) {
        if (this.buffer) {
            var elements = attributes.getElements();
            this.context.bindBuffer(this.context.ELEMENT_ARRAY_BUFFER, this.buffer);
            var usage = computeUsage(attributes, this.context);
            this.context.bufferData(this.context.ELEMENT_ARRAY_BUFFER, elements, usage);
        }
    };
    /**
     * @method bind
     */
    ElementArray.prototype.bind = function () {
        if (this.buffer) {
            this.context.bindBuffer(this.context.ELEMENT_ARRAY_BUFFER, this.buffer);
        }
    };
    return ElementArray;
})();
module.exports = ElementArray;