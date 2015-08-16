/// <reference path="../vendor/davinci-blade/dist/davinci-blade.d.ts" />
import Frustum = require('davinci-eight/cameras/Frustum');
import Perspective = require('davinci-eight/cameras/Perspective');
import View = require('davinci-eight/cameras/View');
import AttribMetaInfos = require('davinci-eight/core/AttribMetaInfos');
import AttribProvider = require('davinci-eight/core/AttribProvider');
import DefaultAttribProvider = require('davinci-eight/core/DefaultAttribProvider');
import Color = require('davinci-eight/core/Color');
import DataUsage = require('davinci-eight/core/DataUsage');
import DrawMode = require('davinci-eight/core/DrawMode');
import Face3 = require('davinci-eight/core/Face3');
import Primitive = require('davinci-eight/core/Primitive');
import UniformMetaInfos = require('davinci-eight/core/UniformMetaInfos');
import UniformProvider = require('davinci-eight/core/UniformProvider');
import DefaultUniformProvider = require('davinci-eight/core/DefaultUniformProvider');
import ShaderAttribLocation = require('davinci-eight/core/ShaderAttribLocation');
import ShaderUniformLocation = require('davinci-eight/core/ShaderUniformLocation');
import DrawList = require('davinci-eight/drawLists/DrawList');
import Geometry = require('davinci-eight/geometries/Geometry');
import GeometryAdapter = require('davinci-eight/geometries/GeometryAdapter');
import ArrowGeometry = require('davinci-eight/geometries/ArrowGeometry');
import BarnGeometry = require('davinci-eight/geometries/BarnGeometry');
import BoxGeometry = require('davinci-eight/geometries/BoxGeometry');
import CylinderGeometry = require('davinci-eight/geometries/CylinderGeometry');
import DodecahedronGeometry = require('davinci-eight/geometries/DodecahedronGeometry');
import IcosahedronGeometry = require('davinci-eight/geometries/IcosahedronGeometry');
import KleinBottleGeometry = require('davinci-eight/geometries/KleinBottleGeometry');
import MobiusStripGeometry = require('davinci-eight/geometries/MobiusStripGeometry');
import OctahedronGeometry = require('davinci-eight/geometries/OctahedronGeometry');
import ParametricSurfaceGeometry = require('davinci-eight/geometries/ParametricSurfaceGeometry');
import PolyhedronGeometry = require('davinci-eight/geometries/PolyhedronGeometry');
import RevolutionGeometry = require('davinci-eight/geometries/RevolutionGeometry');
import SphereGeometry = require('davinci-eight/geometries/SphereGeometry');
import TetrahedronGeometry = require('davinci-eight/geometries/TetrahedronGeometry');
import TubeGeometry = require('davinci-eight/geometries/TubeGeometry');
import VortexGeometry = require('davinci-eight/geometries/VortexGeometry');
import Matrix3 = require('davinci-eight/math/Matrix3');
import Matrix4 = require('davinci-eight/math/Matrix4');
import Quaternion = require('davinci-eight/math/Quaternion');
import Spinor3 = require('davinci-eight/math/Spinor3');
import Vector2 = require('davinci-eight/math/Vector2');
import Vector3 = require('davinci-eight/math/Vector3');
import ArrowBuilder = require('davinci-eight/mesh/ArrowBuilder');
import ArrowOptions = require('davinci-eight/mesh/ArrowOptions');
import BoxBuilder = require('davinci-eight/mesh/BoxBuilder');
import BoxOptions = require('davinci-eight/mesh/BoxOptions');
import CylinderArgs = require('davinci-eight/mesh/CylinderArgs');
import CylinderOptions = require('davinci-eight/mesh/CylinderOptions');
import CylinderMeshBuilder = require('davinci-eight/mesh/CylinderMeshBuilder');
import SphereBuilder = require('davinci-eight/mesh/SphereBuilder');
import SphereOptions = require('davinci-eight/mesh/SphereOptions');
import Blade = require('davinci-eight/objects/Blade');
import Curve = require('davinci-eight/curves/Curve');
import ShaderProgram = require('davinci-eight/core/ShaderProgram');
import Renderer = require('davinci-eight/renderers/Renderer');
import RendererParameters = require('davinci-eight/renderers/RendererParameters');
import AmbientLight = require('davinci-eight/uniforms/AmbientLight');
import ChainedUniformProvider = require('davinci-eight/uniforms/ChainedUniformProvider');
import DirectionalLight = require('davinci-eight/uniforms/DirectionalLight');
import LocalModel = require('davinci-eight/uniforms/LocalModel');
import Node = require('davinci-eight/uniforms/Node');
import TreeModel = require('davinci-eight/uniforms/TreeModel');
import UniversalJoint = require('davinci-eight/uniforms/UniversalJoint');
import MultiUniformProvider = require('davinci-eight/uniforms/MultiUniformProvider');
import PointLight = require('davinci-eight/uniforms/PointLight');
import UniformFloat = require('davinci-eight/uniforms/UniformFloat');
import UniformMat4 = require('davinci-eight/uniforms/UniformMat4');
import UniformVec2 = require('davinci-eight/uniforms/UniformVec2');
import UniformVec3 = require('davinci-eight/uniforms/UniformVec3');
import UniformVec4 = require('davinci-eight/uniforms/UniformVec4');
import UniformVector3 = require('davinci-eight/uniforms/UniformVector3');
import UniformSpinor3 = require('davinci-eight/uniforms/UniformSpinor3');
import RenderingContextMonitor = require('davinci-eight/utils/RenderingContextMonitor');
import WindowAnimationRunner = require('davinci-eight/utils/WindowAnimationRunner');
/**
 * @module EIGHT
 */
declare var eight: {
    'VERSION': string;
    initWebGL: (canvas: HTMLCanvasElement, attributes: {
        alpha?: boolean;
        antialias?: boolean;
        depth?: boolean;
        premultipliedAlpha?: boolean;
        preserveDrawingBuffer?: boolean;
        stencil?: boolean;
    }) => WebGLRenderingContext;
    view: (options?: {
        viewMatrixName?: string;
    }) => View;
    frustum: (left?: number, right?: number, bottom?: number, top?: number, near?: number, far?: number) => Frustum;
    perspective: (options?: {
        fov?: number;
        aspect?: number;
        near?: number;
        far?: number;
        projectionMatrixName?: string;
        viewMatrixName?: string;
    }) => Perspective;
    scene: () => DrawList;
    renderer: (canvas: HTMLCanvasElement, parameters?: RendererParameters) => Renderer;
    contextMonitor: (canvas: HTMLCanvasElement, attributes?: {
        alpha?: boolean;
        antialias?: boolean;
        depth?: boolean;
        premultipliedAlpha?: boolean;
        preserveDrawingBuffer?: boolean;
        stencil?: boolean;
    }) => RenderingContextMonitor;
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
    DataUsage: typeof DataUsage;
    DefaultAttribProvider: typeof DefaultAttribProvider;
    DefaultUniformProvider: typeof DefaultUniformProvider;
    primitive: <MESH extends AttribProvider, SHADERS extends ShaderProgram, MODEL extends UniformProvider>(mesh: MESH, shaders: SHADERS, model: MODEL) => Primitive<MESH, SHADERS, MODEL>;
    DrawMode: typeof DrawMode;
    ShaderAttribLocation: typeof ShaderAttribLocation;
    ShaderUniformLocation: typeof ShaderUniformLocation;
    pointsProgram: () => ShaderProgram;
    shaderProgram: (vertexShader: string, fragmentShader: string) => ShaderProgram;
    smartProgram: (attributes: AttribMetaInfos, uniformsList: UniformMetaInfos[]) => ShaderProgram;
    AmbientLight: typeof AmbientLight;
    DirectionalLight: typeof DirectionalLight;
    PointLight: typeof PointLight;
    Color: typeof Color;
    Face3: typeof Face3;
    Geometry: typeof Geometry;
    GeometryAdapter: typeof GeometryAdapter;
    ArrowGeometry: typeof ArrowGeometry;
    BarnGeometry: typeof BarnGeometry;
    BoxGeometry: typeof BoxGeometry;
    CylinderGeometry: typeof CylinderGeometry;
    DodecahedronGeometry: typeof DodecahedronGeometry;
    IcosahedronGeometry: typeof IcosahedronGeometry;
    KleinBottleGeometry: typeof KleinBottleGeometry;
    MobiusStripGeometry: typeof MobiusStripGeometry;
    OctahedronGeometry: typeof OctahedronGeometry;
    ParametricSurfaceGeometry: typeof ParametricSurfaceGeometry;
    PolyhedronGeometry: typeof PolyhedronGeometry;
    RevolutionGeometry: typeof RevolutionGeometry;
    SphereGeometry: typeof SphereGeometry;
    TetrahedronGeometry: typeof TetrahedronGeometry;
    TubeGeometry: typeof TubeGeometry;
    VortexGeometry: typeof VortexGeometry;
    LocalModel: typeof LocalModel;
    Node: typeof Node;
    TreeModel: typeof TreeModel;
    UniversalJoint: typeof UniversalJoint;
    UniformFloat: typeof UniformFloat;
    UniformMat4: typeof UniformMat4;
    UniformVec2: typeof UniformVec2;
    UniformVec3: typeof UniformVec3;
    UniformVec4: typeof UniformVec4;
    UniformVector3: typeof UniformVector3;
    UniformSpinor3: typeof UniformSpinor3;
    Matrix3: typeof Matrix3;
    Matrix4: typeof Matrix4;
    Spinor3: typeof Spinor3;
    Quaternion: typeof Quaternion;
    Vector2: typeof Vector2;
    Vector3: typeof Vector3;
    Curve: typeof Curve;
    ChainedUniformProvider: typeof ChainedUniformProvider;
    MultiUniformProvider: typeof MultiUniformProvider;
    uniforms: (providers: UniformProvider[]) => UniformProvider;
    arrowMesh: (options?: ArrowOptions) => AttribProvider;
    ArrowBuilder: typeof ArrowBuilder;
    boxMesh: (options?: BoxOptions) => AttribProvider;
    BoxBuilder: typeof BoxBuilder;
    CylinderArgs: typeof CylinderArgs;
    cylinderMesh: (options?: CylinderOptions) => AttribProvider;
    CylinderMeshBuilder: typeof CylinderMeshBuilder;
    sphereMesh: (options?: SphereOptions) => AttribProvider;
    SphereBuilder: typeof SphereBuilder;
    vortexMesh: (options?: {
        wireFrame?: boolean;
    }) => AttribProvider;
    arrow: (ambients: UniformProvider, options?: ArrowOptions) => Blade<Node>;
    box: (ambients: UniformProvider, options?: BoxOptions) => Primitive<AttribProvider, ShaderProgram, Node>;
    cylinder: (ambients: UniformProvider, options?: CylinderOptions) => Primitive<AttribProvider, ShaderProgram, Node>;
    sphere: (ambients: UniformProvider, options?: SphereOptions) => Primitive<AttribProvider, ShaderProgram, Node>;
    vortex: (ambients: UniformProvider) => Primitive<AttribProvider, ShaderProgram, Node>;
    shaderProgramFromScripts: (vsId: string, fsId: string, $document?: Document) => ShaderProgram;
};
export = eight;
