define(["require", "exports", 'davinci-eight/slideshow/Slide', 'davinci-eight/slideshow/Director', 'davinci-eight/slideshow/DirectorKeyboardHandler', 'davinci-eight/slideshow/animations/WaitAnimation', 'davinci-eight/slideshow/animations/ColorAnimation', 'davinci-eight/slideshow/animations/Vector2Animation', 'davinci-eight/slideshow/animations/Vector3Animation', 'davinci-eight/slideshow/animations/Spinor2Animation', 'davinci-eight/slideshow/animations/Spinor3Animation', 'davinci-eight/commands/BlendFactor', 'davinci-eight/commands/WebGLBlendFunc', 'davinci-eight/commands/WebGLClearColor', 'davinci-eight/commands/Capability', 'davinci-eight/commands/WebGLDisable', 'davinci-eight/commands/WebGLEnable', 'davinci-eight/core/AttribLocation', 'davinci-eight/core/Color', 'davinci-eight/core', 'davinci-eight/core/DrawMode', 'davinci-eight/core/GraphicsProgramSymbols', 'davinci-eight/core/UniformLocation', 'davinci-eight/core/Mesh', 'davinci-eight/core/Scene', 'davinci-eight/core/WebGLRenderer', 'davinci-eight/core/Geometry', 'davinci-eight/core/initWebGL', 'davinci-eight/curves/Curve', 'davinci-eight/devices/Keyboard', 'davinci-eight/geometries/DrawAttribute', 'davinci-eight/geometries/DrawPrimitive', 'davinci-eight/geometries/Simplex', 'davinci-eight/geometries/Vertex', 'davinci-eight/geometries/simplicesToGeometryMeta', 'davinci-eight/geometries/computeFaceNormals', 'davinci-eight/geometries/cube', 'davinci-eight/geometries/quadrilateral', 'davinci-eight/geometries/square', 'davinci-eight/geometries/simplicesToDrawPrimitive', 'davinci-eight/geometries/triangle', 'davinci-eight/topologies/Topology', 'davinci-eight/topologies/PointTopology', 'davinci-eight/topologies/LineTopology', 'davinci-eight/topologies/MeshTopology', 'davinci-eight/topologies/GridTopology', 'davinci-eight/geometries/AxialSimplexPrimitivesBuilder', 'davinci-eight/geometries/ArrowPrimitivesBuilder', 'davinci-eight/geometries/BarnSimplexPrimitivesBuilder', 'davinci-eight/geometries/BoxGeometry', 'davinci-eight/geometries/ConeGeometry', 'davinci-eight/geometries/ConeSimplexGeometry', 'davinci-eight/geometries/CuboidPrimitivesBuilder', 'davinci-eight/geometries/CuboidSimplexPrimitivesBuilder', 'davinci-eight/geometries/CylinderGeometry', 'davinci-eight/geometries/CylinderSimplexGeometry', 'davinci-eight/geometries/DodecahedronSimplexGeometry', 'davinci-eight/geometries/IcosahedronSimplexGeometry', 'davinci-eight/geometries/KleinBottleSimplexGeometry', 'davinci-eight/geometries/Simplex1Geometry', 'davinci-eight/geometries/MobiusStripSimplexGeometry', 'davinci-eight/geometries/OctahedronSimplexGeometry', 'davinci-eight/geometries/SliceSimplexGeometry', 'davinci-eight/geometries/GridSimplexGeometry', 'davinci-eight/geometries/PolyhedronBuilder', 'davinci-eight/geometries/RevolutionSimplexPrimitivesBuilder', 'davinci-eight/geometries/RingBuilder', 'davinci-eight/geometries/RingSimplexGeometry', 'davinci-eight/geometries/SphereGeometry', 'davinci-eight/geometries/TetrahedronGeometry', 'davinci-eight/geometries/VortexSimplexGeometry', 'davinci-eight/materials/HTMLScriptsMaterial', 'davinci-eight/materials/LineMaterial', 'davinci-eight/materials/MeshMaterial', 'davinci-eight/materials/PointMaterial', 'davinci-eight/materials/GraphicsProgramBuilder', 'davinci-eight/materials/smartProgram', 'davinci-eight/materials/programFromScripts', 'davinci-eight/math/Dimensions', 'davinci-eight/math/Euclidean2', 'davinci-eight/math/Euclidean3', 'davinci-eight/math/mathcore', 'davinci-eight/math/R1', 'davinci-eight/math/Mat2R', 'davinci-eight/math/Mat3R', 'davinci-eight/math/Mat4R', 'davinci-eight/math/QQ', 'davinci-eight/math/Unit', 'davinci-eight/math/G2', 'davinci-eight/math/G3', 'davinci-eight/math/SpinG2', 'davinci-eight/math/SpinG3', 'davinci-eight/math/R2', 'davinci-eight/math/R3', 'davinci-eight/math/R4', 'davinci-eight/math/VectorN', 'davinci-eight/facets/AmbientLight', 'davinci-eight/facets/ColorFacet', 'davinci-eight/facets/DirectionalLight', 'davinci-eight/facets/EulerFacet', 'davinci-eight/facets/ModelFacet', 'davinci-eight/facets/PointSizeFacet', 'davinci-eight/facets/ReflectionFacetE2', 'davinci-eight/facets/ReflectionFacetE3', 'davinci-eight/facets/Vector3Facet', 'davinci-eight/facets/createFrustum', 'davinci-eight/facets/createPerspective', 'davinci-eight/facets/createView', 'davinci-eight/facets/frustumMatrix', 'davinci-eight/facets/PerspectiveCamera', 'davinci-eight/facets/perspectiveMatrix', 'davinci-eight/facets/viewMatrix', 'davinci-eight/facets/ModelE2', 'davinci-eight/facets/ModelE3', 'davinci-eight/utils/getCanvasElementById', 'davinci-eight/collections/IUnknownArray', 'davinci-eight/collections/NumberIUnknownMap', 'davinci-eight/core/refChange', 'davinci-eight/core/Shareable', 'davinci-eight/collections/StringIUnknownMap', 'davinci-eight/utils/animation', 'davinci-eight/visual/Arrow', 'davinci-eight/visual/Ball', 'davinci-eight/visual/Box', 'davinci-eight/visual/RigidBody', 'davinci-eight/visual/Rod', 'davinci-eight/visual/Tetrahedron', 'davinci-eight/visual/Trail', 'davinci-eight/visual/vector'], function (require, exports, Slide_1, Director_1, DirectorKeyboardHandler_1, WaitAnimation_1, ColorAnimation_1, Vector2Animation_1, Vector3Animation_1, Spinor2Animation_1, Spinor3Animation_1, BlendFactor_1, WebGLBlendFunc_1, WebGLClearColor_1, Capability_1, WebGLDisable_1, WebGLEnable_1, AttribLocation_1, Color_1, core_1, DrawMode_1, GraphicsProgramSymbols_1, UniformLocation_1, Mesh_1, Scene_1, WebGLRenderer_1, Geometry_1, initWebGL_1, Curve_1, Keyboard_1, DrawAttribute_1, DrawPrimitive_1, Simplex_1, Vertex_1, simplicesToGeometryMeta_1, computeFaceNormals_1, cube_1, quadrilateral_1, square_1, simplicesToDrawPrimitive_1, triangle_1, Topology_1, PointTopology_1, LineTopology_1, MeshTopology_1, GridTopology_1, AxialSimplexPrimitivesBuilder_1, ArrowPrimitivesBuilder_1, BarnSimplexPrimitivesBuilder_1, BoxGeometry_1, ConeGeometry_1, ConeSimplexGeometry_1, CuboidPrimitivesBuilder_1, CuboidSimplexPrimitivesBuilder_1, CylinderGeometry_1, CylinderSimplexGeometry_1, DodecahedronSimplexGeometry_1, IcosahedronSimplexGeometry_1, KleinBottleSimplexGeometry_1, Simplex1Geometry_1, MobiusStripSimplexGeometry_1, OctahedronSimplexGeometry_1, SliceSimplexGeometry_1, GridSimplexGeometry_1, PolyhedronBuilder_1, RevolutionSimplexPrimitivesBuilder_1, RingBuilder_1, RingSimplexGeometry_1, SphereGeometry_1, TetrahedronGeometry_1, VortexSimplexGeometry_1, HTMLScriptsMaterial_1, LineMaterial_1, MeshMaterial_1, PointMaterial_1, GraphicsProgramBuilder_1, smartProgram_1, programFromScripts_1, Dimensions_1, Euclidean2_1, Euclidean3_1, mathcore_1, R1_1, Mat2R_1, Mat3R_1, Mat4R_1, QQ_1, Unit_1, G2_1, G3_1, SpinG2_1, SpinG3_1, R2_1, R3_1, R4_1, VectorN_1, AmbientLight_1, ColorFacet_1, DirectionalLight_1, EulerFacet_1, ModelFacet_1, PointSizeFacet_1, ReflectionFacetE2_1, ReflectionFacetE3_1, Vector3Facet_1, createFrustum_1, createPerspective_1, createView_1, frustumMatrix_1, PerspectiveCamera_1, perspectiveMatrix_1, viewMatrix_1, ModelE2_1, ModelE3_1, getCanvasElementById_1, IUnknownArray_1, NumberIUnknownMap_1, refChange_1, Shareable_1, StringIUnknownMap_1, animation_1, Arrow_1, Ball_1, Box_1, RigidBody_1, Rod_1, Tetrahedron_1, Trail_1, vector_1) {
    var eight = {
        get LAST_MODIFIED() { return core_1.default.LAST_MODIFIED; },
        get fastPath() {
            return core_1.default.fastPath;
        },
        set fastPath(value) {
            core_1.default.fastPath = value;
        },
        get strict() {
            return core_1.default.strict;
        },
        set strict(value) {
            core_1.default.strict = value;
        },
        get verbose() {
            return core_1.default.verbose;
        },
        set verbose(value) {
            if (typeof value === 'boolean') {
                core_1.default.verbose = value;
            }
            else {
                throw new TypeError('verbose must be a boolean');
            }
        },
        get VERSION() { return core_1.default.VERSION; },
        get Slide() { return Slide_1.default; },
        get Director() { return Director_1.default; },
        get DirectorKeyboardHandler() { return DirectorKeyboardHandler_1.default; },
        get ColorAnimation() { return ColorAnimation_1.default; },
        get WaitAnimation() { return WaitAnimation_1.default; },
        get Vector2Animation() { return Vector2Animation_1.default; },
        get Vector3Animation() { return Vector3Animation_1.default; },
        get Spinor2Animation() { return Spinor2Animation_1.default; },
        get Spinor3Animation() { return Spinor3Animation_1.default; },
        get Keyboard() { return Keyboard_1.default; },
        get HTMLScriptsMaterial() { return HTMLScriptsMaterial_1.default; },
        get LineMaterial() { return LineMaterial_1.default; },
        get MeshMaterial() { return MeshMaterial_1.default; },
        get PointMaterial() { return PointMaterial_1.default; },
        get GraphicsProgramBuilder() { return GraphicsProgramBuilder_1.default; },
        get BlendFactor() { return BlendFactor_1.default; },
        get Capability() { return Capability_1.default; },
        get WebGLBlendFunc() { return WebGLBlendFunc_1.default; },
        get WebGLClearColor() { return WebGLClearColor_1.default; },
        get WebGLDisable() { return WebGLDisable_1.default; },
        get WebGLEnable() { return WebGLEnable_1.default; },
        get initWebGL() { return initWebGL_1.default; },
        get createFrustum() { return createFrustum_1.default; },
        get createPerspective() { return createPerspective_1.default; },
        get createView() { return createView_1.default; },
        get ModelE2() { return ModelE2_1.default; },
        get ModelE3() { return ModelE3_1.default; },
        get EulerFacet() { return EulerFacet_1.default; },
        get ModelFacet() { return ModelFacet_1.default; },
        get Simplex() { return Simplex_1.default; },
        get Vertex() { return Vertex_1.default; },
        get frustumMatrix() { return frustumMatrix_1.default; },
        get perspectiveMatrix() { return perspectiveMatrix_1.default; },
        get viewMatrix() { return viewMatrix_1.default; },
        get Scene() { return Scene_1.default; },
        get Mesh() { return Mesh_1.default; },
        get PerspectiveCamera() { return PerspectiveCamera_1.default; },
        get getCanvasElementById() { return getCanvasElementById_1.default; },
        get WebGLRenderer() { return WebGLRenderer_1.default; },
        get animation() { return animation_1.default; },
        get DrawMode() { return DrawMode_1.default; },
        get AttribLocation() { return AttribLocation_1.default; },
        get UniformLocation() { return UniformLocation_1.default; },
        get smartProgram() {
            return smartProgram_1.default;
        },
        get Color() { return Color_1.default; },
        get AxialSimplexPrimitivesBuilder() { return AxialSimplexPrimitivesBuilder_1.default; },
        get ArrowPrimitivesBuilder() { return ArrowPrimitivesBuilder_1.default; },
        get BarnSimplexPrimitivesBuilder() { return BarnSimplexPrimitivesBuilder_1.default; },
        get BoxGeometry() { return BoxGeometry_1.default; },
        get ConeGeometry() { return ConeGeometry_1.default; },
        get ConeSimplexGeometry() { return ConeSimplexGeometry_1.default; },
        get CuboidPrimitivesBuilder() { return CuboidPrimitivesBuilder_1.default; },
        get CuboidSimplexPrimitivesBuilder() { return CuboidSimplexPrimitivesBuilder_1.default; },
        get CylinderGeometry() { return CylinderGeometry_1.default; },
        get CylinderSimplexGeometry() { return CylinderSimplexGeometry_1.default; },
        get DodecahedronSimplexGeometry() { return DodecahedronSimplexGeometry_1.default; },
        get IcosahedronSimplexGeometry() { return IcosahedronSimplexGeometry_1.default; },
        get KleinBottleSimplexGeometry() { return KleinBottleSimplexGeometry_1.default; },
        get Simplex1Geometry() { return Simplex1Geometry_1.default; },
        get MobiusStripSimplexGeometry() { return MobiusStripSimplexGeometry_1.default; },
        get OctahedronSimplexGeometry() { return OctahedronSimplexGeometry_1.default; },
        get GridSimplexGeometry() { return GridSimplexGeometry_1.default; },
        get PolyhedronBuilder() { return PolyhedronBuilder_1.default; },
        get RevolutionSimplexPrimitivesBuilder() { return RevolutionSimplexPrimitivesBuilder_1.default; },
        get RingBuilder() { return RingBuilder_1.default; },
        get RingSimplexGeometry() { return RingSimplexGeometry_1.default; },
        get SliceSimplexGeometry() { return SliceSimplexGeometry_1.default; },
        get SphereGeometry() { return SphereGeometry_1.default; },
        get TetrahedronGeometry() { return TetrahedronGeometry_1.default; },
        get VortexSimplexGeometry() { return VortexSimplexGeometry_1.default; },
        get Topology() { return Topology_1.default; },
        get PointTopology() { return PointTopology_1.default; },
        get LineTopology() { return LineTopology_1.default; },
        get MeshTopology() { return MeshTopology_1.default; },
        get GridTopology() { return GridTopology_1.default; },
        get Dimensions() { return Dimensions_1.default; },
        get Unit() { return Unit_1.default; },
        get Euclidean2() { return Euclidean2_1.default; },
        get Euclidean3() { return Euclidean3_1.default; },
        get Mat2R() { return Mat2R_1.default; },
        get Mat3R() { return Mat3R_1.default; },
        get Mat4R() { return Mat4R_1.default; },
        get QQ() { return QQ_1.default; },
        get G2() { return G2_1.default; },
        get G3() { return G3_1.default; },
        get R1() { return R1_1.default; },
        get SpinG2() { return SpinG2_1.default; },
        get SpinG3() { return SpinG3_1.default; },
        get R2() { return R2_1.default; },
        get R3() { return R3_1.default; },
        get R4() { return R4_1.default; },
        get VectorN() { return VectorN_1.default; },
        get Curve() { return Curve_1.default; },
        get simplicesToGeometryMeta() { return simplicesToGeometryMeta_1.default; },
        get computeFaceNormals() { return computeFaceNormals_1.default; },
        get cube() { return cube_1.default; },
        get quadrilateral() { return quadrilateral_1.default; },
        get square() { return square_1.default; },
        get triangle() { return triangle_1.default; },
        get simplicesToDrawPrimitive() { return simplicesToDrawPrimitive_1.default; },
        get GraphicsProgramSymbols() { return GraphicsProgramSymbols_1.default; },
        get Geometry() { return Geometry_1.default; },
        get programFromScripts() { return programFromScripts_1.default; },
        get DrawAttribute() { return DrawAttribute_1.default; },
        get DrawPrimitive() { return DrawPrimitive_1.default; },
        get AmbientLight() { return AmbientLight_1.default; },
        get ColorFacet() { return ColorFacet_1.default; },
        get DirectionalLight() { return DirectionalLight_1.default; },
        get PointSizeFacet() { return PointSizeFacet_1.default; },
        get ReflectionFacetE2() { return ReflectionFacetE2_1.default; },
        get ReflectionFacetE3() { return ReflectionFacetE3_1.default; },
        get Vector3Facet() { return Vector3Facet_1.default; },
        get IUnknownArray() { return IUnknownArray_1.default; },
        get NumberIUnknownMap() { return NumberIUnknownMap_1.default; },
        get refChange() { return refChange_1.default; },
        get Shareable() { return Shareable_1.default; },
        get StringIUnknownMap() { return StringIUnknownMap_1.default; },
        get cos() { return mathcore_1.default.cos; },
        get cosh() { return mathcore_1.default.cosh; },
        get exp() { return mathcore_1.default.exp; },
        get log() { return mathcore_1.default.log; },
        get norm() { return mathcore_1.default.norm; },
        get quad() { return mathcore_1.default.quad; },
        get sin() { return mathcore_1.default.sin; },
        get sinh() { return mathcore_1.default.sinh; },
        get sqrt() { return mathcore_1.default.sqrt; },
        get Arrow() { return Arrow_1.default; },
        get Ball() { return Ball_1.default; },
        get Box() { return Box_1.default; },
        get RigidBody() { return RigidBody_1.default; },
        get Rod() { return Rod_1.default; },
        get Tetrahedron() { return Tetrahedron_1.default; },
        get Trail() { return Trail_1.default; },
        get vector() { return vector_1.default; }
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = eight;
});
