import Cartesian3 = require('../math/Cartesian3');
declare function viewArray(eye: Cartesian3, look: Cartesian3, up: Cartesian3, matrix?: Float32Array): Float32Array;
export = viewArray;