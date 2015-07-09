define(["require", "exports", './shaderMaterial'], function (require, exports, material) {
    /**
     *
     */
    var vertexShader = function (attributes, uniforms) {
        var lines = [];
        if (attributes['position']) {
            lines.push("attribute " + attributes['position'].type + " " + attributes['position'].name + ";");
        }
        if (attributes['color']) {
            lines.push("attribute " + attributes['color'].type + " " + attributes['color'].name + ";");
        }
        if (uniforms['normalMatrix'] && attributes['normal']) {
            lines.push("attribute " + attributes['normal'].type + " " + attributes['normal'].name + ";");
        }
        if (uniforms['projectionMatrix']) {
            lines.push("uniform " + uniforms['projectionMatrix'].type + " " + uniforms['projectionMatrix'].name + ";");
        }
        if (uniforms['modelViewMatrix']) {
            lines.push("uniform " + uniforms['modelViewMatrix'].type + " " + uniforms['modelViewMatrix'].name + ";");
        }
        if (uniforms['normalMatrix'] && attributes['normal']) {
            lines.push("uniform " + uniforms['normalMatrix'].type + " " + uniforms['normalMatrix'].name + ";");
        }
        if (attributes['color']) {
            lines.push("varying highp vec4 vColor;");
        }
        if (uniforms['normalMatrix'] && attributes['normal']) {
            lines.push("varying highp vec3 vLight;");
        }
        lines.push("void main(void)");
        lines.push("{");
        if (uniforms['projectionMatrix']) {
            if (uniforms['modelViewMatrix']) {
                lines.push("  gl_Position = " + uniforms['projectionMatrix'].name + " * " + uniforms['modelViewMatrix'].name + " * vec4(" + attributes['position'].name + ", 1.0);");
            }
            else {
                lines.push("  gl_Position = " + uniforms['projectionMatrix'].name + " * vec4(" + attributes['position'].name + ", 1.0);");
            }
        }
        else {
            if (uniforms['modelViewMatrix']) {
                lines.push("  gl_Position = " + uniforms['modelViewMatrix'].name + " * vec4(" + attributes['position'].name + ", 1.0);");
            }
            else {
                lines.push("  gl_Position = vec4(" + attributes['position'].name + ", 1.0);");
            }
        }
        if (attributes['color']) {
            lines.push("  vColor = vec4(" + attributes['color'].name + ", 1.0);");
        }
        if (uniforms['normalMatrix'] && attributes['normal']) {
            lines.push("  vec3 ambientLight = vec3(0.3, 0.3, 0.3);");
            lines.push("  vec3 diffuseLightColor = vec3(0.8, 0.8, 0.8);");
            lines.push("  vec3 L = normalize(vec3(8.0, 10.0, 5.0));");
            lines.push("  vec3 N = normalize(" + uniforms['normalMatrix'].name + " * " + attributes['normal'].name + ");");
            lines.push("  float diffuseLightAmount = max(dot(N, L), 0.0);");
            lines.push("  vLight = ambientLight + (diffuseLightAmount * diffuseLightColor);");
        }
        lines.push("  gl_PointSize = 6.0;");
        lines.push("}");
        var code = lines.join("\n");
        return code;
    };
    /**
     *
     */
    var fragmentShader = function (attributes, uniforms) {
        var lines = [];
        if (attributes['color']) {
            lines.push("varying highp vec4 vColor;");
        }
        if (uniforms['normalMatrix'] && attributes['normal']) {
            lines.push("varying highp vec3 vLight;");
        }
        lines.push("void main(void)");
        lines.push("{");
        if (attributes['color']) {
            if (uniforms['normalMatrix'] && attributes['normal']) {
                lines.push("  gl_FragColor = vec4(vColor.xyz * vLight, vColor.a);");
            }
            else {
                lines.push("  gl_FragColor = vColor;");
            }
        }
        else {
            if (uniforms['normalMatrix'] && attributes['normal']) {
                lines.push("  gl_FragColor = vec4(vLight, 1.0);");
            }
            else {
                lines.push("  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);");
            }
        }
        lines.push("}");
        var code = lines.join("\n");
        return code;
    };
    /**
     *
     */
    var smartMaterial = function (attributes, uniforms) {
        if (attributes) {
        }
        else {
            throw new Error("The attributes parameter is required for smartMaterial.");
        }
        if (uniforms) {
        }
        else {
            throw new Error("The uniforms parameter is required for smartMaterial.");
        }
        var inner = material();
        inner.vertexShader = vertexShader(attributes, uniforms);
        inner.fragmentShader = fragmentShader(attributes, uniforms);
        var publicAPI = {
            get attributes() {
                return inner.attributes;
            },
            get uniforms() {
                return inner.uniforms;
            },
            get varyings() {
                return inner.varyings;
            },
            get program() {
                return inner.program;
            },
            get programId() {
                return inner.programId;
            },
            contextFree: function (context) {
                return inner.contextFree(context);
            },
            contextGain: function (context, contextGainId) {
                return inner.contextGain(context, contextGainId);
            },
            contextLoss: function () {
                return inner.contextLoss();
            },
            hasContext: function () {
                return inner.hasContext();
            }
        };
        return publicAPI;
    };
    return smartMaterial;
});