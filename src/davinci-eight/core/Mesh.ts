import { canonicalAxis, canonicalMeridian } from '../core/tiltFromOptions';
import { Color } from './Color';
import { ColorFacet } from '../facets/ColorFacet';
import ContextManager from './ContextManager';
import { Drawable } from './Drawable';
import { Geometric3 } from '../math/Geometric3';
import { Geometry } from './Geometry';
import { Material } from './Material';
import AbstractMesh from '../core/AbstractMesh';
import Matrix4 from '../math/Matrix4';
import MeshOptions from './MeshOptions';
import { ModelFacet } from '../facets/ModelFacet';
import notSupported from '../i18n/notSupported';
import quadVectorE3 from '../math/quadVectorE3';
import { R3, vectorCopy } from '../math/R3';
import referenceAxis from './referenceAxis';
import referenceMeridian from './referenceMeridian';
import Spinor3 from '../math/Spinor3';
import Texture from './Texture';
import TextureFacet from '../facets/TextureFacet';
import vec from '../math/R3';
import VectorE3 from '../math/VectorE3';

const COLOR_FACET_NAME = 'color';
const TEXTURE_FACET_NAME = 'image';
const MODEL_FACET_NAME = 'model';

/**
 * The standard pairing of a Geometry and a Material.
 */
export class Mesh<G extends Geometry, M extends Material> extends Drawable<G, M> implements AbstractMesh<G, M> {
    /**
     * The reference frame axis.
     */
    public readonly referenceAxis: R3;
    /**
     * The reference frame meridian.
     */
    public readonly referenceMeridian: R3;
    /**
     * Scratch variable for intermediate calculation value.
     * This can probably be raised to a module level constant.
     */
    private readonly canonicalScale = Matrix4.one();
    /**
     * The rotation matrix equivalent to the initial tilt spinor.
     */
    private readonly K: Matrix4;
    /**
     * The (cached) inverse of K.
     */
    private readonly Kinv: Matrix4;

    /**
     * Cached value that tells you whether the K matrix is unity.
     */
    private readonly Kidentity: boolean;
    /**
     * Initializes this Mesh with a ColorFacet ('color'), a TextureFacet ('image'), and a ModelFacet ('model').
     * 
     * @param geometry An optional Geometry, which may be supplied later.
     * @param material An optional Material, which may be supplied later.
     * @param contextManager
     * @param options
     * @param levelUp The zero-based level of this instance in an inheritance hierarchy. 
     */
    constructor(geometry: G, material: M, contextManager: ContextManager, options: MeshOptions = {}, levelUp = 0) {
        super(geometry, material, contextManager, levelUp + 1);
        this.setLoggingName('Mesh');

        this.setFacet(COLOR_FACET_NAME, new ColorFacet());

        const textureFacet = new TextureFacet();
        this.setFacet(TEXTURE_FACET_NAME, textureFacet);
        textureFacet.release();

        this.setFacet(MODEL_FACET_NAME, new ModelFacet());

        this.referenceAxis = referenceAxis(options, canonicalAxis).direction();
        this.referenceMeridian = referenceMeridian(options, canonicalMeridian).direction();

        const tilt = Geometric3.rotorFromFrameToFrame([canonicalAxis, canonicalMeridian, canonicalAxis.cross(canonicalMeridian)], [this.referenceAxis, this.referenceMeridian, this.referenceAxis.cross(this.referenceMeridian)]);
        if (tilt && !Spinor3.isOne(tilt)) {
            this.Kidentity = false;
            this.K = Matrix4.one();
            this.K.rotation(tilt);
            this.Kinv = Matrix4.one();
            this.Kinv.copy(this.K).inv();
        }
        else {
            this.Kidentity = true;
        }

        if (levelUp === 0) {
            this.synchUp();
        }
    }

    /**
     * 
     */
    protected destructor(levelUp: number): void {
        if (levelUp === 0) {
            this.cleanUp();
        }
        super.destructor(levelUp + 1);
    }

    /**
     * Attitude (spinor). This is an alias for the R property.
     */
    get attitude(): Geometric3 {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME);
        if (facet) {
            return facet.R;
        }
        else {
            throw new Error(notSupported(MODEL_FACET_NAME).message);
        }
    }
    set attitude(spinor: Geometric3) {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME);
        if (facet) {
            facet.R.copySpinor(spinor);
        }
        else {
            throw new Error(notSupported(MODEL_FACET_NAME).message);
        }
    }

    /**
     * Attitude (spinor). This is an alias for the attitude property.
     */
    get R(): Geometric3 {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME);
        if (facet) {
            return facet.R;
        }
        else {
            throw new Error(notSupported(MODEL_FACET_NAME).message);
        }
    }
    set R(spinor: Geometric3) {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME);
        if (facet) {
            facet.R.copySpinor(spinor);
        }
        else {
            throw new Error(notSupported(MODEL_FACET_NAME).message);
        }
    }

    /**
     * Color
     */
    get color(): Color {
        const facet = <ColorFacet>this.getFacet(COLOR_FACET_NAME);
        if (facet) {
            return facet.color;
        }
        else {
            throw new Error(notSupported(COLOR_FACET_NAME).message);
        }
    }
    set color(color: Color) {
        const facet = <ColorFacet>this.getFacet(COLOR_FACET_NAME);
        if (facet) {
            facet.color.copy(color);
        }
        else {
            throw new Error(notSupported(COLOR_FACET_NAME).message);
        }
    }

    /**
     * The red coordinate of the color property.
     */
    get red(): number {
        return this.color.red;
    }
    set red(red: number) {
        this.color.red = red;
    }

    /**
     * The green coordinate of the color property.
     */
    get green(): number {
        return this.color.green;
    }
    set green(green: number) {
        this.color.green = green;
    }

    /**
     * The blue coordinate of the color property.
     */
    get blue(): number {
        return this.color.red;
    }
    set blue(blue: number) {
        this.color.blue = blue;
    }

    /**
     * Texture (image).
     */
    get texture(): Texture {
        const facet = <TextureFacet>this.getFacet(TEXTURE_FACET_NAME);
        if (facet) {
            const texture = facet.texture;
            facet.release();
            return texture;
        }
        else {
            throw new Error(notSupported(TEXTURE_FACET_NAME).message);
        }
    }
    set texture(value: Texture) {
        const facet = <TextureFacet>this.getFacet(TEXTURE_FACET_NAME);
        if (facet) {
            facet.texture = value;
            facet.release();
        }
        else {
            throw new Error(notSupported(TEXTURE_FACET_NAME).message);
        }
    }

    /**
     * Position (vector). This is an alias for the position property.
     */
    get X(): Geometric3 {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME);
        if (facet) {
            return facet.X;
        }
        else {
            throw new Error(notSupported(MODEL_FACET_NAME).message);
        }
    }
    set X(vector: Geometric3) {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME);
        if (facet) {
            facet.X.copyVector(vector);
        }
        else {
            throw new Error(notSupported(MODEL_FACET_NAME).message);
        }
    }

    /**
     * The x-coordinate of the position.
     */
    get x(): number {
        return this.position.x;
    }
    set x(x: number) {
        this.position.x = x;
    }

    /**
     * The y-coordinate of the position.
     */
    get y(): number {
        return this.position.y;
    }
    set y(y: number) {
        this.position.y = y;
    }

    /**
     * The z-coordinate of the position.
     */
    get z(): number {
        return this.position.z;
    }
    set z(z: number) {
        this.position.z = z;
    }

    /**
     * Position (vector). This is an alias for the X property.
     */
    get position(): Geometric3 {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME);
        if (facet) {
            return facet.X;
        }
        else {
            throw new Error(notSupported(MODEL_FACET_NAME).message);
        }
    }
    set position(vector: Geometric3) {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME);
        if (facet) {
            facet.X.copyVector(vector);
        }
        else {
            throw new Error(notSupported(MODEL_FACET_NAME).message);
        }
    }

    /**
     * Stress (tensor)
     */
    private get stress(): Matrix4 {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME);
        if (facet) {
            return facet.stress;
        }
        else {
            throw new Error(notSupported('stress').message);
        }
    }
    private set stress(stress: Matrix4) {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME);
        if (facet) {
            facet.stress.copy(stress);
        }
        else {
            throw new Error(notSupported('stress').message);
        }
    }

    private getScale(i: number, j: number): number {
        if (this.Kidentity) {
            const sMatrix = this.stress;
            return sMatrix.getElement(i, j);
        }
        else {
            const sMatrix = this.stress;
            const cMatrix = this.canonicalScale;
            cMatrix.copy(this.Kinv).mul(sMatrix).mul(this.K);
            return cMatrix.getElement(i, j);
        }
    }

    protected getScaleX(): number {
        return this.getScale(0, 0);
    }

    protected getScaleY(): number {
        return this.getScale(1, 1);
    }

    protected getScaleZ(): number {
        return this.getScale(2, 2);
    }

    /**
     * Implementations of setPrincipalScale are expected to call this method.
     */
    protected setScale(x: number, y: number, z: number): void {
        if (this.Kidentity) {
            const sMatrix = this.stress;
            const oldX = sMatrix.getElement(0, 0);
            const oldY = sMatrix.getElement(1, 1);
            const oldZ = sMatrix.getElement(2, 2);
            if (x !== oldX) {
                sMatrix.setElement(0, 0, x);
            }
            if (y !== oldY) {
                sMatrix.setElement(1, 1, y);
            }
            if (z !== oldZ) {
                sMatrix.setElement(2, 2, z);
            }
        }
        else {
            const sMatrix = this.stress;
            const cMatrix = this.canonicalScale;
            cMatrix.copy(this.Kinv).mul(sMatrix).mul(this.K);
            const oldX = cMatrix.getElement(0, 0);
            const oldY = cMatrix.getElement(1, 1);
            const oldZ = cMatrix.getElement(2, 2);
            let matrixChanged = false;
            if (x !== oldX) {
                cMatrix.setElement(0, 0, x);
                matrixChanged = true;
            }
            if (y !== oldY) {
                cMatrix.setElement(1, 1, y);
                matrixChanged = true;
            }
            if (z !== oldZ) {
                cMatrix.setElement(2, 2, z);
                matrixChanged = true;
            }
            if (matrixChanged) {
                sMatrix.copy(this.K).mul(cMatrix).mul(this.Kinv);
            }
        }
    }

    protected getAxis(): R3 {
        const axis = Geometric3.fromVector(this.referenceAxis);
        axis.rotate(this.attitude);
        return vec(axis.x, axis.y, axis.z);
    }

    /**
     * The current axis (unit vector) of the mesh.
     */
    get axis(): VectorE3 {
        return this.getAxis();
    }
    set axis(axis: VectorE3) {
        const L = Math.sqrt(quadVectorE3(axis));
        const x = axis.x / L;
        const y = axis.y / L;
        const z = axis.z / L;
        this.attitude.rotorFromDirections(this.referenceAxis, { x, y, z });
    }

    protected getMeridian(): R3 {
        const meridian = Geometric3.fromVector(this.referenceMeridian);
        meridian.rotate(this.attitude);
        return vec(meridian.x, meridian.y, meridian.z);
    }

    /**
     * The current meridian (unit vector) of the mesh.
     */
    get meridian(): VectorE3 {
        return this.getMeridian();
    }
    set meridian(value: VectorE3) {
        const meridian = vectorCopy(value).rejectionFrom(this.axis).direction();
        const B = Geometric3.dualOfVector(this.axis);
        const R = Geometric3.rotorFromVectorToVector(this.meridian, meridian, B);
        this.attitude.mul2(R, this.attitude);
    }

}

export default Mesh;
