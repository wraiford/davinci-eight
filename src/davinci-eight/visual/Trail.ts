import Facet from '../core/Facet';
import Geometric3 from '../math/Geometric3'
import incLevel from '../base/incLevel';
import Mesh from '../core/Mesh';
import mustBeObject from '../checks/mustBeObject';
import ShareableBase from '../core/ShareableBase';
import TrailConfig from './TrailConfig';

/**
 * @module EIGHT
 * @submodule visual
 */

/**
 * <p>
 * Records the position and attitude history of a <code>Mesh</code> allowing the
 * <code>Mesh</code> to be drawn in multiple historical configurations.
 * <p>
 * <p>
 * This class is refererce counted because it maintains a reference to a <code>Mesh</code>.
 * You should call the <code>release</code> method when the trail is no longer required.
 * </p>
 *
 * @example
 *     // The trail is constructed, at any time, on an existing mesh.
 *     const trail = new EIGHT.Trail(mesh)
 *
 *     // Configure the Trail object, or use the defaults.
 *     trail.config.enabled = true
 *     trail.config.interval = 30
 *     trail.config.retain = 5
 *
 *     // Take a snapshot of the ball position and attitude, usually each animation frame.
 *     trail.snapshot()
 *
 *     // Draw the trail during the animation frame.
 *     trail.draw(ambients)
 *
 *     // Release the trail when no longer required, usually in the window.onunload function.
 *     trail.release()
 *
 * @class Trail
 * @extends ShareableBase
 */
export default class Trail extends ShareableBase {

  /**
   * The underlying Mesh.
   *
   * @property mesh
   * @type Mesh
   * @private
   */
  private mesh: Mesh

  /**
   * The position history.
   *
   * @property Xs
   * @type {Geometric3[]}
   * @private
   */
  private Xs: Geometric3[] = []

  /**
   * The attitude history.
   *
   * @property Rs
   * @type {Geometric3[]}
   * @private
   */
  private Rs: Geometric3[] = []

  /**
   * The configuration that determines how the history is recorded.
   *
   * @property config
   * @type TrailConfig
   */
  public config: TrailConfig = new TrailConfig();

  /**
   * @property counter
   * @type number
   * @private
   */
  private counter = 0

  /**
   * @class Trail
   * @constructor
   * @param mesh {Mesh}
   * @param [level = 0]
   */
  constructor(mesh: Mesh, level = 0) {
    super('Trail', incLevel(level))
    mustBeObject('mesh', mesh)
    mesh.addRef()
    this.mesh = mesh
  }

  /**
   * @method destructor
   * @param level {number}
   * @return {void}
   * @protected
   */
  protected destructor(level: number): void {
    this.mesh.release()
    this.mesh = void 0
    super.destructor(incLevel(level))
  }

  /**
   * Erases the trail history.
   *
   * @method erase
   * @return {void}
   */
  erase(): void {
    this.Xs = []
    this.Rs = []
  }

  /**
   * Records the Mesh variables according to the interval property.
   *
   * @method snapshot()
   * @return {void}
   */
  snapshot(): void {
    if (this.config.enabled) {
      if (this.counter % this.config.interval === 0) {
        this.Xs.unshift(this.mesh.position.clone())
        this.Rs.unshift(this.mesh.attitude.clone())
      }
      while (this.Xs.length > this.config.retain) {
        this.Xs.pop()
        this.Rs.pop()
      }
      this.counter++
    }
  }

  /**
   * @method draw
   * @param ambients {Facet[]}
   * @return {void}
   */
  draw(ambients: Facet[]): void {
    if (this.config.enabled) {
      // Save the mesh position and attitude so that we can restore them later.
      const X = this.mesh.position.clone()
      const R = this.mesh.attitude.clone()
      const iLength: number = this.Xs.length
      for (let i = 0; i < iLength; i++) {
        this.mesh.position.copyVector(this.Xs[i])
        this.mesh.attitude.copySpinor(this.Rs[i])
        this.mesh.draw(ambients)
      }
      // Restore the mesh position and attitude.
      this.mesh.position.copy(X)
      this.mesh.attitude.copy(R)
    }
  }
}
