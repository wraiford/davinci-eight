import Simplex = require('../geometries/Simplex');
/**
 * cube as Simplex[]
 *
 *    v6----- v5
 *   /|      /|
 *  v1------v0|
 *  | |     | |
 *  | |v7---|-|v4
 *  |/      |/
 *  v2------v3
 */
declare function cube(size?: number): Simplex[];
export = cube;