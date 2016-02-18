import GridBuilder from '../geometries/GridBuilder';
import R3m from '../math/R3m';

let cos = Math.cos;
let sin = Math.sin;
let pi = Math.PI;

function klein(u: number, v: number): R3m {
    var point = new R3m();

    u = u * 2 * pi;
    v = v * 2 * pi;

    if (u < pi) {
        point.x = 3 * cos(u) * (1 + sin(u)) + (2 * (1 - cos(u) / 2)) * cos(u) * cos(v)
        point.z = -8 * sin(u) - 2 * (1 - cos(u) / 2) * sin(u) * cos(v)
    }
    else {
        point.x = 3 * cos(u) * (1 + sin(u)) + (2 * (1 - cos(u) / 2)) * cos(v + pi)
        point.z = -8 * sin(u)
    }
    point.y = -2 * (1 - cos(u) / 2) * sin(v)
    return point.scale(0.1);
}

export default class KleinBottleSimplexGeometry extends GridBuilder {
    constructor(uSegments: number, vSegments: number) {
        super(klein, uSegments, vSegments);
    }
}
