"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("../config");
var getUniformVarName_1 = require("../core/getUniformVarName");
var GraphicsProgramSymbols_1 = require("../core/GraphicsProgramSymbols");
var mustBeBoolean_1 = require("../checks/mustBeBoolean");
var mustBeDefined_1 = require("../checks/mustBeDefined");
var emitFragmentPrecision = false;
function getUniformCodeName(uniforms, name) {
    return getUniformVarName_1.getUniformVarName(uniforms[name], name);
}
var SPACE = ' ';
var UNIFORM = 'uniform' + SPACE;
var SEMICOLON = ';';
/**
 * Generates a fragment shader
 */
function fragmentShaderSrc(attributes, uniforms, vColor, vCoords, vLight) {
    mustBeDefined_1.mustBeDefined('attributes', attributes);
    mustBeDefined_1.mustBeDefined('uniforms', uniforms);
    mustBeBoolean_1.mustBeBoolean(GraphicsProgramSymbols_1.GraphicsProgramSymbols.VARYING_COLOR, vColor);
    mustBeBoolean_1.mustBeBoolean(GraphicsProgramSymbols_1.GraphicsProgramSymbols.VARYING_COORDS, vCoords);
    mustBeBoolean_1.mustBeBoolean(GraphicsProgramSymbols_1.GraphicsProgramSymbols.VARYING_LIGHT, vLight);
    var lines = [];
    lines.push("// fragment shader generated by " + config_1.config.NAMESPACE + " " + config_1.config.VERSION);
    // Only the fragment shader requires an explicit precision for floats.
    // For fragment shaders, highp might not be available, which can be tested using the GL_FRAGMENT_PRECISION_HIGH macro.
    // TODO: Make this an option.
    if (emitFragmentPrecision) {
        lines.push("#ifdef GL_ES");
        lines.push("#  ifdef GL_FRAGMENT_PRECISION_HIGH");
        lines.push("precision highp float;");
        lines.push("#  else");
        lines.push("precision mediump float;");
        lines.push("#  endif");
        lines.push("#endif");
    }
    if (vColor) {
        lines.push("varying highp vec4 " + GraphicsProgramSymbols_1.GraphicsProgramSymbols.VARYING_COLOR + ";");
    }
    if (vCoords) {
        lines.push("varying highp vec2 " + GraphicsProgramSymbols_1.GraphicsProgramSymbols.VARYING_COORDS + ";");
    }
    if (vLight) {
        lines.push("varying highp vec3 " + GraphicsProgramSymbols_1.GraphicsProgramSymbols.VARYING_LIGHT + ";");
    }
    for (var uName in uniforms) {
        if (uniforms.hasOwnProperty(uName)) {
            switch (uniforms[uName].glslType) {
                case 'sampler2D': {
                    lines.push(UNIFORM + uniforms[uName].glslType + SPACE + getUniformCodeName(uniforms, uName) + SEMICOLON);
                    break;
                }
                default: {
                    // Do nothing.
                }
            }
        }
    }
    lines.push("void main(void) {");
    if (vLight) {
        if (vColor) {
            if (vCoords && uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_IMAGE]) {
                lines.push("  gl_FragColor = texture2D(" + GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_IMAGE + ", " + GraphicsProgramSymbols_1.GraphicsProgramSymbols.VARYING_COORDS + ") * vec4(" + GraphicsProgramSymbols_1.GraphicsProgramSymbols.VARYING_COLOR + ".xyz * " + GraphicsProgramSymbols_1.GraphicsProgramSymbols.VARYING_LIGHT + ", " + GraphicsProgramSymbols_1.GraphicsProgramSymbols.VARYING_COLOR + ".a);");
            }
            else {
                lines.push("  gl_FragColor = vec4(" + GraphicsProgramSymbols_1.GraphicsProgramSymbols.VARYING_COLOR + ".xyz * " + GraphicsProgramSymbols_1.GraphicsProgramSymbols.VARYING_LIGHT + ", " + GraphicsProgramSymbols_1.GraphicsProgramSymbols.VARYING_COLOR + ".a);");
            }
        }
        else {
            if (vCoords && uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_IMAGE]) {
                lines.push("  gl_FragColor = texture2D(" + GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_IMAGE + ", " + GraphicsProgramSymbols_1.GraphicsProgramSymbols.VARYING_COORDS + ") * vec4(" + GraphicsProgramSymbols_1.GraphicsProgramSymbols.VARYING_LIGHT + ", 1.0);");
            }
            else {
                lines.push("  gl_FragColor = vec4(" + GraphicsProgramSymbols_1.GraphicsProgramSymbols.VARYING_LIGHT + ", 1.0);");
            }
        }
    }
    else {
        if (vColor) {
            if (vCoords && uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_IMAGE]) {
                lines.push("  gl_FragColor = texture2D(" + GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_IMAGE + ", " + GraphicsProgramSymbols_1.GraphicsProgramSymbols.VARYING_COORDS + ") * " + GraphicsProgramSymbols_1.GraphicsProgramSymbols.VARYING_COLOR + ";");
            }
            else {
                lines.push("  gl_FragColor = " + GraphicsProgramSymbols_1.GraphicsProgramSymbols.VARYING_COLOR + ";");
            }
        }
        else {
            if (vCoords && uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_IMAGE]) {
                lines.push("  gl_FragColor = texture2D(" + GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_IMAGE + ", " + GraphicsProgramSymbols_1.GraphicsProgramSymbols.VARYING_COORDS + ");");
            }
            else {
                lines.push("  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);");
            }
        }
    }
    lines.push("}");
    lines.push("");
    var code = lines.join("\n");
    return code;
}
exports.fragmentShaderSrc = fragmentShaderSrc;