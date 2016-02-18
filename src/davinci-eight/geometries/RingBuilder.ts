import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import GridTopology from './GridTopology';
import IAxialGeometry from './IAxialGeometry';
import AxialPrimitivesBuilder from './AxialPrimitivesBuilder';
import Primitive from '../core/Primitive';
import R2m from '../math/R2m';
import G3m from '../math/G3m';
import VectorE3 from '../math/VectorE3';

export default class RingBuilder extends AxialPrimitivesBuilder implements IAxialGeometry<RingBuilder> {
    public innerRadius: number = 0;
    public outerRadius: number = 1;
    public thetaSegments = 16;
    constructor(axis: VectorE3, sliceStart: VectorE3) {
        super(axis, sliceStart)
    }
    public setAxis(axis: VectorE3): RingBuilder {
        super.setAxis(axis)
        return this
    }
    public setPosition(position: VectorE3): RingBuilder {
        super.setPosition(position)
        return this
    }
    toPrimitives(): Primitive[] {
        const uSegments = this.thetaSegments
        const vSegments = 1
        const topo = new GridTopology(uSegments, vSegments)
        const a = this.outerRadius
        const b = this.innerRadius
        const axis = G3m.fromVector(this.axis)
        const start = G3m.fromVector(this.sliceStart)
        const generator = new G3m().dual(axis)

        for (let uIndex = 0; uIndex < topo.uLength; uIndex++) {
            const u = uIndex / uSegments
            const rotor = generator.clone().scale(this.sliceAngle * u / 2).exp()
            for (let vIndex = 0; vIndex < topo.vLength; vIndex++) {
                const v = vIndex / vSegments
                const position = start.clone().rotate(rotor).scale(b + (a - b) * v)
                const vertex = topo.vertex(uIndex, vIndex)
                vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = position.addVector(this.position)
                vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = axis
                if (this.useTextureCoords) {
                    vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_TEXTURE_COORDS] = new R2m([u, v])
                }
            }
        }
        return [topo.toDrawPrimitive()]
    }
    enableTextureCoords(enable: boolean): RingBuilder {
        super.enableTextureCoords(enable)
        return this
    }
}
