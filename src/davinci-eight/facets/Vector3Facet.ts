import Facet from '../core/Facet';
import FacetVisitor from '../core/FacetVisitor';
import mustBeObject from '../checks/mustBeObject';
import mustBeString from '../checks/mustBeString';
import Shareable from '../utils/Shareable';
import R3 from '../math/R3';

var LOGGING_NAME = 'Vector3Facet'

function contextBuilder() {
    return LOGGING_NAME
}

/**
 * @class Vector3Facet
 */
export default class Vector3Facet extends Shareable implements Facet {
    private _name: string;
    private _vector: R3;
    /**
     * @class Vector3Facet
     * @constructor
     * @param name {string}
     * @param vector {R3}
     */
    constructor(name: string, vector: R3) {
        super('Vector3Facet')
        this._name = mustBeString('name', name, contextBuilder)
        this._vector = mustBeObject('vector', vector, contextBuilder)
    }
    protected destructor(): void {
        super.destructor()
    }
    getProperty(name: string): number[] {
        return void 0;
    }
    setProperty(name: string, value: number[]): void {
    }
    setUniforms(visitor: FacetVisitor, canvasId?: number): void {
        visitor.vec3(this._name, this._vector, canvasId)
    }
}
