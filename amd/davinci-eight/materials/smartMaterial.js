define(["require", "exports", './shaderMaterial'], function (require, exports, material) {
    /**
     *
     */
    var vertexShader = function (names) {
        var lines = [];
        if (names['position']) {
            lines.push("attribute vec3 " + names['position'] + ";");
        }
        if (names['color']) {
            lines.push("attribute vec3 " + names['color'] + ";");
        }
        if (names['normal']) {
            lines.push("attribute vec3 " + names['normal'] + ";");
        }
        lines.push("");
        lines.push("uniform mat4 uProjectionMatrix;");
        lines.push("uniform mat4 uModelViewMatrix;");
        if (names['normal']) {
            lines.push("uniform mat3 uNormalMatrix;");
        }
        lines.push("");
        if (names['color']) {
            lines.push("varying highp vec4 vColor;");
        }
        if (names['normal']) {
            lines.push("varying highp vec3 vLight;");
        }
        lines.push("");
        lines.push("void main(void)");
        lines.push("{");
        lines.push("gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(" + names['position'] + ", 1.0);");
        if (names['color']) {
            lines.push("vColor = vec4(" + names['color'] + ", 1.0);");
        }
        lines.push("");
        if (names['normal']) {
            lines.push("vec3 ambientLight = vec3(0.3, 0.3, 0.3);");
            lines.push("vec3 diffuseLightColor = vec3(0.8, 0.8, 0.8);");
            lines.push("vec3 L = normalize(vec3(8.0, 10.0, 5.0));");
            lines.push("vec3 N = normalize(uNormalMatrix * " + names['normal'] + ");");
            lines.push("float diffuseLightAmount = max(dot(N, L), 0.0);");
            lines.push("vLight = ambientLight + (diffuseLightAmount * diffuseLightColor);");
        }
        lines.push("");
        lines.push("gl_PointSize = 6.0;");
        lines.push("}");
        var code = lines.join("\n");
        // console.log(code);
        return code;
    };
    /**
     *
     */
    var fragmentShader = function (names) {
        var lines = [];
        if (names['color']) {
            lines.push("varying highp vec4 vColor;");
        }
        if (names['normal']) {
            lines.push("varying highp vec3 vLight;");
        }
        lines.push("");
        lines.push("void main(void)");
        lines.push("{");
        if (names['color']) {
            if (names['normal']) {
                lines.push("gl_FragColor = vec4(vColor.xyz * vLight, vColor.a);");
            }
            else {
                lines.push("gl_FragColor = vColor;");
            }
        }
        else {
            if (names['normal']) {
                lines.push("gl_FragColor = vec4(vLight, 1.0);");
            }
            else {
                lines.push("gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);");
            }
        }
        lines.push("}");
        var code = lines.join("\n");
        //console.log(code);
        return code;
    };
    /**
     *
     */
    var smartMaterial = function (geometry) {
        var inner = material();
        var attributes = geometry.getVertexAttributeMetaInfos();
        var names = {};
        attributes.forEach(function (attribute) {
            names[attribute.property] = attribute.name;
        });
        inner.vertexShader = vertexShader(names);
        inner.fragmentShader = fragmentShader(names);
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
