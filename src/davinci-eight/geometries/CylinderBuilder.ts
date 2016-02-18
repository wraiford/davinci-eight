import arc3 from '../geometries/arc3';
import VectorE3 from '../math/VectorE3';
import SliceSimplexPrimitivesBuilder from '../geometries/SliceSimplexPrimitivesBuilder';
import SpinG3m from '../math/SpinG3m';
import SpinorE3 from '../math/SpinorE3';
import R2m from '../math/R2m';
import R3m from '../math/R3m';

/**
 *
 */
function computeVertices(radius: number, height: number, axis: VectorE3, pos: VectorE3, start: VectorE3, angle: number, generator: SpinorE3, heightSegments: number, thetaSegments: number, points: R3m[], vertices: number[][], uvs: R2m[][]) {

    const begin = R3m.copy(start).scale(radius)
    const halfHeight = R3m.copy(axis).scale(0.5 * height)

    /**
     * A displacement in the direction of axis that we must move for each height step.
     */
    const stepH = R3m.copy(axis).direction().scale(height / heightSegments)

    for (let i = 0; i <= heightSegments; i++) {
        /**
         * The displacement to the current level.
         */
        const dispH = R3m.copy(stepH).scale(i).sub(halfHeight)
        const verticesRow: number[] = [];
        const uvsRow: R2m[] = [];
        /**
         * Interesting that the v coordinate is 1 at the base and 0 at the top!
         * This is because i originally went from top to bottom.
         */
        const v = (heightSegments - i) / heightSegments
        /**
         * arcPoints.length => thetaSegments + 1
         */
        const arcPoints = arc3(begin, angle, generator, thetaSegments)
        /**
         * j < arcPoints.length => j <= thetaSegments
         */
        for (let j = 0, jLength = arcPoints.length; j < jLength; j++) {
            const point = arcPoints[j].add(dispH).add(pos)
            /**
             * u will vary from 0 to 1, because j goes from 0 to thetaSegments
             */
            const u = j / thetaSegments;
            points.push(point);
            verticesRow.push(points.length - 1);
            uvsRow.push(new R2m([u, v]));
        }
        vertices.push(verticesRow);
        uvs.push(uvsRow);
    }

}

export default class CylinderBuilder extends SliceSimplexPrimitivesBuilder {
    public radius: number;
    public height: number;
    public openTop: boolean;
    public openBottom: boolean;
    constructor(axis: VectorE3) {
        super(axis, void 0, void 0);
        this.radius = 1;
        this.height = 1;
        this.openTop = false;
        this.openBottom = false;
        this.setModified(true);
    }
    public regenerate(): void {
        this.data = []
        const radius = this.radius
        const height = this.height
        const heightSegments = this.flatSegments
        const thetaSegments = this.curvedSegments
        const generator: SpinorE3 = SpinG3m.dual(this.axis)

        const heightHalf = height / 2;

        var points: R3m[] = [];
        // The double array allows us to manage the i,j indexing more naturally.
        // The alternative is to use an indexing function.
        let vertices: number[][] = [];
        let uvs: R2m[][] = [];

        computeVertices(radius, this.height, this.axis, this.position, this.sliceStart, this.sliceAngle, generator, heightSegments, thetaSegments, points, vertices, uvs)

        var na: R3m;
        var nb: R3m;
        // sides
        for (let j = 0; j < thetaSegments; j++) {
            if (radius !== 0) {
                na = R3m.copy(points[vertices[0][j]]);
                nb = R3m.copy(points[vertices[0][j + 1]]);
            }
            else {
                na = R3m.copy(points[vertices[1][j]]);
                nb = R3m.copy(points[vertices[1][j + 1]]);
            }
            // FIXME: This isn't geometric.
            na.setY(0).direction();
            nb.setY(0).direction();
            for (let i = 0; i < heightSegments; i++) {
                /**
                 *  2-------3
                 *  |       | 
                 *  |       |
                 *  |       |
                 *  1-------4
                 */
                let v1: number = vertices[i][j];
                let v2: number = vertices[i + 1][j];
                let v3: number = vertices[i + 1][j + 1];
                let v4: number = vertices[i][j + 1];
                // The normals for 1 and 2 are the same.
                // The normals for 3 and 4 are the same.
                let n1 = na.clone();
                let n2 = na.clone();
                let n3 = nb.clone();
                let n4 = nb.clone();
                let uv1 = uvs[i][j].clone();
                let uv2 = uvs[i + 1][j].clone();
                let uv3 = uvs[i + 1][j + 1].clone();
                let uv4 = uvs[i][j + 1].clone()
                this.triangle([points[v2], points[v1], points[v3]], [n2, n1, n3], [uv2, uv1, uv3])
                this.triangle([points[v4], points[v3], points[v1]], [n4, n3.clone(), n1.clone()], [uv4, uv3.clone(), uv1.clone()])
            }
        }

        // top cap
        if (!this.openTop && radius > 0) {
            // Push an extra point for the center of the top.
            points.push(R3m.copy(this.axis).scale(heightHalf).add(this.position));
            for (let j = 0; j < thetaSegments; j++) {
                let v1: number = vertices[heightSegments][j + 1];
                let v2: number = points.length - 1;
                let v3: number = vertices[heightSegments][j];
                let n1: R3m = R3m.copy(this.axis)
                let n2: R3m = R3m.copy(this.axis)
                let n3: R3m = R3m.copy(this.axis)
                let uv1: R2m = uvs[heightSegments][j + 1].clone();
                // Check this
                let uv2: R2m = new R2m([uv1.x, 1]);
                let uv3: R2m = uvs[heightSegments][j].clone();
                this.triangle([points[v1], points[v2], points[v3]], [n1, n2, n3], [uv1, uv2, uv3])
            }
        }

        // bottom cap
        if (!this.openBottom && radius > 0) {
            // Push an extra point for the center of the bottom.
            points.push(R3m.copy(this.axis).scale(-heightHalf).add(this.position))
            for (let j = 0; j < thetaSegments; j++) {
                let v1: number = vertices[0][j]
                let v2: number = points.length - 1
                let v3: number = vertices[0][j + 1]
                let n1: R3m = R3m.copy(this.axis).scale(-1)
                let n2: R3m = R3m.copy(this.axis).scale(-1)
                let n3: R3m = R3m.copy(this.axis).scale(-1)
                let uv1: R2m = uvs[0][j].clone()
                // TODO: Check this
                let uv2: R2m = new R2m([uv1.x, 1])
                let uv3: R2m = uvs[0][j + 1].clone()
                this.triangle([points[v1], points[v2], points[v3]], [n1, n2, n3], [uv1, uv2, uv3])
            }
        }
        this.setModified(false)
    }
}
