import Slide = require('davinci-eight/slideshow/Slide');
import Director = require('davinci-eight/slideshow/Director');
import DirectorKeyboardHandler = require('davinci-eight/slideshow/DirectorKeyboardHandler');
import WaitAnimation = require('davinci-eight/slideshow/animations/WaitAnimation');
import ColorAnimation = require('davinci-eight/slideshow/animations/ColorAnimation');
import Vector3Animation = require('davinci-eight/slideshow/animations/Vector3Animation');
import Spinor3Animation = require('davinci-eight/slideshow/animations/Spinor3Animation');
import AnimateDrawableCommand = require('davinci-eight/slideshow/commands/AnimateDrawableCommand');
import CreateCuboidDrawable = require('davinci-eight/slideshow/commands/CreateCuboidDrawable');
import DestroyDrawableCommand = require('davinci-eight/slideshow/commands/DestroyDrawableCommand');
import GeometryCommand = require('davinci-eight/slideshow/commands/TestCommand');
import UseDrawableInSceneCommand = require('davinci-eight/slideshow/commands/UseDrawableInSceneCommand');
import Frustum = require('davinci-eight/cameras/Frustum');
import Perspective = require('davinci-eight/cameras/Perspective');
import View = require('davinci-eight/cameras/View');
import WebGLBlendFunc = require('davinci-eight/commands/WebGLBlendFunc');
import WebGLClearColor = require('davinci-eight/commands/WebGLClearColor');
import WebGLDisable = require('davinci-eight/commands/WebGLDisable');
import WebGLEnable = require('davinci-eight/commands/WebGLEnable');
import AttribLocation = require('davinci-eight/core/AttribLocation');
import AttribMetaInfo = require('davinci-eight/core/AttribMetaInfo');
import Color = require('davinci-eight/core/Color');
import DrawMode = require('davinci-eight/core/DrawMode');
import ContextKahuna = require('davinci-eight/core/ContextKahuna');
import IContextMonitor = require('davinci-eight/core/IContextMonitor');
import Symbolic = require('davinci-eight/core/Symbolic');
import UniformLocation = require('davinci-eight/core/UniformLocation');
import UniformMetaInfo = require('davinci-eight/core/UniformMetaInfo');
import Curve = require('davinci-eight/curves/Curve');
import Keyboard = require('davinci-eight/devices/Keyboard');
import DrawAttribute = require('davinci-eight/geometries/DrawAttribute');
import DrawPrimitive = require('davinci-eight/geometries/DrawPrimitive');
import Simplex = require('davinci-eight/geometries/Simplex');
import Vertex = require('davinci-eight/geometries/Vertex');
import GeometryMeta = require('davinci-eight/geometries/GeometryMeta');
import Topology = require('davinci-eight/topologies/Topology');
import PointTopology = require('davinci-eight/topologies/PointTopology');
import LineTopology = require('davinci-eight/topologies/LineTopology');
import MeshTopology = require('davinci-eight/topologies/MeshTopology');
import GridTopology = require('davinci-eight/topologies/GridTopology');
import IDrawList = require('davinci-eight/scene/IDrawList');
import Drawable = require('davinci-eight/scene/Drawable');
import PerspectiveCamera = require('davinci-eight/scene/PerspectiveCamera');
import Scene = require('davinci-eight/scene/Scene');
import Canvas3D = require('davinci-eight/scene/Canvas3D');
import AxialSimplexGeometry = require('davinci-eight/geometries/AxialSimplexGeometry');
import ArrowGeometry = require('davinci-eight/geometries/ArrowGeometry');
import ArrowSimplexGeometry = require('davinci-eight/geometries/ArrowSimplexGeometry');
import BarnSimplexGeometry = require('davinci-eight/geometries/BarnSimplexGeometry');
import ConeGeometry = require('davinci-eight/geometries/ConeGeometry');
import ConeSimplexGeometry = require('davinci-eight/geometries/ConeSimplexGeometry');
import CuboidGeometry = require('davinci-eight/geometries/CuboidGeometry');
import CuboidSimplexGeometry = require('davinci-eight/geometries/CuboidSimplexGeometry');
import CylinderGeometry = require('davinci-eight/geometries/CylinderGeometry');
import CylinderSimplexGeometry = require('davinci-eight/geometries/CylinderSimplexGeometry');
import DodecahedronSimplexGeometry = require('davinci-eight/geometries/DodecahedronSimplexGeometry');
import IcosahedronSimplexGeometry = require('davinci-eight/geometries/IcosahedronSimplexGeometry');
import KleinBottleSimplexGeometry = require('davinci-eight/geometries/KleinBottleSimplexGeometry');
import Simplex1Geometry = require('davinci-eight/geometries/Simplex1Geometry');
import MobiusStripSimplexGeometry = require('davinci-eight/geometries/MobiusStripSimplexGeometry');
import OctahedronSimplexGeometry = require('davinci-eight/geometries/OctahedronSimplexGeometry');
import SliceSimplexGeometry = require('davinci-eight/geometries/SliceSimplexGeometry');
import GridSimplexGeometry = require('davinci-eight/geometries/GridSimplexGeometry');
import PolyhedronSimplexGeometry = require('davinci-eight/geometries/PolyhedronSimplexGeometry');
import RevolutionSimplexGeometry = require('davinci-eight/geometries/RevolutionSimplexGeometry');
import RingGeometry = require('davinci-eight/geometries/RingGeometry');
import RingSimplexGeometry = require('davinci-eight/geometries/RingSimplexGeometry');
import SphericalPolarSimplexGeometry = require('davinci-eight/geometries/SphericalPolarSimplexGeometry');
import TetrahedronSimplexGeometry = require('davinci-eight/geometries/TetrahedronSimplexGeometry');
import VortexSimplexGeometry = require('davinci-eight/geometries/VortexSimplexGeometry');
import Material = require('davinci-eight/materials/Material');
import HTMLScriptsMaterial = require('davinci-eight/materials/HTMLScriptsMaterial');
import LineMaterial = require('davinci-eight/materials/LineMaterial');
import MeshMaterial = require('davinci-eight/materials/MeshMaterial');
import MeshLambertMaterial = require('davinci-eight/materials/MeshLambertMaterial');
import PointMaterial = require('davinci-eight/materials/PointMaterial');
import SmartMaterialBuilder = require('davinci-eight/materials/SmartMaterialBuilder');
import RoundUniform = require('davinci-eight/mappers/RoundUniform');
import Cartesian3 = require('davinci-eight/math/Cartesian3');
import Euclidean3 = require('davinci-eight/math/Euclidean3');
import MutableNumber = require('davinci-eight/math/MutableNumber');
import Matrix3 = require('davinci-eight/math/Matrix3');
import Matrix4 = require('davinci-eight/math/Matrix4');
import Spinor3 = require('davinci-eight/math/Spinor3');
import Vector2 = require('davinci-eight/math/Vector2');
import Vector3 = require('davinci-eight/math/Vector3');
import Vector4 = require('davinci-eight/math/Vector4');
import VectorN = require('davinci-eight/math/VectorN');
import EulerFacet = require('davinci-eight/models/EulerFacet');
import ModelFacet = require('davinci-eight/models/ModelFacet');
import IMaterial = require('davinci-eight/core/IMaterial');
import IContextRenderer = require('davinci-eight/renderers/IContextRenderer');
import AmbientLight = require('davinci-eight/uniforms/AmbientLight');
import ColorFacet = require('davinci-eight/uniforms/ColorFacet');
import DirectionalLight = require('davinci-eight/uniforms/DirectionalLight');
import PointSize = require('davinci-eight/uniforms/PointSize');
import Vector3Uniform = require('davinci-eight/uniforms/Vector3Uniform');
import IUnknownArray = require('davinci-eight/collections/IUnknownArray');
import NumberIUnknownMap = require('davinci-eight/collections/NumberIUnknownMap');
import Shareable = require('davinci-eight/utils/Shareable');
import StringIUnknownMap = require('davinci-eight/collections/StringIUnknownMap');
import WindowAnimationRunner = require('davinci-eight/utils/WindowAnimationRunner');
/**
 * @module EIGHT
 */
declare var eight: {
    LAST_MODIFIED: string;
    strict: boolean;
    VERSION: string;
    Slide: typeof Slide;
    Director: typeof Director;
    DirectorKeyboardHandler: typeof DirectorKeyboardHandler;
    ColorAnimation: typeof ColorAnimation;
    WaitAnimation: typeof WaitAnimation;
    Vector3Animation: typeof Vector3Animation;
    Spinor3Animation: typeof Spinor3Animation;
    AnimateDrawableCommand: typeof AnimateDrawableCommand;
    CreateCuboidDrawable: typeof CreateCuboidDrawable;
    DestroyDrawableCommand: typeof DestroyDrawableCommand;
    GeometryCommand: typeof GeometryCommand;
    TestCommand: typeof GeometryCommand;
    UseDrawableInSceneCommand: typeof UseDrawableInSceneCommand;
    Keyboard: typeof Keyboard;
    HTMLScriptsMaterial: typeof HTMLScriptsMaterial;
    Material: typeof Material;
    LineMaterial: typeof LineMaterial;
    MeshMaterial: typeof MeshMaterial;
    MeshLambertMaterial: typeof MeshLambertMaterial;
    PointMaterial: typeof PointMaterial;
    SmartMaterialBuilder: typeof SmartMaterialBuilder;
    WebGLBlendFunc: typeof WebGLBlendFunc;
    WebGLClearColor: typeof WebGLClearColor;
    WebGLDisable: typeof WebGLDisable;
    WebGLEnable: typeof WebGLEnable;
    initWebGL: (canvas: HTMLCanvasElement, attributes?: WebGLContextAttributes) => WebGLRenderingContext;
    createFrustum: (viewMatrixName: string, projectionMatrixName: string) => Frustum;
    createPerspective: (options?: {
        fov?: number;
        aspect?: number;
        near?: number;
        far?: number;
        projectionMatrixName?: string;
        viewMatrixName?: string;
    }) => Perspective;
    createView: (options?: {
        viewMatrixName?: string;
    }) => View;
    EulerFacet: typeof EulerFacet;
    ModelFacet: typeof ModelFacet;
    Simplex: typeof Simplex;
    Vertex: typeof Vertex;
    frustumMatrix: (left: number, right: number, bottom: number, top: number, near: number, far: number, matrix?: Float32Array) => Float32Array;
    perspectiveMatrix: (fov: number, aspect: number, near: number, far: number, matrix?: Matrix4) => Matrix4;
    viewMatrix: (eye: Cartesian3, look: Cartesian3, up: Cartesian3, matrix?: Matrix4) => Matrix4;
    Scene: typeof Scene;
    Drawable: typeof Drawable;
    PerspectiveCamera: typeof PerspectiveCamera;
    Canvas3D: typeof Canvas3D;
    createDrawList: () => IDrawList;
    renderer: () => IContextRenderer;
    webgl: (attributes?: WebGLContextAttributes) => ContextKahuna;
    workbench: (canvas: HTMLCanvasElement, renderer: any, camera: {
        aspect: number;
    }, win?: Window) => {
        setUp: () => void;
        tearDown: () => void;
    };
    animation: (animate: (time: number) => void, options?: {
        setUp?: () => void;
        tearDown?: (animateException: any) => void;
        terminate?: (time: number) => boolean;
        window?: Window;
    }) => WindowAnimationRunner;
    DrawMode: typeof DrawMode;
    AttribLocation: typeof AttribLocation;
    UniformLocation: typeof UniformLocation;
    createMaterial: (monitors: IContextMonitor[], vertexShader: string, fragmentShader: string, attribs: string[]) => IMaterial;
    smartProgram: (monitors: IContextMonitor[], attributes: {
        [name: string]: AttribMetaInfo;
    }, uniformsList: {
        [name: string]: UniformMetaInfo;
    }[], bindings: string[]) => IMaterial;
    Color: typeof Color;
    AxialSimplexGeometry: typeof AxialSimplexGeometry;
    ArrowGeometry: typeof ArrowGeometry;
    ArrowSimplexGeometry: typeof ArrowSimplexGeometry;
    BarnSimplexGeometry: typeof BarnSimplexGeometry;
    ConeGeometry: typeof ConeGeometry;
    ConeSimplexGeometry: typeof ConeSimplexGeometry;
    CuboidGeometry: typeof CuboidGeometry;
    CuboidSimplexGeometry: typeof CuboidSimplexGeometry;
    CylinderGeometry: typeof CylinderGeometry;
    CylinderSimplexGeometry: typeof CylinderSimplexGeometry;
    DodecahedronSimplexGeometry: typeof DodecahedronSimplexGeometry;
    IcosahedronSimplexGeometry: typeof IcosahedronSimplexGeometry;
    KleinBottleSimplexGeometry: typeof KleinBottleSimplexGeometry;
    Simplex1Geometry: typeof Simplex1Geometry;
    MobiusStripSimplexGeometry: typeof MobiusStripSimplexGeometry;
    OctahedronSimplexGeometry: typeof OctahedronSimplexGeometry;
    GridSimplexGeometry: typeof GridSimplexGeometry;
    PolyhedronSimplexGeometry: typeof PolyhedronSimplexGeometry;
    RevolutionSimplexGeometry: typeof RevolutionSimplexGeometry;
    RingGeometry: typeof RingGeometry;
    RingSimplexGeometry: typeof RingSimplexGeometry;
    SliceSimplexGeometry: typeof SliceSimplexGeometry;
    SphericalPolarSimplexGeometry: typeof SphericalPolarSimplexGeometry;
    TetrahedronSimplexGeometry: typeof TetrahedronSimplexGeometry;
    VortexSimplexGeometry: typeof VortexSimplexGeometry;
    Topology: typeof Topology;
    PointTopology: typeof PointTopology;
    LineTopology: typeof LineTopology;
    MeshTopology: typeof MeshTopology;
    GridTopology: typeof GridTopology;
    Euclidean3: typeof Euclidean3;
    Matrix3: typeof Matrix3;
    Matrix4: typeof Matrix4;
    Spinor3: typeof Spinor3;
    MutableNumber: typeof MutableNumber;
    Vector2: typeof Vector2;
    Vector3: typeof Vector3;
    Vector4: typeof Vector4;
    VectorN: typeof VectorN;
    Curve: typeof Curve;
    RoundUniform: typeof RoundUniform;
    simplicesToGeometryMeta: (geometry: Simplex[]) => GeometryMeta;
    computeFaceNormals: (simplex: Simplex, positionName?: string, normalName?: string) => void;
    cube: (size?: number) => Simplex[];
    quadrilateral: (a: VectorN<number>, b: VectorN<number>, c: VectorN<number>, d: VectorN<number>, attributes?: {
        [name: string]: VectorN<number>[];
    }, triangles?: Simplex[]) => Simplex[];
    square: (size?: number) => Simplex[];
    tetrahedron: (a: VectorN<number>, b: VectorN<number>, c: VectorN<number>, d: VectorN<number>, attributes?: {
        [name: string]: VectorN<number>[];
    }, triangles?: Simplex[]) => Simplex[];
    triangle: (a: VectorN<number>, b: VectorN<number>, c: VectorN<number>, attributes?: {
        [name: string]: VectorN<number>[];
    }, triangles?: Simplex[]) => Simplex[];
    simplicesToDrawPrimitive: (simplices: Simplex[], geometryMeta?: GeometryMeta) => DrawPrimitive;
    Symbolic: typeof Symbolic;
    programFromScripts: (monitors: IContextMonitor[], vsId: string, fsId: string, $document: Document, attribs?: string[]) => IMaterial;
    DrawAttribute: typeof DrawAttribute;
    DrawPrimitive: typeof DrawPrimitive;
    AmbientLight: typeof AmbientLight;
    ColorFacet: typeof ColorFacet;
    DirectionalLight: typeof DirectionalLight;
    PointSize: typeof PointSize;
    Vector3Uniform: typeof Vector3Uniform;
    IUnknownArray: typeof IUnknownArray;
    NumberIUnknownMap: typeof NumberIUnknownMap;
    refChange: (uuid: string, name?: string, change?: number) => number;
    Shareable: typeof Shareable;
    StringIUnknownMap: typeof StringIUnknownMap;
};
export = eight;
