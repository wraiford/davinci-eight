import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import mustBeInteger from '../checks/mustBeInteger';
import mustBeString from '../checks/mustBeString';

function sizeType(size: 1 | 2 | 3 | 4): 'float' | 'vec2' | 'vec3' | 'vec4' {
  mustBeInteger('size', size);
  switch (size) {
    case 1: {
      return 'float';
    }
    case 2: {
      return 'vec2';
    }
    case 3: {
      return 'vec3';
    }
    case 4: {
      return 'vec4';
    }
    default: {
      throw new Error("Can't compute the GLSL attribute type from size " + size);
    }
  }
}

export default function glslAttribType(key: string, size: 1 | 2 | 3 | 4): 'float' | 'vec2' | 'vec3' | 'vec4' {
  mustBeString('key', key);
  mustBeInteger('size', size);
  switch (key) {
    case GraphicsProgramSymbols.ATTRIBUTE_COLOR: {
      // No need to hard-code to 'vec3' anymore.
      return sizeType(size);
    }
    default: {
      return sizeType(size);
    }
  }
}
