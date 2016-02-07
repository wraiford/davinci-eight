import getAttribVarName from '../core/getAttribVarName';
import glslAttribType from '../programs/glslAttribType';
import mustBeInteger from '../checks/mustBeInteger';
import mustBeString from '../checks/mustBeString';
import Primitive from '../core/Primitive';
import SmartGraphicsProgram from '../materials/SmartGraphicsProgram';
import vColorRequired from '../programs/vColorRequired';
import vLightRequired from '../programs/vLightRequired';
import fragmentShader from '../programs/fragmentShader';
import vertexShader from '../programs/vertexShader';

function computeAttribParams(values: { [key: string]: { size: number, name?: string } }) {
    const result: { [key: string]: { glslType: string, name?: string } } = {}
    const keys = Object.keys(values)
    const keysLength = keys.length
    for (let i = 0; i < keysLength; i++) {
        const key = keys[i]
        const attribute = values[key]
        const size = mustBeInteger('size', attribute.size)
        const varName = getAttribVarName(attribute, key)
        result[varName] = { glslType: glslAttribType(key, size) }
    }
    return result
}

/**
 * @class GraphicsProgramBuilder
 */
export default class GraphicsProgramBuilder {

    /**
     * @property aMeta
     * @private
     */
    private aMeta: { [key: string]: { size: number; } } = {};

    /**
     * @property uParams
     * @private
     */
    private uParams: { [key: string]: { glslType: string; name?: string } } = {};

    /**
     * Constructs the <code>GraphicsProgramBuilder</code>.
     * The lifecycle for using this generator is
     * <ol>
     * <li>Create an instance of the <code>GraphicsProgramBuilder.</code></li>
     * <li>Make calls to the <code>attribute</code> and/or <code>uniform</code> methods in any order.</li>
     * <li>Call the <code>build</code> method to create the <code>GraphicsProgram</code>.</li>
     * </ol>
     * The same builder instance may be reused to create other programs.
     * @class GraphicsProgramBuilder
     * @constructor
     * @param [primitive] {Primitive}
     */
    constructor(primitive?: Primitive) {
        if (primitive) {
            const attributes = primitive.attributes
            const keys = Object.keys(attributes)
            for (var i = 0, iLength = keys.length; i < iLength; i++) {
                const key = keys[i]
                const attribute = attributes[key]
                this.attribute(key, attribute.size)
            }
        }
    }

    /**
     * Declares that the material should have an `attribute` with the specified name and size.
     * @method attribute
     * @param name {string}
     * @param size {number}
     * @return {GraphicsProgramBuilder}
     * @chainable
     */
    public attribute(name: string, size: number): GraphicsProgramBuilder {
        mustBeString('name', name)
        mustBeInteger('size', size)
        this.aMeta[name] = { size: size }
        return this
    }

    /**
     * Declares that the material should have a `uniform` with the specified name and type.
     * @method uniform
     * @param name {string}
     * @param type {string} The GLSL type. e.g. 'float', 'vec3', 'mat2'
     * @return {GraphicsProgramBuilder}
     * @chainable
     */
    public uniform(name: string, type: string): GraphicsProgramBuilder {
        mustBeString('name', name)
        mustBeString('type', type)  // TODO: Must also be a valid GLSL uniform type.
        this.uParams[name] = { glslType: type }
        return this
    }

    /**
     * Creates a GraphicsProgram. This may contain multiple <code>WebGLProgram</code>(s),
     * one for each context supplied. The generated program is compiled and linked
     * for each context in response to context gain and loss events.
     * @method build
     * @return {SmartGraphicsProgram}
     */
    public build(): SmartGraphicsProgram {
        // FIXME: Push this calculation down into the functions.
        // Then the data structures are based on size.
        // uniforms based on numeric type?
        const aParams = computeAttribParams(this.aMeta)
        const vColor = vColorRequired(aParams, this.uParams)
        const vLight = vLightRequired(aParams, this.uParams)
        return new SmartGraphicsProgram(aParams, this.uParams, vColor, vLight)
    }

    public vertexShader(): string {
        const aParams = computeAttribParams(this.aMeta)
        const vColor = vColorRequired(aParams, this.uParams)
        const vLight = vLightRequired(aParams, this.uParams)
        return vertexShader(aParams, this.uParams, vColor, vLight)
    }

    public fragmentShader(): string {
        const aParams = computeAttribParams(this.aMeta)
        const vColor = vColorRequired(aParams, this.uParams)
        const vLight = vLightRequired(aParams, this.uParams)
        return fragmentShader(aParams, this.uParams, vColor, vLight)
    }
}