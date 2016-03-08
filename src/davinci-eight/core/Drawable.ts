import ContextProvider from '../core/ContextProvider';
import Engine from '../core/Engine';
import incLevel from '../base/incLevel';
import mustBeBoolean from '../checks/mustBeBoolean';
import Geometry from './Geometry';
import AbstractDrawable from './AbstractDrawable';
import AbstractMaterial from './AbstractMaterial';
import ShareableContextConsumer from '../core/ShareableContextConsumer';
import Facet from '../core/Facet';

/**
 * @module EIGHT
 * @submodule core
 */

/**
 * <p>
 * This class may be used as either a base class or standalone. 
 * </p>
 *
 * @class Drawable
 * @extends ShareableContextConsumer
 * @extends AbstractDrawable
 */
export default class Drawable extends ShareableContextConsumer implements AbstractDrawable {

  /**
   * @property _geometry
   * @type {Geometry}
   * @private
   */
  private _geometry: Geometry

  /**
   * @property _material
   * @type {AbstractMaterial}
   * @private
   */
  private _material: AbstractMaterial

  /**
   * @property name
   * @type {string}
   * @optional
   */
  public name: string

  /**
   * @property _visible
   * @type boolean
   * @private
   */
  private _visible = true

  /**
   * @property _facets
   * @private
   */
  private _facets: { [name: string]: Facet }

  /**
   * @class Drawable
   * @constructor
   * @param type {string}
   * @param geometry {Geometry}
   * @param material {AbstractMaterial}
   * @param engine {Engine} The <code>Engine</code> to subscribe to or <code>null</code> for deferred subscription.
   * @param level {number}
   */
  constructor(type: string, geometry: Geometry, material: AbstractMaterial, engine: Engine, level: number) {
    super(type, engine, incLevel(level))
    this.geometry = geometry
    this.material = material
    this._facets = {}
    if (level === 0) {
      this.synchUp()
    }
  }

  /**
   * @method destructor
   * @param level {number}
   * @return {void}
   * @protected
   */
  protected destructor(level: number): void {
    if (level === 0) {
      this.cleanUp()
    }
    this._geometry.release()
    this._geometry = void 0
    this._material.release()
    this._material = void 0
    super.destructor(incLevel(level))
  }

  /**
   * @property fragmentShaderSrc
   * @type string
   */
  get fragmentShaderSrc() {
    if (this._material) {
      return this._material.fragmentShaderSrc
    }
    else {
      return void 0
    }

  }
  set fragmentShaderSrc(fragmentShaderSrc: string) {
    if (this._material) {
      this._material.fragmentShaderSrc = fragmentShaderSrc
    }
    else {
      throw new Error(`Unable to set fragmentShaderSrc because ${this._type}.material is not defined.`)
    }
  }

  /**
   * @property vertexShaderSrc
   * @type string
   */
  get vertexShaderSrc() {
    if (this._material) {
      return this._material.vertexShaderSrc
    }
    else {
      return void 0
    }

  }
  set vertexShaderSrc(vertexShaderSrc: string) {
    if (this._material) {
      this._material.vertexShaderSrc = vertexShaderSrc
    }
    else {
      throw new Error(`Unableto  set vertexShaderSrc because ${this._type}.material is not defined.`)
    }
  }

  /**
   * @method setUniforms
   * @return {void}
   */
  setUniforms(): void {
    const material = this._material
    const facets = this._facets
    // FIXME: Temporary object creation?
    const keys = Object.keys(facets)
    const keysLength = keys.length
    for (let i = 0; i < keysLength; i++) {
      const key = keys[i]
      const facet = facets[key]
      facet.setUniforms(material)
    }
  }

  /**
   * @method draw
   * @param ambients {Facet[]}
   * @return {void}
   */
  draw(ambients: Facet[]): void {
    if (this._visible) {
      const material = this._material;

      material.use();

      const iL = ambients.length;
      for (let i = 0; i < iL; i++) {
        const facet = ambients[i]
        facet.setUniforms(material)
      }

      this.setUniforms();

      this._geometry.draw(material)
    }
  }

  /**
   * @method contextFree
   * @param context {ContextProvider}
   * @return {void}
   */
  contextFree(context: ContextProvider): void {
    this._geometry.contextFree(context)
    this._material.contextFree(context)
    super.contextFree(context)
  }

  /**
   * @method contextGain
   * @param context {ContextProvider}
   * @return {void}
   */
  contextGain(context: ContextProvider): void {
    this._geometry.contextGain(context)
    this._material.contextGain(context)
    super.contextGain(context)
  }

  /**
   * @method contextLost
   * @return {void}
   */
  contextLost(): void {
    this._geometry.contextLost()
    this._material.contextLost()
    super.contextLost()
  }

  /**
   * @method getFacet
   * @param name {string}
   * @return {Facet}
   */
  getFacet(name: string): Facet {
    return this._facets[name]
  }

  /**
   * @method setFacet
   * @param name {string}
   * @param facet {Facet}
   * @return {void}
   */
  setFacet(name: string, facet: Facet): void {
    this._facets[name] = facet
  }

  /**
   * Provides a reference counted reference to the graphics buffers property.
   *
   * @property geometry
   * @type {Geometry}
   */
  get geometry(): Geometry {
    this._geometry.addRef()
    return this._geometry
  }
  set geometry(geometry: Geometry) {
    if (this._geometry) {
      this._geometry.release()
      this._geometry = void 0
    }
    if (geometry) {
      geometry.addRef()
      this._geometry = geometry
      if (this.contextProvider) {
        this._geometry.contextGain(this.contextProvider)
      }
    }
  }

  /**
   * Provides a reference counted reference to the graphics program property.
   *
   * @property material
   * @type {AbstractMaterial}
   */
  get material(): AbstractMaterial {
    this._material.addRef()
    return this._material
  }
  set material(material: AbstractMaterial) {
    if (this._material) {
      this._material.release()
      this._material = void 0
    }
    if (material) {
      material.addRef()
      this._material = material
      if (this.contextProvider) {
        this._material.contextGain(this.contextProvider)
      }
    }
  }

  /**
   * @property visible
   * @type boolean
   * @default true
   */
  get visible(): boolean {
    return this._visible
  }
  set visible(visible: boolean) {
    mustBeBoolean('visible', visible, () => { return this._type })
    this._visible = visible
  }
}
