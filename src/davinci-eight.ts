/// <reference path="../vendor/davinci-blade/dist/davinci-blade.d.ts" />

import core = require('davinci-eight/core');

import object3D = require('davinci-eight/core/object3D');
import camera = require('davinci-eight/cameras/camera');
import Camera = require('davinci-eight/cameras/Camera');
import perspectiveCamera = require('davinci-eight/cameras/perspectiveCamera');
import PerspectiveCamera = require('davinci-eight/cameras/PerspectiveCamera');
import world = require('davinci-eight/worlds/world');
import Scene = require('davinci-eight/worlds/Scene');
import renderer = require('davinci-eight/renderers/renderer');
import WebGLRenderer = require('davinci-eight/renderers/WebGLRenderer');
import mesh = require('davinci-eight/objects/mesh');
import Mesh = require('davinci-eight/objects/Mesh');
import webGLContextMonitor = require('davinci-eight/utils/webGLContextMonitor');
import workbench3D = require('davinci-eight/utils/workbench3D');
import windowAnimationRunner = require('davinci-eight/utils/windowAnimationRunner');
import box = require('davinci-eight/geometries/box');
import cuboid = require('davinci-eight/geometries/cuboid');
import ellipsoid = require('davinci-eight/geometries/ellipsoid');
import prism = require('davinci-eight/geometries/prism');
import CurveGeometry = require('davinci-eight/geometries/CurveGeometry');
import LatticeGeometry = require('davinci-eight/geometries/LatticeGeometry');
import BoxGeometry = require('davinci-eight/geometries/BoxGeometry');
import RGBGeometry = require('davinci-eight/geometries/RGBGeometry');
import pointsMaterial = require('davinci-eight/materials/pointsMaterial');
import shaderMaterial = require('davinci-eight/materials/shaderMaterial');
import smartMaterial = require('davinci-eight/materials/smartMaterial');
import ShaderAttributeVariable = require('davinci-eight/objects/ShaderAttributeVariable');
import Matrix3 = require('davinci-eight/math/Matrix3');
import Matrix4 = require('davinci-eight/math/Matrix4');
import MeshBasicMaterial = require('davinci-eight/materials/MeshBasicMaterial');
import MeshNormalMaterial = require('davinci-eight/materials/MeshNormalMaterial');
import Quaternion = require('davinci-eight/math/Quaternion');

var eight = {
    'VERSION': core.VERSION,
    perspective: perspectiveCamera,
    get world() { return world; },
    object3D: object3D,
    renderer: renderer,
    contextMonitor: webGLContextMonitor,
    workbench: workbench3D,
    animationRunner: windowAnimationRunner,
    get mesh() { return mesh; },
    /**
     * Constructs and returns a box geometry.
     */
    get box() { return box; },
    get cuboid() { return cuboid; },
    get ellipsoid() { return ellipsoid; },
    prism: prism,
    CurveGeometry: CurveGeometry,
    LatticeGeometry: LatticeGeometry,
    RGBGeometry: RGBGeometry,
    ShaderAttributeVariable: ShaderAttributeVariable,
    get pointsMaterial() {
      return pointsMaterial;
    },
    get shaderMaterial() {
      return shaderMaterial;
    },
    get smartMaterial() {
      return smartMaterial;
    },
    get Scene() { return Scene; },
    get Camera() { return Camera; },
    get PerspectiveCamera() { return PerspectiveCamera; },
    get WebGLRenderer() { return WebGLRenderer; },
    get BoxGeometry() { return BoxGeometry; },
    get Mesh() { return Mesh; },
    get MeshBasicMaterial() { return MeshBasicMaterial; },
    get MeshNormalMaterial() { return MeshNormalMaterial; },
    get Matrix3() { return Matrix3; },
    get Matrix4() { return Matrix4; },
    get Quaternion() { return Quaternion; }
};
export = eight;
