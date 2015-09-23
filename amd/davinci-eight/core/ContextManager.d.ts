import ContextUnique = require('../core/ContextUnique');
import GeometryData = require('../dfx/GeometryData');
import IBuffer = require('../core/IBuffer');
import IBufferGeometry = require('../dfx/IBufferGeometry');
import ITexture2D = require('../core/ITexture2D');
import ITextureCubeMap = require('../core/ITextureCubeMap');
import IUnknown = require('../core/IUnknown');
/**
 * @class ContextManager
 * @extends ContextUnique
 * @extends IUnknown
 */
interface ContextManager extends ContextUnique, IUnknown {
    clearColor(red: number, green: number, blue: number, alpha: number): void;
    clearDepth(depth: number): void;
    createArrayBuffer(): IBuffer;
    createElementArrayBuffer(): IBuffer;
    createBufferGeometry(elements: GeometryData, mode?: number, usage?: number): IBufferGeometry;
    createTexture2D(): ITexture2D;
    createTextureCubeMap(): ITextureCubeMap;
    drawArrays(mode: number, first: number, count: number): void;
    drawElements(mode: number, count: number, type: number, offset: number): void;
    depthFunc(func: number): void;
    enable(capability: number): void;
    gl: WebGLRenderingContext;
    /**
     * @property canvasElement
     * @type {HTMLCanvasElement}
     * @readOnly
     */
    canvasElement: HTMLCanvasElement;
    mirror: boolean;
}
export = ContextManager;