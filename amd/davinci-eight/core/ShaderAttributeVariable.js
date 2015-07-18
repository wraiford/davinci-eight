define(["require", "exports"], function (require, exports) {
    function computeUsage(attributes, context) {
        return attributes.dynamics() ? context.DYNAMIC_DRAW : context.STATIC_DRAW;
    }
    function existsLocation(location) {
        return location >= 0;
    }
    /**
     * Utility class for managing a shader attribute variable.
     * @class
     */
    var ShaderAttributeVariable = (function () {
        /**
         * Convenience class that assists in the lifecycle management of an atrribute used in a vertex shader.
         * In particular, this class manages buffer allocation, location caching, and data binding.
         * @class ShaderAttributeVariable
         * @constructor
         * @param name {string}
         * @param size {number}
         * @param normalized {boolean} Used for WebGLRenderingContext.vertexAttribPointer().
         * @param stride {number} Used for WebGLRenderingContext.vertexAttribPointer().
         * @param offset {number} Used for WebGLRenderingContext.vertexAttribPointer().
         */
        function ShaderAttributeVariable(name, size, normalized, stride, offset) {
            if (offset === void 0) { offset = 0; }
            this.name = name;
            this.size = size;
            this.normalized = normalized;
            this.stride = stride;
            this.offset = offset;
        }
        ShaderAttributeVariable.prototype.contextFree = function () {
            if (this.buffer) {
                this.context.deleteBuffer(this.buffer);
                this.contextLoss();
            }
        };
        ShaderAttributeVariable.prototype.contextGain = function (context, program) {
            this.location = context.getAttribLocation(program, this.name);
            this.context = context;
            if (existsLocation(this.location)) {
                this.buffer = context.createBuffer();
            }
        };
        ShaderAttributeVariable.prototype.contextLoss = function () {
            this.location = void 0;
            this.buffer = void 0;
            this.context = void 0;
        };
        // Not really bind so much as describing
        ShaderAttributeVariable.prototype.bind = function () {
            if (existsLocation(this.location)) {
                // TODO: We could assert that we have a buffer.
                this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffer);
                // 6.14 Fixed point support.
                // The WebGL API does not support the GL_FIXED data type.
                // Consequently, we hard-code the FLOAT constant.
                this.context.vertexAttribPointer(this.location, this.size, this.context.FLOAT, this.normalized, this.stride, this.offset);
            }
        };
        ShaderAttributeVariable.prototype.bufferData = function (attributes) {
            if (existsLocation(this.location)) {
                var data = attributes.getVertexAttributeData(this.name);
                if (data) {
                    this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffer);
                    this.context.bufferData(this.context.ARRAY_BUFFER, data, computeUsage(attributes, this.context));
                }
                else {
                    // We expect this to be detected long before we get here.
                    throw new Error("Geometry implementation claims to support but does not provide data for attribute " + this.name);
                }
            }
        };
        ShaderAttributeVariable.prototype.enable = function () {
            if (existsLocation(this.location)) {
                this.context.enableVertexAttribArray(this.location);
            }
        };
        ShaderAttributeVariable.prototype.disable = function () {
            if (existsLocation(this.location)) {
                this.context.disableVertexAttribArray(this.location);
            }
        };
        return ShaderAttributeVariable;
    })();
    return ShaderAttributeVariable;
});