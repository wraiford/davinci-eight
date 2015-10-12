import AttribMetaInfo = require('../core/AttribMetaInfo');
import UniformMetaInfo = require('../core/UniformMetaInfo');
/**
 * Generates a fragment shader
 */
declare function fragmentShader(attributes: {
    [name: string]: AttribMetaInfo;
}, uniforms: {
    [name: string]: UniformMetaInfo;
}, vColor: boolean, vLight: boolean): string;
export = fragmentShader;
