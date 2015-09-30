/// <reference path="../vendor/davinci-blade/dist/davinci-blade.d.ts" />
import Frustum = require('davinci-eight/cameras/Frustum');
import Perspective = require('davinci-eight/cameras/Perspective');
import View = require('davinci-eight/cameras/View');
import WebGLClear = require('davinci-eight/commands/WebGLClear');
import WebGLClearColor = require('davinci-eight/commands/WebGLClearColor');
import WebGLEnable = require('davinci-eight/commands/WebGLEnable');
import AttribLocation = require('davinci-eight/core/AttribLocation');
import AttribMetaInfo = require('davinci-eight/core/AttribMetaInfo');
import Color = require('davinci-eight/core/Color');
import DrawMode = require('davinci-eight/core/DrawMode');
import Face3 = require('davinci-eight/core/Face3');
import ContextKahuna = require('davinci-eight/core/ContextKahuna');
import ContextMonitor = require('davinci-eight/core/ContextMonitor');
import Symbolic = require('davinci-eight/core/Symbolic');
import UniformLocation = require('davinci-eight/core/UniformLocation');
import UniformMetaInfo = require('davinci-eight/core/UniformMetaInfo');
import Curve = require('davinci-eight/curves/Curve');
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
import GeometryElements = require('davinci-eight/geometries/GeometryElements');
import BarnGeometry = require('davinci-eight/geometries/BarnGeometry');
import CuboidGeometry = require('davinci-eight/geometries/CuboidGeometry');
import Simplex1Geometry = require('davinci-eight/geometries/Simplex1Geometry');
import Material = require('davinci-eight/materials/Material');
import HTMLScriptsMaterial = require('davinci-eight/materials/HTMLScriptsMaterial');
import LineMaterial = require('davinci-eight/materials/LineMaterial');
import MeshMaterial = require('davinci-eight/materials/MeshMaterial');
import PointMaterial = require('davinci-eight/materials/PointMaterial');
import SmartMaterialBuilder = require('davinci-eight/materials/SmartMaterialBuilder');
import RoundUniform = require('davinci-eight/mappers/RoundUniform');
import Cartesian3 = require('davinci-eight/math/Cartesian3');
import Euclidean3 = require('davinci-eight/math/Euclidean3');
import Matrix3 = require('davinci-eight/math/Matrix3');
import Matrix4 = require('davinci-eight/math/Matrix4');
import Rotor3 = require('davinci-eight/math/Rotor3');
import Spinor3 = require('davinci-eight/math/Spinor3');
import Vector1 = require('davinci-eight/math/Vector1');
import Vector2 = require('davinci-eight/math/Vector2');
import Vector3 = require('davinci-eight/math/Vector3');
import Vector4 = require('davinci-eight/math/Vector4');
import VectorN = require('davinci-eight/math/VectorN');
import ArrowBuilder = require('davinci-eight/mesh/ArrowBuilder');
import CylinderArgs = require('davinci-eight/mesh/CylinderArgs');
import EulerModel = require('davinci-eight/models/EulerModel');
import Model3 = require('davinci-eight/models/Model3');
import RigidBody3 = require('davinci-eight/models/RigidBody3');
import IMaterial = require('davinci-eight/core/IMaterial');
import ContextRenderer = require('davinci-eight/renderers/ContextRenderer');
import SineWaveUniform = require('davinci-eight/uniforms/SineWaveUniform');
import Shareable = require('davinci-eight/utils/Shareable');
import WindowAnimationRunner = require('davinci-eight/utils/WindowAnimationRunner');
/**
 * @module EIGHT
 */
declare var eight: {
    LAST_MODIFIED: string;
    strict: boolean;
    VERSION: string;
    HTMLScriptsMaterial: typeof HTMLScriptsMaterial;
    Material: typeof Material;
    LineMaterial: typeof LineMaterial;
    MeshMaterial: typeof MeshMaterial;
    PointMaterial: typeof PointMaterial;
    SmartMaterialBuilder: typeof SmartMaterialBuilder;
    WebGLClear: typeof WebGLClear;
    WebGLClearColor: typeof WebGLClearColor;
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
    EulerModel: typeof EulerModel;
    Model3: typeof Model3;
    RigidBody3: typeof RigidBody3;
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
    renderer: () => ContextRenderer;
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
    createMaterial: (monitors: ContextMonitor[], vertexShader: string, fragmentShader: string, attribs: string[]) => IMaterial;
    smartProgram: (monitors: ContextMonitor[], attributes: {
        [name: string]: AttribMetaInfo;
    }, uniformsList: {
        [name: string]: UniformMetaInfo;
    }[], bindings: string[]) => IMaterial;
    Color: typeof Color;
    Face3: typeof Face3;
    CompatcGeometry: typeof GeometryElements;
    BarnGeometry: typeof BarnGeometry;
    CuboidGeometry: typeof CuboidGeometry;
    Simplex1Geometry: typeof Simplex1Geometry;
    Euclidean3: typeof Euclidean3;
    Matrix3: typeof Matrix3;
    Matrix4: typeof Matrix4;
    rotor3: () => Rotor3;
    Spinor3: typeof Spinor3;
    Vector1: typeof Vector1;
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
    programFromScripts: (monitors: ContextMonitor[], vsId: string, fsId: string, $document: Document, attribs?: string[]) => IMaterial;
    GeometryAttribute: typeof GeometryAttribute;
    GeometryElements: typeof GeometryElements;
    SineWaveUniform: typeof SineWaveUniform;
    refChange: (uuid: string, name?: string, change?: number) => number;
    Shareable: typeof Shareable;
};
export = eight;
