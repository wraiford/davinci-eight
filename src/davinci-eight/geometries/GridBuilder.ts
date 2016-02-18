import VectorE3 from '../math/VectorE3';
import Simplex from '../geometries/Simplex';
import SimplexPrimitivesBuilder from '../geometries/SimplexPrimitivesBuilder';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import R2m from '../math/R2m';
import R3m from '../math/R3m';
import mustBeFunction from '../checks/mustBeFunction';
import mustBeInteger from '../checks/mustBeInteger';

export default class GridBuilder extends SimplexPrimitivesBuilder {
    constructor(parametricFunction: (u: number, v: number) => VectorE3, uSegments: number, vSegments: number) {
        super();
        mustBeFunction('parametricFunction', parametricFunction)
        mustBeInteger('uSegments', uSegments)
        mustBeInteger('vSegments', vSegments)
        /**
         * Temporary array of points.
         */
        let points: R3m[] = [];

        var i: number;
        var j: number;

        let sliceCount = uSegments + 1;

        for (i = 0; i <= vSegments; i++) {

            let v: number = i / vSegments;

            for (j = 0; j <= uSegments; j++) {

                let u: number = j / uSegments;

                let point: VectorE3 = parametricFunction(u, v);
                // Make a copy just in case the function is returning mutable references.
                points.push(R3m.copy(point));
            }
        }

        var a: number;
        var b: number;
        var c: number;
        var d: number;
        var uva: R2m;
        var uvb: R2m;
        var uvc: R2m;
        var uvd: R2m;

        for (i = 0; i < vSegments; i++) {

            for (j = 0; j < uSegments; j++) {

                a = i * sliceCount + j;
                b = i * sliceCount + j + 1;
                c = (i + 1) * sliceCount + j + 1;
                d = (i + 1) * sliceCount + j;

                uva = new R2m([j / uSegments, i / vSegments]);
                uvb = new R2m([(j + 1) / uSegments, i / vSegments]);
                uvc = new R2m([(j + 1) / uSegments, (i + 1) / vSegments]);
                uvd = new R2m([j / uSegments, (i + 1) / vSegments]);

                let simplex = new Simplex(Simplex.TRIANGLE)
                simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = points[a]
                simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_TEXTURE_COORDS] = uva
                simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = points[b]
                simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_TEXTURE_COORDS] = uvb
                simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = points[d]
                simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_TEXTURE_COORDS] = uvd
                this.data.push(simplex)

                simplex = new Simplex(Simplex.TRIANGLE)
                simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = points[b]
                simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_TEXTURE_COORDS] = uvb
                simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = points[c]
                simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_TEXTURE_COORDS] = uvc
                simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = points[d]
                simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_TEXTURE_COORDS] = uvd
                this.data.push(simplex)
            }
        }

        //    this.computeFaceNormals();
        //    this.computeVertexNormals();
    }
}
