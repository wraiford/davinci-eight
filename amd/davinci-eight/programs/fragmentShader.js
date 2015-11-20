define(["require", "exports", '../checks/mustBeBoolean', '../checks/mustBeDefined'], function (require, exports, mustBeBoolean, mustBeDefined) {
    /**
     * Generates a fragment shader
     */
    function fragmentShader(attributes, uniforms, vColor, vLight) {
        mustBeDefined('attributes', attributes);
        mustBeDefined('uniforms', uniforms);
        mustBeBoolean('vColor', vColor);
        mustBeBoolean('vLight', vLight);
        var lines = [];
        lines.push("// generated fragment shader");
        // Only the fragment shader requires an explicit precision for floats.
        // For fragment shaders, highp might not be available, which can be tested using the GL_FRAGMENT_PRECISION_HIGH macro.
        lines.push("#ifdef GL_ES");
        lines.push("#  ifdef GL_FRAGMENT_PRECISION_HIGH");
        lines.push("precision highp float;");
        lines.push("#  else");
        lines.push("precision mediump float;");
        lines.push("#  endif");
        lines.push("#endif");
        if (vColor) {
            lines.push("varying highp vec4 vColor;");
        }
        if (vLight) {
            lines.push("varying highp vec3 vLight;");
        }
        lines.push("void main(void) {");
        var glFragColor = [];
        if (vLight) {
            if (vColor) {
                lines.push("  gl_FragColor = vec4(vColor.xyz * vLight, vColor.a);");
            }
            else {
                lines.push("  gl_FragColor = vec4(vLight, 1.0);");
            }
        }
        else {
            if (vColor) {
                lines.push("  gl_FragColor = vColor;");
            }
            else {
                lines.push("  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);");
            }
        }
        lines.push("}");
        var code = lines.join("\n");
        return code;
    }
    return fragmentShader;
});
