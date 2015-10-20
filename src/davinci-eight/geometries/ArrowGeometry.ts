import Cartesian3 = require('../math/Cartesian3')
import ConeGeometry = require('../geometries/ConeGeometry')
import CylinderGeometry = require('../geometries/CylinderGeometry')
import DrawPrimitive = require('../geometries/DrawPrimitive')
import AxialGeometry = require('../geometries/AxialGeometry')
import IGeometry = require('../geometries/IGeometry')
import mustBeBoolean = require('../checks/mustBeBoolean')
import RingGeometry = require('../geometries/RingGeometry')
import Vector3 = require('../math/Vector3')

/**
 * @class ArrowGeometry
 */
class ArrowGeometry extends AxialGeometry implements IGeometry<ArrowGeometry> {
    /**
     * @property heightCone
     * @type {number}
     */
    public heightCone: number = 0.20;
    /**
     * @property radiusCone
     * @type {number}
     */
    public radiusCone: number = 0.08;
    /**
     * @property radiusShaft
     * @type {number}
     */
    public radiusShaft: number = 0.01;
    /**
     * @property thetaSegments
     * @type {number}
     */
    public thetaSegments = 8;
    /**
     * @class ArrowGeometry
     * @constructor
     */
    constructor() {
        super()
    }
    /**
     * @method setPosition
     * @param position {Cartesian3}
     * @return {ArrowGeometry}
     * @chainable
     */
    setPosition(position: Cartesian3): ArrowGeometry {
        this.position = position
        return this
    }
    /**
     * @method toPrimitives
     * @return {DrawPrimitive[]}
     */
    toPrimitives(): DrawPrimitive[] {
        let heightShaft = 1 - this.heightCone
        /**
         * The opposite direction to the axis.
         */
        let back = Vector3.copy(this.axis).scale(-1)
        /**
         * The neck is the place where the cone meets the shaft. 
         */
        let neck = Vector3.copy(this.axis).scale(heightShaft).add(this.position)
        /**
         * The tail is the the position of the blunt end of the arrow.
         */
        let tail = Vector3.copy(this.position)

        let cone = new ConeGeometry()
        cone.radius = this.radiusCone
        cone.height = this.heightCone
        cone.position = neck
        cone.axis = this.axis
        cone.sliceAngle = this.sliceAngle
        cone.sliceStart = this.sliceStart
        cone.thetaSegments = this.thetaSegments
        cone.useTextureCoords = this.useTextureCoords
        /**
         * The `disc` fills the space between the cone and the shaft.
         */
        let disc = new RingGeometry()
        disc.innerRadius = this.radiusShaft
        disc.outerRadius = this.radiusCone
        disc.position = neck
        disc.axis = back
        disc.sliceAngle = -this.sliceAngle
        disc.sliceStart = this.sliceStart
        disc.thetaSegments = this.thetaSegments
        disc.useTextureCoords = this.useTextureCoords
        /**
         * The `shaft` is the slim part of the arrow.
         */
        let shaft = new CylinderGeometry()
        shaft.radius = this.radiusShaft
        shaft.height = heightShaft
        shaft.position = tail
        shaft.axis = this.axis
        shaft.sliceAngle = this.sliceAngle
        shaft.sliceStart = this.sliceStart
        shaft.thetaSegments = this.thetaSegments
        shaft.useTextureCoords = this.useTextureCoords
        /**
         * The `plug` fills the end of the shaft.
         */
        let plug = new RingGeometry()
        plug.innerRadius = 0
        plug.outerRadius = this.radiusShaft
        plug.position = tail
        plug.axis = back
        plug.sliceAngle = -this.sliceAngle
        plug.sliceStart = this.sliceStart
        plug.thetaSegments = this.thetaSegments
        plug.useTextureCoords = this.useTextureCoords

        return [cone.toPrimitives(), disc.toPrimitives(), shaft.toPrimitives(), plug.toPrimitives()].reduce((a, b) => { return a.concat(b) }, [])
    }
    enableTextureCoords(enable: boolean): ArrowGeometry {
        mustBeBoolean('enable', enable)
        this.useTextureCoords = enable
        return this
    }
}
export = ArrowGeometry