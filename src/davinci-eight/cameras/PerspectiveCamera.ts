import IContextProvider from '../core/IContextProvider';
import ShareableWebGLProgram from '../core/ShareableWebGLProgram';
import createPerspective from '../cameras/createPerspective';
import readOnly from '../i18n/readOnly';
import mustBeObject from '../checks/mustBeObject';
import mustBeNumber from '../checks/mustBeNumber';
import mustBeString from '../checks/mustBeString';
import Perspective from '../cameras/Perspective';
import Shareable from '../core/Shareable';
import Facet from '../core/Facet';
import FacetVisitor from '../core/FacetVisitor';
import R3 from '../math/R3';
import VectorE3 from '../math/VectorE3';

/**
 * @class PerspectiveCamera
 */
export default class PerspectiveCamera extends Shareable implements Perspective, Facet {
    /**
     * The name of the property that designates the position.
     * @property PROP_POSITION
     * @type {string}
     * @default 'X'
     * @static
     * @readOnly
     */
    public static PROP_POSITION = 'X';
    public static PROP_EYE = 'eye';

    /**
     * @property material
     * @type {ShareableWebGLProgram}
     */
    public material: ShareableWebGLProgram;

    /**
     * @property name
     * @type {string}
     * @optional
     */
    public name: string;

    /**
     * @property inner
     * @type {Perspective}
     * @private
     */
    private inner: Perspective;

    /**
     * @class PerspectiveCamera
     * @constructor
     * @param [fov = 45 * Math.PI / 180] {number}
     * @param [aspect=1] {number}
     * @param [near=0.1] {number}
     * @param [far=2000] {number}
     * @example
     *   var camera = new EIGHT.PerspectiveCamera()
     *   camera.setAspect(canvas.clientWidth / canvas.clientHeight)
     *   camera.setFov(3.0 * e3)
     */
    constructor(fov = 45 * Math.PI / 180, aspect = 1, near = 0.1, far = 2000) {
        super('PerspectiveCamera');
        mustBeNumber('fov', fov);
        mustBeNumber('aspect', aspect);
        mustBeNumber('near', near);
        mustBeNumber('far', far);
        this.inner = createPerspective({ fov: fov, aspect: aspect, near: near, far: far });
    }

    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void {
        // Do nothing.
    }

    /**
     * @method setUniforms
     * @param visitor {FacetVisitor}
     * @return {void}
     */
    setUniforms(visitor: FacetVisitor): void {
        this.inner.setNear(this.near);
        this.inner.setFar(this.far);
        this.inner.setUniforms(visitor);
    }

    /**
     * @method contextFree
     * @param manager {IContextProvider}
     * @return {void}
     */
    contextFree(manager: IContextProvider): void {
        // Do nothing
    }

    /**
     * @method contextGain
     * @param manager {IContextProvider}
     * @return {void}
     */
    contextGain(manager: IContextProvider): void {
        // Do nothing
    }

    /**
     * @method contextLost
     * @return {void}
     */
    contextLost(): void {
        // Do nothing.
    }

    /**
     * @method draw
     * @return {void}
     */
    draw(): void {
        // Do nothing.
    }

    /**
     * @method getProperty
     * @param name {string}
     * @return {number[]}
     */
    getProperty(name: string): number[] {
        mustBeString('name', name);
        switch (name) {
            case PerspectiveCamera.PROP_EYE:
            case PerspectiveCamera.PROP_POSITION: {
                return this.eye.coords;
            }
            break;
            default: {
                // TODO
            }
        }
    }

    /**
     * @method setProperty
     * @param name {string}
     * @param value {number[]}
     * @return {PerspectiveCamera}
     * @chainable
     */
    setProperty(name: string, value: number[]): PerspectiveCamera {
        mustBeString('name', name);
        mustBeObject('value', value);
        switch (name) {
            case PerspectiveCamera.PROP_EYE:
            case PerspectiveCamera.PROP_POSITION: {
                this.eye.copyCoordinates(value);
            }
            break;
            default: {
                // TODO
            }
        }
        return this;
    }

    /**
     * The aspect ratio (width / height) of the camera viewport.
     * @property aspect
     * @type {number}
     * @readOnly
     */
    get aspect(): number {
        return this.inner.aspect;
    }

    /**
     * @method setAspect
     * @param aspect {number}
     * @return {PerspectiveCamera} `this` instance without incrementing the reference count.
     * @chainable
     */
    setAspect(aspect: number): PerspectiveCamera {
        this.inner.aspect = aspect;
        return this;
    }

    /**
     * The position of the camera.
     * @property eye
     * @type {R3}
     * @readOnly
     */
    get eye(): R3 {
        return this.inner.eye;
    }
    set eye(eye: R3) {
        this.inner.eye.copy(eye);
    }

    /**
     * @method setEye
     * @param eye {VectorE3}
     * @return {PerspectiveCamera} `this` instance without incrementing the reference count.
     * @chainable
     */
    setEye(eye: VectorE3): PerspectiveCamera {
        this.inner.setEye(eye);
        return this;
    }

    /**
     * The field of view is the (planar) angle (magnitude) in the camera horizontal plane that encloses object that can be seen.
     * Measured in radians.
     * @property fov
     * @type {number}
     * @readOnly
     */
    // TODO: Field of view could be specified as an Aspect + Magnitude of a SpinG3!?
    get fov(): number {
        return this.inner.fov;
    }
    set fov(unused: number) {
        throw new Error(readOnly('fov').message);
    }
    /**
     * @method setFov
     * @param fov {number}
     * @return {PerspectiveCamera} `this` instance without incrementing the reference count.
     * @chainable
     */
    setFov(fov: number): PerspectiveCamera {
        mustBeNumber('fov', fov);
        this.inner.fov = fov;
        return this;
    }

    get look(): R3 {
        return this.inner.look;
    }
    setLook(look: VectorE3): PerspectiveCamera {
        this.inner.setLook(look);
        return this;
    }

    /**
     * The distance to the near plane.
     * @property near
     * @type {number}
     * @readOnly
     */
    get near(): number {
        return this.inner.near;
    }
    set near(unused) {
        throw new Error(readOnly('near').message);
    }

    /**
     * @method setNear
     * @param near {number}
     * @return {PerspectiveCamera} <p><code>this</code> instance, <em>without incrementing the reference count</em>.</p>
     * @chainable
     */
    setNear(near: number): PerspectiveCamera {
        this.inner.setNear(near);
        return this;
    }

    get far(): number {
        return this.inner.far;
    }
    set far(far: number) {
        this.inner.far = far;
    }

    setFar(far: number): PerspectiveCamera {
        this.inner.setFar(far);
        return this;
    }

    get up(): R3 {
        return this.inner.up;
    }
    set up(unused) {
        throw new Error(readOnly('up').message);
    }

    setUp(up: VectorE3): PerspectiveCamera {
        this.inner.setUp(up);
        return this;
    }
}
