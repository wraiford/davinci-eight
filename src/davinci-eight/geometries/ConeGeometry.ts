import AxialGeometry = require('../geometries/AxialGeometry')
import VectorE3 = require('../math/VectorE3')
import DrawPrimitive = require('../geometries/DrawPrimitive')
import GridTopology = require('../topologies/GridTopology')
import IAxialGeometry = require('../geometries/IAxialGeometry')
import mustBeBoolean = require('../checks/mustBeBoolean')
import Symbolic = require('../core/Symbolic')
import R2 = require('../math/R2')
import R3 = require('../math/R3')

/**
 * @class ConeGeometry
 */
class ConeGeometry extends AxialGeometry implements IAxialGeometry<ConeGeometry> {
    /**
     * @property radius
     * @type {number}
     */
    public radius: number = 1;
    /**
     * @property height
     * @type {number}
     */
    public height: number = 1;
    /**
     * @property thetaSegments
     * @type {number}
     */
    public thetaSegments = 16;
    /**
     * @class ConeGeometry
     * @constructor
     */
    constructor() {
        super()
    }
    /**
     * @method setAxis
     * @param axis {VectorE3}
     * @return {ConeGeometry}
     * @chainable
     */
    public setAxis(axis: VectorE3): ConeGeometry {
        super.setAxis(axis)
        return this
    }
    /**
     * @method setPosition
     * @param position {VectorE3}
     * @return {ConeGeometry}
     * @chainable
     */
    public setPosition(position: VectorE3): ConeGeometry {
        super.setPosition(position)
        return this
    }
    /**
     * @method tPrimitives
     * @return {DrawPrimitive[]}
     */
    public toPrimitives(): DrawPrimitive[] {
        var topo = new GridTopology(this.thetaSegments, 1)
        var uLength = topo.uLength
        var uSegments = uLength - 1
        var vLength = topo.vLength
        var vSegments = vLength - 1

        var a = R3.copy(this.sliceStart).normalize().scale(this.radius)
        var b = new R3().cross2(a, this.axis).normalize().scale(this.radius)
        var h = R3.copy(this.axis).scale(this.height)
        for (var uIndex = 0; uIndex < uLength; uIndex++) {
            var u = uIndex / uSegments
            var theta = this.sliceAngle * u
            var cosTheta = Math.cos(theta)
            var sinTheta = Math.sin(theta)
            for (var vIndex = 0; vIndex < vLength; vIndex++) {
                var v = vIndex / vSegments
                var position = new R3().add(a, cosTheta * (1 - v)).add(b, sinTheta * (1 - v)).add(h, v)
                var peak = R3.copy(h).sub(position)
                var normal = new R3().cross2(peak, position).cross(peak).normalize()
                var vertex = topo.vertex(uIndex, vIndex)
                vertex.attributes[Symbolic.ATTRIBUTE_POSITION] = position.add(this.position)
                vertex.attributes[Symbolic.ATTRIBUTE_NORMAL] = normal
                if (this.useTextureCoords) {
                    vertex.attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = new R2([u, v])
                }
            }
        }
        return [topo.toDrawPrimitive()]
    }
    enableTextureCoords(enable: boolean): ConeGeometry {
        super.enableTextureCoords(enable)
        return this
    }
}

export = ConeGeometry
