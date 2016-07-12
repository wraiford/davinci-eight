import direction from './direction';
import CylinderGeometry from '../geometries/CylinderGeometry';
import CylinderGeometryOptions from '../geometries/CylinderGeometryOptions';
import CylinderOptions from './CylinderOptions';
import isDefined from '../checks/isDefined';
import {MeshMaterial} from '../materials/MeshMaterial';
import MeshMaterialOptions from '../materials/MeshMaterialOptions';
import mustBeNumber from '../checks/mustBeNumber';
import {RigidBody} from './RigidBody';

/**
 *
 */
export class Cylinder extends RigidBody {

    /**
     *
     * @param options
     */
    constructor(options: CylinderOptions = {}, levelUp = 0) {
        super(void 0, void 0, options.engine, direction(options), levelUp + 1);
        this.setLoggingName('Cylinder');
        // The shape is created un-stressed and then parameters drive the scaling.
        // The scaling matrix takes into account the initial tilt from the standard configuration.
        // const stress = Vector3.vector(1, 1, 1)

        const geoOptions: CylinderGeometryOptions = {};
        geoOptions.engine = options.engine;
        geoOptions.tilt = options.tilt;
        geoOptions.offset = options.offset;
        geoOptions.openCap = options.openCap;
        geoOptions.openBase = options.openBase;
        geoOptions.openWall = options.openWall;
        const geometry = new CylinderGeometry(geoOptions);
        this.geometry = geometry;
        geometry.release();

        const matOptions: MeshMaterialOptions = null;
        const material = new MeshMaterial(matOptions, options.engine);
        this.material = material;
        material.release();

        if (options.color) {
            this.color.copy(options.color);
        }
        if (options.position) {
            this.X.copyVector(options.position);
        }
        if (options.attitude) {
            this.R.copySpinor(options.attitude);
        }
        this.radius = isDefined(options.radius) ? mustBeNumber('radius', options.radius) : 0.5;
        this.length = isDefined(options.length) ? mustBeNumber('length', options.length) : 1.0;
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
     *
     * @default 1
     */
    get length() {
        return this.getPrincipalScale('length')
    }
    set length(length: number) {
        this.setPrincipalScale('length', length)
    }

    /**
     *
     */
    get radius(): number {
        return this.getPrincipalScale('radius')
    }
    set radius(radius: number) {
        this.setPrincipalScale('radius', radius)
    }
}
