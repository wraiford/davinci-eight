/**
 * Returns the WebGLRenderingContext given a canvas.
 * canvas
 * attributes
 * If the canvas is undefined then an undefined value is returned for the context.
 */
declare function initWebGL(canvas: HTMLCanvasElement, attributes?: WebGLContextAttributes): WebGLRenderingContext;
export = initWebGL;
