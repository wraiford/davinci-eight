import mustBeNumber from '../../checks/mustBeNumber'
import mustBeString from '../../checks/mustBeString'
import Spinor3 from '../../math/Spinor3'
import Vector3 from '../../math/Vector3'
import VectorE3 from '../../math/VectorE3'
import Vertex from '../primitives/Vertex'
import Transform from '../primitives/Transform'

/**
 * @class RingTransform
 */
export default class RingTransform implements Transform {
    private e: Vector3
    private cutLine: Vector3
    private innerRadius: number
    private outerRadius: number
    private sliceAngle: number
    private generator: Spinor3
    private aPosition: string
    private aTangent: string

    /**
     * @class RingTransform
     * @constructor
     * @param e {Vector3} The axis normal to the plane of the ring.
     * @param cutLine {Vector3}
     * @param clockwise {boolean}
     * @param a {number} The outer radius.
     * @param b {number} The inner radius.
     * @param aPosition {string} The name to use for the position attribute.
     */
    constructor(e: VectorE3, cutLine: VectorE3, clockwise: boolean, a: number, b: number, sliceAngle: number, aPosition: string, aTangent: string) {
        this.e = Vector3.copy(e)
        this.innerRadius = mustBeNumber('a', a)
        this.outerRadius = mustBeNumber('b', b)
        this.sliceAngle = mustBeNumber('sliceAngle', sliceAngle)
        this.generator = Spinor3.dual(e, clockwise)
        this.cutLine = Vector3.copy(cutLine).direction()
        this.aPosition = mustBeString('aPosition', aPosition)
        this.aTangent = mustBeString('aTangent', aTangent)
    }

    /**
     * @method exec
     * @param vertex {Vertex}
     * @param i {number}
     * @param j {number}
     * @param iLength {number}
     * @param jLength {number}
     */
    exec(vertex: Vertex, i: number, j: number, iLength: number, jLength: number): void {
        const uSegments = iLength - 1
        const u = i / uSegments

        const vSegments = jLength - 1
        const v = j / vSegments

        const b = this.innerRadius
        const a = this.outerRadius
        const rotor = this.generator.clone().scale(-this.sliceAngle * u / 2).exp()
        const position = Vector3.copy(this.cutLine).rotate(rotor).scale(b + (a - b) * v)
        const tangent = Spinor3.dual(this.e, false)
        vertex.attributes[this.aPosition] = position
        vertex.attributes[this.aTangent] = tangent
    }
}
