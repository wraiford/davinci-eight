import BeginMode from '../core/BeginMode'
import GeometryOptions from './GeometryOptions'
import VectorE3 from '../math/VectorE3'

interface GridGeometryOptions extends GeometryOptions {

    /**
     * A parametric function determining the positions of points in the grid.
     *
     * 0 <= u <= 1
     * 0 <= v <= 1
     *
     * @attribute aPosition
     * @type (u: number, v: number) => VectorE3
     * @optional
     * @default () => (u, v, 0)
     */
    aPosition?: (u: number, v: number) => VectorE3

    aNormal?: (u: number, v: number) => VectorE3

    /**
     *
     */
    aColor?: (u: number, v: number) => { r: number; g: number; b: number }

    /**
     * @default LINES
     */
    mode?: BeginMode

    /**
     * @attribute uMin
     * @type number
     * @optional
     * @default 0
     */
    uMin?: number

    /**
     * @attribute uMax
     * @type number
     * @optional
     * @default 1
     */
    uMax?: number

    /**
     * @attribute uSegments
     * @type number
     * @optional
     * @default 1
     */
    uSegments?: number

    /**
     * @attribute vMin
     * @type number
     * @optional
     * @default 0
     */
    vMin?: number

    /**
     * @attribute uMax
     * @type number
     * @optional
     * @default 1
     */
    vMax?: number

    /**
     * @attribute vSegments
     * @type number
     * @optional
     * @default 1
     */
    vSegments?: number
}

export default GridGeometryOptions
