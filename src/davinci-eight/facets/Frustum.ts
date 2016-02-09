import View from './View';
import VectorE3 from '../math/VectorE3';

/**
 * @class Frustum
 */
interface Frustum extends View {
    /**
     * @property left
     * @type number
     */
    left: number;
    /**
     * @property right
     * @type number
     */
    right: number;
    /**
     * @property bottom
     * @type number
     */
    bottom: number;
    /**
     * @property top
     * @type number
     */
    top: number;
    /**
     * @property near
     * @type number
     */
    near: number;
    /**
     * @property far
     * @type number
     */
    far: number;
    /**
     * Convenience method for setting the eye property allowing chainable method calls.
     * @method setEye
     * @param eye {VectorE3}
     */
    setEye(eye: VectorE3): Frustum;
    /**
     * Convenience method for setting the look property allowing chainable method calls.
     * @method setLook
     * @param look {VectorE3}
     */
    setLook(look: VectorE3): Frustum;
    /**
     * Convenience method for setting the up property allowing chainable method calls.
     * @method setUp
     * @param up {VectorE3}
     */
    setUp(up: VectorE3): Frustum;
}

export default Frustum;