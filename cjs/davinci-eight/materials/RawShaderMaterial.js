/// <reference path="./Material.d.ts" />
/// <reference path="../geometries/Geometry.d.ts" />
var VertexAttribArray = require('../objects/VertexAttribArray');
var parse = require('../glsl/parse');
var RawShaderMaterial = (function () {
    function RawShaderMaterial(attributes, vertexShader, fragmentShader) {
        this.attributes = [];
        this.vertexAttributes = attributes.map(function (attribute) { return new VertexAttribArray(attribute.name, attribute.size); });
        this.vertexShader = vertexShader;
        this.fragmentShader = fragmentShader;
        var vertTree = parse(vertexShader);
        var fragTree = parse(fragmentShader);
        this.attributes = this.vertexAttributes.map(function (vertexAttribute) { return vertexAttribute.name; });
    }
    RawShaderMaterial.prototype.enableVertexAttributes = function (context) {
        this.vertexAttributes.forEach(function (vertexAttribute) {
            vertexAttribute.enable(context);
        });
    };
    RawShaderMaterial.prototype.disableVertexAttributes = function (context) {
        this.vertexAttributes.forEach(function (vertexAttribute) {
            vertexAttribute.disable(context);
        });
    };
    RawShaderMaterial.prototype.bindVertexAttributes = function (context) {
        this.vertexAttributes.forEach(function (vertexAttribute) {
            vertexAttribute.bind(context);
        });
    };
    RawShaderMaterial.prototype.update = function (context, time, geometry) {
        this.vertexAttributes.forEach(function (vertexAttribute) {
            vertexAttribute.bufferData(context, geometry);
        });
    };
    RawShaderMaterial.prototype.contextFree = function (context) {
        if (this.program) {
            context.deleteProgram(this.program);
            this.contextLoss();
        }
        this.vertexAttributes.forEach(function (vertexAttribute) {
            vertexAttribute.contextFree(context);
        });
    };
    RawShaderMaterial.prototype.contextGain = function (context, contextId) {
        if (this.contextGainId !== contextId) {
            this.program = makeProgram(context, this.vertexShader, this.fragmentShader);
            this.programId = uuid4().generate();
            this.contextGainId = contextId;
            var program = this.program;
            this.vertexAttributes.forEach(function (vertexAttribute) {
                vertexAttribute.contextGain(context, program);
            });
        }
    };
    RawShaderMaterial.prototype.contextLoss = function () {
        this.vertexAttributes.forEach(function (vertexAttribute) {
            vertexAttribute.contextLoss();
        });
        this.program = void 0;
        this.programId = void 0;
        this.contextGainId = void 0;
    };
    RawShaderMaterial.prototype.hasContext = function () {
        return !!this.program;
    };
    return RawShaderMaterial;
})();
/**
 * Creates a WebGLProgram with compiled and linked shaders.
 */
function makeProgram(gl, vertexShader, fragmentShader) {
    // TODO: Proper cleanup if we throw an error at any point.
    var vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vertexShader);
    gl.compileShader(vs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(vs));
    }
    var fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fragmentShader);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(fs));
    }
    var program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program));
    }
    return program;
}
function uuid4() {
    var maxFromBits = function (bits) {
        return Math.pow(2, bits);
    };
    var limitUI04 = maxFromBits(4);
    var limitUI06 = maxFromBits(6);
    var limitUI08 = maxFromBits(8);
    var limitUI12 = maxFromBits(12);
    var limitUI14 = maxFromBits(14);
    var limitUI16 = maxFromBits(16);
    var limitUI32 = maxFromBits(32);
    var limitUI40 = maxFromBits(40);
    var limitUI48 = maxFromBits(48);
    var getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    var randomUI06 = function () {
        return getRandomInt(0, limitUI06 - 1);
    };
    var randomUI08 = function () {
        return getRandomInt(0, limitUI08 - 1);
    };
    var randomUI12 = function () {
        return getRandomInt(0, limitUI12 - 1);
    };
    var randomUI16 = function () {
        return getRandomInt(0, limitUI16 - 1);
    };
    var randomUI32 = function () {
        return getRandomInt(0, limitUI32 - 1);
    };
    var randomUI48 = function () {
        return (0 | Math.random() * (1 << 30)) + (0 | Math.random() * (1 << 48 - 30)) * (1 << 30);
    };
    var paddedString = function (str, length, z) {
        str = String(str);
        z = (!z) ? '0' : z;
        var i = length - str.length;
        for (; i > 0; i >>>= 1, z += z) {
            if (i & 1) {
                str = z + str;
            }
        }
        return str;
    };
    var fromParts = function (timeLow, timeMid, timeHiAndVersion, clockSeqHiAndReserved, clockSeqLow, node) {
        var hex = paddedString(timeLow.toString(16), 8) +
            '-' +
            paddedString(timeMid.toString(16), 4) +
            '-' +
            paddedString(timeHiAndVersion.toString(16), 4) +
            '-' +
            paddedString(clockSeqHiAndReserved.toString(16), 2) +
            paddedString(clockSeqLow.toString(16), 2) +
            '-' +
            paddedString(node.toString(16), 12);
        return hex;
    };
    return {
        generate: function () {
            return fromParts(randomUI32(), randomUI16(), 0x4000 | randomUI12(), 0x80 | randomUI06(), randomUI08(), randomUI48());
        },
        // addition by Ka-Jan to test for validity
        // Based on: http://stackoverflow.com/questions/7905929/how-to-test-valid-uuid-guid
        validate: function (uuid) {
            var testPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            return testPattern.test(uuid);
        }
    };
}
module.exports = RawShaderMaterial;