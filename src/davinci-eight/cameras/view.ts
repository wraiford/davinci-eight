import UniformMetaInfos = require('../core/UniformMetaInfos');
import object3D = require('../core/object3D');
import Vector3 = require('../math/Vector3');
import Cartesian3 = require('../math/Cartesian3');
import Spinor3 = require('../math/Spinor3');
import Matrix4 = require('../math/Matrix4');
import View = require('../cameras/View');
import Symbolic = require('../core/Symbolic');

let UNIFORM_VIEW_MATRIX_NAME = 'uViewMatrix';
let UNIFORM_VIEW_MATRIX_TYPE = 'mat4';

let UNIFORM_AMBIENT_LIGHT_NAME = 'uAmbientLight';
let UNIFORM_AMBIENT_LIGHT_TYPE = 'vec3';

/**
 * @class view
 * @constructor
 */
var view = function(): View {

    var eye: Vector3 = new Vector3();
    var look: Vector3 = new Vector3();
    var up: Vector3 = Vector3.e2;
    var viewMatrix: Matrix4 = new Matrix4();

    function updateViewMatrix() {
      var n = new Vector3().subVectors(eye, look);
      if (n.x === 0 && n.y === 0 && n.z === 0) {
        // View direction is ambiguous.
          n.z = 1;
      }
      else {
        n.normalize();
      }
      var u = new Vector3().crossVectors(up, n);
      var v = new Vector3().crossVectors(n, u);
      var d = new Vector3({ x: eye.dot(u), y: eye.dot(v), z: eye.dot(n) }).multiplyScalar(-1);
      var m = viewMatrix.elements;
      m[0] = u.x;  m[4] = u.y; m[8]  = u.z; m[12] = d.x;
      m[1] = v.x;  m[5] = v.y; m[9]  = v.z; m[13] = d.y;
      m[2] = n.x;  m[6] = n.y; m[10] = n.z; m[14] = d.z;
      m[3] = 0;    m[7] = 0;   m[11] = 0;   m[15] = 1;
    }

    updateViewMatrix();

    var publicAPI: View = {
        get eye(): Cartesian3 {
          return eye;
        },
        set eye(value: Cartesian3) {
          eye = new Vector3(value);
          updateViewMatrix();
        },
        get look(): Cartesian3 {
          return look;
        },
        set look(value: Cartesian3) {
          look = new Vector3(value);
          updateViewMatrix();
        },
        get up(): Cartesian3 {
          return up;
        },
        set up(value: Cartesian3) {
          up = new Vector3(value).normalize();
          updateViewMatrix();
        },
        getUniformMatrix3(name: string): {transpose: boolean; matrix3: Float32Array} {
          return null;
        },
        getUniformMatrix4(name: string): {transpose: boolean; matrix4: Float32Array} {
          switch(name) {
            case UNIFORM_VIEW_MATRIX_NAME: {
              //console.log("viewMatrix: " + viewMatrix.toFixed(0));
              return {transpose: false, matrix4: viewMatrix.elements};
            }
            default: {
              return null;//base.getUniformMatrix4(name);
            }
          }
        },
        getUniformVector3(name: string): Vector3 {
          return null;
        },
        getUniformMetaInfos(): UniformMetaInfos
        {
          var uniforms: UniformMetaInfos = {};//base.getUniformMetaInfos();
          uniforms[Symbolic.UNIFORM_VIEW_MATRIX]  = {name: UNIFORM_VIEW_MATRIX_NAME, type: UNIFORM_VIEW_MATRIX_TYPE};
          return uniforms;
        }
    };

    return publicAPI;
};

export = view;