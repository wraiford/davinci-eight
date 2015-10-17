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
import GeometryAttribute = require('davinci-eight/geometries/GeometryAttribute');
import GeometryData = require('davinci-eight/geometries/GeometryData');
import Simplex = require('davinci-eight/geometries/Simplex');
import Vertex = require('davinci-eight/geometries/Vertex');
import GeometryMeta = require('davinci-eight/geometries/GeometryMeta');
import IDrawList = require('davinci-eight/scene/IDrawList');
import Drawable = require('davinci-eight/scene/Drawable');
import PerspectiveCamera = require('davinci-eight/scene/PerspectiveCamera');
import Scene = require('davinci-eight/scene/Scene');
import Canvas3D = require('davinci-eight/scene/Canvas3D');
import AxialGeometry = require('davinci-eight/geometries/AxialGeometry');
import GeometryElements = require('davinci-eight/geometries/GeometryElements');
import RingGeometry = require('davinci-eight/geometries/RingGeometry');
import ArrowGeometry = require('davinci-eight/geometries/ArrowGeometry');
import BarnGeometry = require('davinci-eight/geometries/BarnGeometry');
import ConeGeometry = require('davinci-eight/geometries/ConeGeometry');
import CuboidGeometry = require('davinci-eight/geometries/CuboidGeometry');
import CylinderGeometry = require('davinci-eight/geometries/CylinderGeometry');
import DodecahedronGeometry = require('davinci-eight/geometries/DodecahedronGeometry');
import IcosahedronGeometry = require('davinci-eight/geometries/IcosahedronGeometry');
import KleinBottleGeometry = require('davinci-eight/geometries/KleinBottleGeometry');
import Simplex1Geometry = require('davinci-eight/geometries/Simplex1Geometry');
import MobiusStripGeometry = require('davinci-eight/geometries/MobiusStripGeometry');
import OctahedronGeometry = require('davinci-eight/geometries/OctahedronGeometry');
import SliceGeometry = require('davinci-eight/geometries/SliceGeometry');
import SurfaceGeometry = require('davinci-eight/geometries/SurfaceGeometry');
import PolyhedronGeometry = require('davinci-eight/geometries/PolyhedronGeometry');
import RevolutionGeometry = require('davinci-eight/geometries/RevolutionGeometry');
import SphericalPolarGeometry = require('davinci-eight/geometries/SphericalPolarGeometry');
import TetrahedronGeometry = require('davinci-eight/geometries/TetrahedronGeometry');
import VortexGeometry = require('davinci-eight/geometries/VortexGeometry');
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
import ArrowBuilder = require('davinci-eight/mesh/ArrowBuilder');
import CylinderArgs = require('davinci-eight/mesh/CylinderArgs');
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
    CompatcGeometry: typeof GeometryElements;
    RingGeometry: typeof RingGeometry;
    AxialGeometry: typeof AxialGeometry;
    ArrowGeometry: typeof ArrowGeometry;
    BarnGeometry: typeof BarnGeometry;
    ConeGeometry: typeof ConeGeometry;
    CuboidGeometry: typeof CuboidGeometry;
    CylinderGeometry: typeof CylinderGeometry;
    DodecahedronGeometry: typeof DodecahedronGeometry;
    IcosahedronGeometry: typeof IcosahedronGeometry;
    KleinBottleGeometry: typeof KleinBottleGeometry;
    Simplex1Geometry: typeof Simplex1Geometry;
    MobiusStripGeometry: typeof MobiusStripGeometry;
    OctahedronGeometry: typeof OctahedronGeometry;
    SurfaceGeometry: typeof SurfaceGeometry;
    PolyhedronGeometry: typeof PolyhedronGeometry;
    RevolutionGeometry: typeof RevolutionGeometry;
    SliceGeometry: typeof SliceGeometry;
    SphericalPolarGeometry: typeof SphericalPolarGeometry;
    TetrahedronGeometry: typeof TetrahedronGeometry;
    VortexGeometry: typeof VortexGeometry;
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
    ArrowBuilder: typeof ArrowBuilder;
    toGeometryMeta: (geometry: Simplex[]) => GeometryMeta;
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
    toGeometryData: (simplices: Simplex[], geometryMeta?: GeometryMeta) => GeometryData;
    CylinderArgs: typeof CylinderArgs;
    Symbolic: typeof Symbolic;
    programFromScripts: (monitors: IContextMonitor[], vsId: string, fsId: string, $document: Document, attribs?: string[]) => IMaterial;
    GeometryAttribute: typeof GeometryAttribute;
    GeometryElements: typeof GeometryElements;
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
