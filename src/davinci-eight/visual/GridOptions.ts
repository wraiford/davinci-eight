import DrawMode from '../core/DrawMode'
import IColor from '../core/IColor'
import VectorE3 from '../math/VectorE3'

/**
 * @class GridOptions
 */
interface GridOptions {

  /**
   * <p>
   * A parametric function determining the positions of points in the grid.
   * </p>
   * <p>
   * u<sub>min</sub> <= u <= u<sub>max</sub>
   * </p>
   * <p>
   * v<sub>min</sub> <= v <= v<sub>max</sub>
   * </p>
   *
   * @attribute aPosition
   * @type (u: number, v: number) => VectorE3
   * @optional
   * @default (u: number, v: number) => u * e1 + v * e2
   */
  aPosition?: (u: number, v: number) => VectorE3

  /**
   * @attribute aNormal
   * @type (u: number, v: number) => VectorE3
   * @optional
   * @default (u: number, v: number) => e3
   */
  aNormal?: (u: number, v: number) => VectorE3

  /**
   * @attribute aColor
   * @type (u: number, v: number) => IColor
   * @optional
   */
  aColor?: (u: number, v: number) => IColor

  /**
   * Specifies the required Geometric Primitive Type.
   * Implementations may choose the nearest type.
   *
   * @attribute drawMode
   * @type DrawMode
   * @optional
   * @default DrawMode.LINES
   */
  drawMode?: DrawMode

  /**
   * @attribute uMin
   * @type number
   * @optional
   * @default -0.5
   */
  uMin?: number

  /**
   * @attribute uMax
   * @type number
   * @optional
   * @default +0.5
   */
  uMax?: number

  /**
   * The number of segments for the u coordinate.
   *
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
   * @default -0.5
   */
  vMin?: number

  /**
   * @attribute vMax
   * @type number
   * @optional
   * @default +0.5
   */
  vMax?: number

  /**
   * The number of segments for the v coordinate.
   *
   * @attribute vSegments
   * @type number
   * @optional
   * @default 1
   */
  vSegments?: number
}

export default GridOptions