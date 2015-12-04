import Capability = require('../commands/Capability');
import ContextController = require('../core/ContextController');
import IContextProvider = require('../core/IContextProvider');
import IContextMonitor = require('../core/IContextMonitor');
import IContextConsumer = require('../core/IContextConsumer');
import IContextRenderer = require('../renderers/IContextRenderer');
import IBuffer = require('../core/IBuffer');
import IContextCommand = require('../core/IContextCommand');
import IBufferGeometry = require('../geometries/IBufferGeometry');
import ITexture2D = require('../core/ITexture2D');
import ITextureCubeMap = require('../core/ITextureCubeMap');
import IUnknownArray = require('../collections/IUnknownArray');
import Primitive = require('../geometries/Primitive');
import Shareable = require('../utils/Shareable');
/**
 * @class GraphicsContext
 * @extends Shareable
 */
declare class GraphicsContext extends Shareable implements ContextController, IContextProvider, IContextMonitor, IContextRenderer {
    /**
     * @property _kahuna
     * @type {ContextKahuna}
     * @private
     */
    private _kahuna;
    /**
     * @property _renderer
     * @type {IContextRenderer}
     * @private
     */
    private _renderer;
    /**
     * @class GraphicsContext
     * @constructor
     * @param [attributes] {WebGLContextAttributes} Allow the context to be configured.
     * @beta
     */
    constructor(attributes?: WebGLContextAttributes);
    /**
     * @method destructor
     * return {void}
     * @protected
     */
    protected destructor(): void;
    /**
     * @method addContextListener
     * @param user {IContextConsumer}
     * @return {void}
     */
    addContextListener(user: IContextConsumer): void;
    /**
     * @property canvas
     * @type {HTMLCanvasElement}
     */
    canvas: HTMLCanvasElement;
    /**
     * @property canvasId
     * @type {number}
     * @readOnly
     */
    canvasId: number;
    /**
     * @property commands
     * @type {IUnknownArray}
     * @beta
     * @readOnly
     */
    commands: IUnknownArray<IContextCommand>;
    /**
     * <p>
     * Specifies color values to use by the <code>clear</code> method to clear the color buffer.
     * <p>
     * @method clearColor
     * @param red {number}
     * @param green {number}
     * @param blue {number}
     * @param alpha {number}
     * @return {GraphicsContext}
     * @chainable
     */
    clearColor(red: number, green: number, blue: number, alpha: number): GraphicsContext;
    /**
     * @method contextFree
     * @param [canvasId] {number}
     * @return {void}
     */
    contextFree(canvasId?: number): void;
    /**
     * @method contextGain
     * @param manager {IContextProvider}
     * @return {void}
     */
    contextGain(manager: IContextProvider): void;
    /**
     * @method contextLost
     * @param [canvasId] {number}
     * @return {void}
     */
    contextLost(canvasId?: number): void;
    /**
     * @method createArrayBuffer
     * @return {IBuffer}
     */
    createArrayBuffer(): IBuffer;
    /**
     * @method createBufferGeometry
     * @param primitive {Primitive}
     * @param [usage] {number}
     * @return {IBufferGeometry}
     */
    createBufferGeometry(primitive: Primitive, usage?: number): IBufferGeometry;
    /**
     * @method createElementArrayBuffer
     * @return {IBuffer}
     */
    createElementArrayBuffer(): IBuffer;
    /**
     * @method createTextureCubeMap
     * @return {ITextureCubeMap}
     */
    createTextureCubeMap(): ITextureCubeMap;
    /**
     * @method createTexture2D
     * @return {ITexture2D}
     */
    createTexture2D(): ITexture2D;
    /**
     * Turns off specific WebGL capabilities for this context.
     * @method disable
     * @param capability {Capability}
     * @return {GraphicsContext}
     * @chainable
     */
    disable(capability: Capability): GraphicsContext;
    /**
     * Turns on specific WebGL capabilities for this context.
     * @method enable
     * @param capability {Capability}
     * @return {GraphicsContext}
     * @chainable
     */
    enable(capability: Capability): GraphicsContext;
    /**
     * @property gl
     * @type {WebGLRenderingContext}
     * @readOnly
     */
    gl: WebGLRenderingContext;
    /**
     * @method removeContextListener
     * @param user {IContextConsumer}
     * @return {void}
     */
    removeContextListener(user: IContextConsumer): void;
    /**
     * Defines what part of the canvas will be used in rendering the drawing buffer.
     * @method viewport
     * @param x {number}
     * @param y {number}
     * @param width {number}
     * @param height {number}
     * @return {GraphicsContext}
     * @chainable
     */
    viewport(x: number, y: number, width: number, height: number): GraphicsContext;
    /**
     * Initializes the WebGL context for the specified <code>canvas</code>.
     * @method start
     * @param canvas {HTMLCanvasElement} The HTML canvas element.
     * @param [canvasId] {number} An optional user-defined alias for the canvas when using multi-canvas.
     * @return {GraphicsContext}
     * @chainable
     */
    start(canvas: HTMLCanvasElement, canvasId?: number): GraphicsContext;
    /**
     * @method stop
     * @return {GraphicsContext}
     * @chainable
     */
    stop(): GraphicsContext;
    /**
     * @method synchronize
     * @param user {IContextConsumer}
     * @return {void}
     */
    synchronize(user: IContextConsumer): void;
}
export = GraphicsContext;
