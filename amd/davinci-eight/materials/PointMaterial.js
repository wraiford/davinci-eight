var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../materials/GraphicsProgramBuilder', '../core/GraphicsProgramSymbols', '../core/Material'], function (require, exports, GraphicsProgramBuilder_1, GraphicsProgramSymbols_1, Material_1) {
    function builder() {
        var gpb = new GraphicsProgramBuilder_1.default();
        gpb.attribute(GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION, 3);
        gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_COLOR, 'vec3');
        gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_MODEL_MATRIX, 'mat4');
        gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_PROJECTION_MATRIX, 'mat4');
        gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_VIEW_MATRIX, 'mat4');
        gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_POINT_SIZE, 'float');
        return gpb;
    }
    function vertexShader() {
        return builder().vertexShader();
    }
    function fragmentShader() {
        return builder().fragmentShader();
    }
    var PointMaterial = (function (_super) {
        __extends(PointMaterial, _super);
        function PointMaterial() {
            _super.call(this, vertexShader(), fragmentShader());
        }
        return PointMaterial;
    })(Material_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PointMaterial;
});
