import Color from '../core/Color';
import AbstractColor from '../core/AbstractColor';
import Facet from '../core/Facet';
import FacetVisitor from '../core/FacetVisitor';
import mustBeArray from '../checks/mustBeArray';
import mustBeNumber from '../checks/mustBeNumber';
import mustBeObject from '../checks/mustBeObject';
import mustBeString from '../checks/mustBeString';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';

/**
 * @module EIGHT
 * @submodule facets
 */

const LOGGING_NAME = 'AmbientLight'

function contextBuilder() {
    return LOGGING_NAME
}

/**
 * Constructs a white light in the -e3 direction.
 * @class AmbientLight
 */
export default class AmbientLight implements Facet {
    /**
     * @property color
     * @type {Color}
     */
    public color: Color;

    /**
     * @class AmbientLight
     * @constructor
     */
    constructor(color: AbstractColor) {
        mustBeObject('color', color)
        // FIXME: Need some kind of locking for constants
        this.color = Color.white.clone()
        this.color.r = mustBeNumber('color.r', color.r)
        this.color.g = mustBeNumber('color.g', color.g)
        this.color.b = mustBeNumber('color.b', color.b)
    }

    getProperty(name: string): number[] {
        return void 0;
    }

    /**
     * @method setProperty
     * @param name {string}
     * @param value {number[]}
     * @return {AmbientLight}
     * @chainable
     */
    setProperty(name: string, value: number[]): AmbientLight {
        mustBeString('name', name, contextBuilder)
        mustBeArray('value', value, contextBuilder)
        return this
    }

    /**
     * @method setUniforms
     * @param visitor {FacetVisitor}
     * @return {void}
     */
    setUniforms(visitor: FacetVisitor): void {
        const color = this.color
        visitor.uniform3f(GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT, color.r, color.g, color.b)
    }
}
