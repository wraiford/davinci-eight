/// <reference path="../vendor/davinci-blade/dist/davinci-blade.d.ts" />
import AttributeMetaInfos = require('davinci-eight/core/AttributeMetaInfos');
import AmbientLight = require('davinci-eight/uniforms/AmbientLight');
import Node3D = require('davinci-eight/core/Node3D');
import Color = require('davinci-eight/core/Color');
import ChainedVertexUniformProvider = require('davinci-eight/objects/ChainedVertexUniformProvider');
import View = require('davinci-eight/cameras/View');
import Frustum = require('davinci-eight/cameras/Frustum');
import LinearPerspectiveCamera = require('davinci-eight/cameras/LinearPerspectiveCamera');
import World = require('davinci-eight/worlds/World');
import WebGLRenderer = require('davinci-eight/renderers/WebGLRenderer');
import VertexUniformProvider = require('davinci-eight/core/VertexUniformProvider');
import Face3 = require('davinci-eight/core/Face3');
import Geometry = require('davinci-eight/geometries/Geometry');
import GeometryAdapter = require('davinci-eight/geometries/GeometryAdapter');
import ArrowGeometry = require('davinci-eight/geometries/ArrowGeometry');
import BoxGeometry = require('davinci-eight/geometries/BoxGeometry');
import CylinderGeometry = require('davinci-eight/geometries/CylinderGeometry');
import DodecahedronGeometry = require('davinci-eight/geometries/DodecahedronGeometry');
import IcosahedronGeometry = require('davinci-eight/geometries/IcosahedronGeometry');
import KleinBottleGeometry = require('davinci-eight/geometries/KleinBottleGeometry');
import MobiusStripGeometry = require('davinci-eight/geometries/MobiusStripGeometry');
import OctahedronGeometry = require('davinci-eight/geometries/OctahedronGeometry');
import ParametricGeometry = require('davinci-eight/geometries/ParametricGeometry');
import PolyhedronGeometry = require('davinci-eight/geometries/PolyhedronGeometry');
import RevolutionGeometry = require('davinci-eight/geometries/RevolutionGeometry');
import SphereGeometry = require('davinci-eight/geometries/SphereGeometry');
import TetrahedronGeometry = require('davinci-eight/geometries/TetrahedronGeometry');
import TubeGeometry = require('davinci-eight/geometries/TubeGeometry');
import VortexGeometry = require('davinci-eight/geometries/VortexGeometry');
import ShaderAttributeVariable = require('davinci-eight/core/ShaderAttributeVariable');
import ShaderUniformVariable = require('davinci-eight/core/ShaderUniformVariable');
import Matrix3 = require('davinci-eight/math/Matrix3');
import Matrix4 = require('davinci-eight/math/Matrix4');
import Spinor3 = require('davinci-eight/math/Spinor3');
import Vector2 = require('davinci-eight/math/Vector2');
import Vector3 = require('davinci-eight/math/Vector3');
import DrawableModel = require('davinci-eight/objects/DrawableModel');
import Curve = require('davinci-eight/curves/Curve');
import Model = require('davinci-eight/objects/Model');
import UniformMetaInfos = require('davinci-eight/core/UniformMetaInfos');
import VertexAttributeProvider = require('davinci-eight/core/VertexAttributeProvider');
import ShaderProgram = require('davinci-eight/programs/ShaderProgram');
import Renderer = require('davinci-eight/renderers/Renderer');
import RendererParameters = require('davinci-eight/renderers/RendererParameters');
/**
 * @module EIGHT
 */
declare var eight: {
    'VERSION': string;
    view: () => View;
    frustum: (left?: number, right?: number, bottom?: number, top?: number, near?: number, far?: number) => Frustum;
    perspective: (fov?: number, aspect?: number, near?: number, far?: number) => LinearPerspectiveCamera;
    world: () => World;
    object3D: () => Node3D;
    renderer: (parameters?: RendererParameters) => Renderer;
    contextMonitor: (canvas: HTMLCanvasElement, contextFree: () => void, contextGain: (gl: WebGLRenderingContext, contextGainId: string) => void, contextLoss: () => void) => {
        start: (context: WebGLRenderingContext) => void;
        stop: () => void;
    };
    workbench: (canvas: HTMLCanvasElement, renderer: any, camera: {
        aspect: number;
    }, win?: Window) => {
        setUp: () => void;
        tearDown: () => void;
    };
    animationRunner: (tick: (time: number) => void, terminate: (time: number) => void, setUp: () => void, tearDown: (ex: any) => void, win?: Window) => {
        start: () => void;
        stop: () => void;
    };
    drawableModel: <G extends VertexAttributeProvider, M extends VertexUniformProvider, P extends ShaderProgram>(mesh: G, model: M, shaderProgram: P) => DrawableModel<G, M, P>;
    ShaderAttributeVariable: typeof ShaderAttributeVariable;
    ShaderUniformVariable: typeof ShaderUniformVariable;
    pointsProgram: () => ShaderProgram;
    shaderProgram: (vertexShader: string, fragmentShader: string) => ShaderProgram;
    smartProgram: (attributes: AttributeMetaInfos, uniformsList: UniformMetaInfos[]) => ShaderProgram;
    AmbientLight: typeof AmbientLight;
    WebGLRenderer: typeof WebGLRenderer;
    Color: typeof Color;
    Face3: typeof Face3;
    Geometry: typeof Geometry;
    GeometryAdapter: typeof GeometryAdapter;
    ArrowGeometry: typeof ArrowGeometry;
    BoxGeometry: typeof BoxGeometry;
    CylinderGeometry: typeof CylinderGeometry;
    DodecahedronGeometry: typeof DodecahedronGeometry;
    IcosahedronGeometry: typeof IcosahedronGeometry;
    KleinBottleGeometry: typeof KleinBottleGeometry;
    MobiusStripGeometry: typeof MobiusStripGeometry;
    OctahedronGeometry: typeof OctahedronGeometry;
    ParametricGeometry: typeof ParametricGeometry;
    PolyhedronGeometry: typeof PolyhedronGeometry;
    RevolutionGeometry: typeof RevolutionGeometry;
    SphereGeometry: typeof SphereGeometry;
    TetrahedronGeometry: typeof TetrahedronGeometry;
    TubeGeometry: typeof TubeGeometry;
    VortexGeometry: typeof VortexGeometry;
    Model: typeof Model;
    Matrix3: typeof Matrix3;
    Matrix4: typeof Matrix4;
    Spinor3: typeof Spinor3;
    Vector2: typeof Vector2;
    Vector3: typeof Vector3;
    Curve: typeof Curve;
    ChainedVertexUniformProvider: typeof ChainedVertexUniformProvider;
};
export = eight;
