import RenderingContextProgramUser = require('../core/RenderingContextProgramUser');
/**
 * Utility class for managing a shader attribute variable.
 * While this class may be created directly by the user, it is preferable
 * to use the AttribLocation instances managed by the ShaderProgram because
 * there will be improved integrity and context loss management.
 * @class AttribLocation.
 */
declare class AttribLocation implements RenderingContextProgramUser {
    private _name;
    private _size;
    private _type;
    private _location;
    private _context;
    /**
     * Convenience class that assists in the lifecycle management of an atrribute used in a vertex shader.
     * In particular, this class manages buffer allocation, location caching, and data binding.
     * @class AttribLocation
     * @constructor
     * @param name {string} The name of the variable as it appears in the GLSL program.
     * @param size {number} The size of the variable as it appears in the GLSL program.
     * @param type {number} The type of the variable as it appears in the GLSL program.
     */
    constructor(name: string, size: number, type: number);
    contextFree(): void;
    contextGain(context: WebGLRenderingContext, program: WebGLProgram): void;
    contextLoss(): void;
    /**
     * @method vertexPointer
     * @param size {number} The number of components per attribute. Must be 1,2,3, or 4.
     * @param normalized {boolean} Used for WebGLRenderingContext.vertexAttribPointer().
     * @param stride {number} Used for WebGLRenderingContext.vertexAttribPointer().
     * @param offset {number} Used for WebGLRenderingContext.vertexAttribPointer().
     */
    vertexPointer(size: number, normalized?: boolean, stride?: number, offset?: number): void;
    enable(): void;
    disable(): void;
    /**
     * @method toString
     */
    toString(): string;
}
export = AttribLocation;