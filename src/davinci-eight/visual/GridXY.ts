import contextManagerFromOptions from './contextManagerFromOptions';
import expectOptions from '../checks/expectOptions';
import {Grid} from './Grid';
import GridOptions from './GridOptions';
import isDefined from '../checks/isDefined';
import mustBeFunction from '../checks/mustBeFunction';
import mustBeInteger from '../checks/mustBeInteger';
import mustBeNumber from '../checks/mustBeNumber';
import validate from '../checks/validate';
import VectorE3 from '../math/VectorE3';
import R3 from '../math/R3';
import VisualOptions from './VisualOptions';

export interface GridXYOptions extends VisualOptions {
    xMin?: number;
    xMax?: number;
    xSegments?: number;
    yMin?: number;
    yMax?: number;
    ySegments?: number;
    z?: (x: number, y: number) => number;
    k?: number;
}

const ALLOWED_OPTIONS = ['xMin', 'xMax', 'xSegments', 'yMin', 'yMax', 'ySegments', 'z', 'contextManager', 'engine', 'tilt', 'offset', 'k'];

function mapOptions(options: GridXYOptions): GridOptions {
    expectOptions(ALLOWED_OPTIONS, Object.keys(options));
    let aPosition: (u: number, v: number) => VectorE3;
    if (isDefined(options.z)) {
        mustBeFunction('z', options.z);
        aPosition = function(x: number, y: number): VectorE3 {
            return R3(x, y, options.z(x, y));
        };
    }
    else {
        aPosition = function(x: number, y: number): VectorE3 {
            return R3(x, y, 0);
        };
    }
    const uMin = validate('xMin', options.xMin, undefined, mustBeNumber);
    const uMax = validate('xMax', options.xMax, undefined, mustBeNumber);
    const uSegments = validate('xSegments', options.xSegments, undefined, mustBeInteger);
    const vMin = validate('yMin', options.yMin, undefined, mustBeNumber);
    const vMax = validate('yMax', options.yMax, undefined, mustBeNumber);
    const vSegments = validate('ySegments', options.ySegments, undefined, mustBeInteger);
    return {
        engine: contextManagerFromOptions(options),
        offset: options.offset,
        tilt: options.tilt,
        stress: options.stress,
        uMin,
        uMax,
        uSegments,
        vMin,
        vMax,
        vSegments,
        aPosition,
        k: options.k
    };
}

/**
 * A grid in the xy plane.
 */
export default class GridXY extends Grid {
    constructor(options: GridXYOptions = {}, levelUp = 0) {
        super(mapOptions(options), levelUp + 1);
        if (levelUp === 0) {
            this.synchUp();
        }
    }
    protected destructor(levelUp: number): void {
        if (levelUp === 0) {
            this.cleanUp();
        }
        super.destructor(levelUp + 1);
    }
}