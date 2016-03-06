import BoxOptions from './BoxOptions'
import BoxGeometry from '../geometries/BoxGeometry'
import BoxGeometryOptions from '../geometries/BoxGeometryOptions'
import direction from './direction'
import isDefined from '../checks/isDefined'
import MeshMaterial from '../materials/MeshMaterial'
import MeshMaterialOptions from '../materials/MeshMaterialOptions'
import mustBeNumber from '../checks/mustBeNumber'
import RigidBody from './RigidBody'

/**
 * @module EIGHT
 * @submodule visual
 */

/**
 * @class Box
 * @extends RigidBody
 */
export default class Box extends RigidBody {

  /**
   * @class Box
   * @constructor
   * @param [options] {BoxOptions}
   */
  constructor(options: BoxOptions = {}) {
    super('Box', direction(options))
    // The shape is created un-stressed and then parameters drive the scaling.
    // The scaling matrix takes into account the initial tilt from the standard configuration.
    // const stress = Vector3.vector(1, 1, 1)

    const geoOptions: BoxGeometryOptions = {}
    geoOptions.engine = options.engine
    geoOptions.tilt = options.tilt
    geoOptions.offset = options.offset
    geoOptions.openBack = options.openBack
    geoOptions.openBase = options.openBase
    geoOptions.openFront = options.openFront
    geoOptions.openLeft = options.openLeft
    geoOptions.openRight = options.openRight
    geoOptions.openCap = options.openCap
    const geometry = new BoxGeometry(geoOptions)
    this.geometry = geometry
    geometry.release()

    const matOptions: MeshMaterialOptions = void 0
    const material = new MeshMaterial(matOptions, options.engine)
    this.material = material
    material.release()

    if (options.color) {
      this.color.copy(options.color)
    }
    if (options.position) {
      this.position.copyVector(options.position)
    }
    if (options.attitude) {
      this.attitude.copySpinor(options.attitude)
    }

    this.width = isDefined(options.width) ? mustBeNumber('width', options.width) : 1.0
    this.height = isDefined(options.height) ? mustBeNumber('height', options.height) : 1.0
    this.depth = isDefined(options.depth) ? mustBeNumber('depth', options.depth) : 1.0
  }


  /**
   * @method destructor
   * @return {void}
   * @protected
   */
  protected destructor(): void {
    super.destructor()
  }

  /**
   * @property width
   * @type number
   * @default 1
   */
  get width() {
    return this.getPrincipalScale('width')
  }
  set width(width: number) {
    this.setPrincipalScale('width', width)
  }

  /**
   * @property height
   * @type number
   */
  get height() {
    return this.getPrincipalScale('height')
  }
  set height(height: number) {
    this.setPrincipalScale('height', height)
  }

  /**
   * @property depth
   * @type number
   */
  get depth() {
    return this.getPrincipalScale('depth')
  }
  set depth(depth: number) {
    this.setPrincipalScale('depth', depth)
  }
}
