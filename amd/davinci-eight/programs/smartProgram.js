define(["require", "exports", '../scene/MonitorList', '../programs/fragmentShader', '../utils/mergeStringMapList', '../checks/mustBeDefined', './createMaterial', '../programs/vColorRequired', '../programs/vertexShader', '../programs/vLightRequired'], function (require, exports, MonitorList, fragmentShader, mergeStringMapList, mustBeDefined, createMaterial, vColorRequired, vertexShader, vLightRequired) {
    /**
     *
     */
    var smartProgram = function (monitors, attributes, uniformsList, bindings) {
        MonitorList.verify('monitors', monitors, function () { return "smartProgram"; });
        mustBeDefined('attributes', attributes);
        mustBeDefined('uniformsList', uniformsList);
        var uniforms = mergeStringMapList(uniformsList);
        var vColor = vColorRequired(attributes, uniforms);
        var vLight = vLightRequired(attributes, uniforms);
        var innerProgram = createMaterial(monitors, vertexShader(attributes, uniforms, vColor, vLight), fragmentShader(attributes, uniforms, vColor, vLight), bindings);
        var self = {
            get programId() {
                return innerProgram.programId;
            },
            attributes: function (canvasId) {
                return innerProgram.attributes(canvasId);
            },
            uniforms: function (canvasId) {
                return innerProgram.uniforms(canvasId);
            },
            get vertexShader() {
                return innerProgram.vertexShader;
            },
            get fragmentShader() {
                return innerProgram.fragmentShader;
            },
            addRef: function () {
                return innerProgram.addRef();
            },
            release: function () {
                return innerProgram.release();
            },
            contextFree: function (canvasId) {
                return innerProgram.contextFree(canvasId);
            },
            contextGain: function (manager) {
                return innerProgram.contextGain(manager);
            },
            contextLost: function (canvasId) {
                return innerProgram.contextLost(canvasId);
            },
            use: function (canvasId) {
                return innerProgram.use(canvasId);
            },
            enableAttrib: function (name, canvasId) {
                return innerProgram.enableAttrib(name, canvasId);
            },
            disableAttrib: function (name, canvasId) {
                return innerProgram.disableAttrib(name, canvasId);
            },
            uniform1f: function (name, x, canvasId) {
                return innerProgram.uniform1f(name, x, canvasId);
            },
            uniform2f: function (name, x, y, canvasId) {
                return innerProgram.uniform2f(name, x, y, canvasId);
            },
            uniform3f: function (name, x, y, z, canvasId) {
                return innerProgram.uniform3f(name, x, y, z, canvasId);
            },
            uniform4f: function (name, x, y, z, w, canvasId) {
                return innerProgram.uniform4f(name, x, y, z, w, canvasId);
            },
            uniformMatrix1: function (name, transpose, matrix, canvasId) {
                return innerProgram.uniformMatrix1(name, transpose, matrix, canvasId);
            },
            uniformMatrix2: function (name, transpose, matrix, canvasId) {
                return innerProgram.uniformMatrix2(name, transpose, matrix, canvasId);
            },
            uniformMatrix3: function (name, transpose, matrix, canvasId) {
                return innerProgram.uniformMatrix3(name, transpose, matrix, canvasId);
            },
            uniformMatrix4: function (name, transpose, matrix, canvasId) {
                return innerProgram.uniformMatrix4(name, transpose, matrix, canvasId);
            },
            uniformCartesian1: function (name, vector, canvasId) {
                return innerProgram.uniformCartesian1(name, vector, canvasId);
            },
            uniformCartesian2: function (name, vector, canvasId) {
                return innerProgram.uniformCartesian2(name, vector, canvasId);
            },
            uniformCartesian3: function (name, vector, canvasId) {
                return innerProgram.uniformCartesian3(name, vector, canvasId);
            },
            uniformCartesian4: function (name, vector, canvasId) {
                return innerProgram.uniformCartesian4(name, vector, canvasId);
            },
            vector1: function (name, data, canvasId) {
                return innerProgram.vector1(name, data, canvasId);
            },
            vector2: function (name, data, canvasId) {
                return innerProgram.vector2(name, data, canvasId);
            },
            vector3: function (name, data, canvasId) {
                return innerProgram.vector3(name, data, canvasId);
            },
            vector4: function (name, data, canvasId) {
                return innerProgram.vector4(name, data, canvasId);
            }
        };
        return self;
    };
    return smartProgram;
});
