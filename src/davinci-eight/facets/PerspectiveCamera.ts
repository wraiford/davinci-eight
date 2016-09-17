import createPerspective from './createPerspective';
import {Geometric3} from '../math/Geometric3';
import mustBeGE from '../checks/mustBeGE';
import mustBeLE from '../checks/mustBeLE';
import mustBeNumber from '../checks/mustBeNumber';
import Perspective from './Perspective';
import {Facet} from '../core/Facet';
import {FacetVisitor} from '../core/FacetVisitor';

/**
 * <p>
 * The <code>PerspectiveCamera</code> provides projection matrix and view matrix uniforms to the
 * current <code>Material</code>.
 * </p>
 * <p>
 * The <code>PerspectiveCamera</code> plays the role of a host in the <em>Visitor</em> pattern.
 * The <code>FacetVistor</code> will normally be a <code>Material</code> implementation. The  accepting
 * method is called <code>setUniforms</code>.
 * <p>
 *
 *     const ambients: Facet[] = []
 *
 *     const camera = new EIGHT.PerspectiveCamera()
 *     camera.aspect = canvas.clientWidth / canvas.clientHeight
 *     camera.eye = Geometric3.copyVector(R3.e3)
 *     ambients.push(camera)
 *
 *     scene.draw(ambients)
 *
 * <p>The camera is initially positioned at <b>e</b><sub>3</sub>.</p>
 */
export class PerspectiveCamera implements Facet {
    /**
     *
     */
    private inner: Perspective;

    /**
     *
     * @param fov The field of view.
     * @param aspect The aspect is the ratio width / height.
     * @param near The distance of the near plane from the camera.
     * @param far The distance of the far plane from the camera. 
     */
    constructor(fov = 45 * Math.PI / 180, aspect = 1, near = 0.1, far = 1000) {

        mustBeNumber('fov', fov);
        mustBeGE('fov', fov, 0);
        mustBeLE('fov', fov, Math.PI);

        mustBeNumber('aspect', aspect);
        mustBeGE('aspect', aspect, 0);

        mustBeNumber('near', near);
        mustBeGE('near', near, 0);

        mustBeNumber('far', far);
        mustBeGE('far', far, 0);

        this.inner = createPerspective({ fov, aspect, near, far });
    }

    /**
     *
     */
    setUniforms(visitor: FacetVisitor): void {
        // Synchronize the near and far properties before delegating.
        this.inner.setNear(this.near);
        this.inner.setFar(this.far);
        this.inner.setUniforms(visitor);
    }

    /**
     * The aspect ratio (width / height) of the camera viewport.
     */
    get aspect(): number {
        return this.inner.aspect;
    }
    set aspect(aspect: number) {
        this.inner.aspect = aspect;
    }

    /**
     * The position of the camera, a vector.
     */
    get eye(): Geometric3 {
        return this.inner.eye;
    }
    set eye(eye: Geometric3) {
        this.inner.eye.copyVector(eye);
    }

    /**
     * The field of view is the (planar) angle (magnitude) in the camera horizontal plane that encloses object that can be seen.
     * Measured in radians.
     */
    get fov(): number {
        return this.inner.fov;
    }
    set fov(value: number) {
        this.inner.fov = value;
    }

    /**
     * The point that is being looked at.
     */
    get look(): Geometric3 {
        return this.inner.look;
    }
    set look(look: Geometric3) {
        this.inner.look.copyVector(look);
    }

    /**
     * The distance to the near plane.
     */
    get near(): number {
        return this.inner.near;
    }
    set near(near: number) {
        this.inner.near = near;
    }

    /**
     * The distance to the far plane.
     */
    get far(): number {
        return this.inner.far;
    }
    set far(far: number) {
        this.inner.far = far;
    }

    /**
     * The approximate up direction.
     */
    get up(): Geometric3 {
        return this.inner.up;
    }
    set up(up: Geometric3) {
        this.inner.up.copyVector(up);
    }
}
