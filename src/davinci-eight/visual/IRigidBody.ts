/**
 * Enforce naming (but not type) consistency between implementations.
 */
interface IRigidBody<MASS, MV> {
    attitude: MV
    mass: MASS
    momentum: MV
    position: MV
}

export default IRigidBody
