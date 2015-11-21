import IContextCommand = require('../core/IContextCommand')
import IContextProvider = require('../core/IContextProvider')
import mustBeNumber = require('../checks/mustBeNumber')
import Shareable = require('../utils/Shareable')

var QUALIFIED_NAME = 'EIGHT.ContextAttributesLogger'

/**
 * <p>
 * Displays details about the WegGL version to the console.
 * <p> 
 * @class ContextAttributesLogger
 * @extends Shareable
 * @implements IContextCommand
 */
class ContextAttributesLogger extends Shareable implements IContextCommand {
  constructor() {
    super(QUALIFIED_NAME)
  }
  contextFree(canvasId?: number): void {
  }
  contextGain(manager: IContextProvider): void {
    let gl = manager.gl
    let attributes: WebGLContextAttributes = gl.getContextAttributes()
    console.log("alpha                 => " + attributes.alpha)
    console.log("antialias             => " + attributes.antialias)
    console.log("depth                 => " + attributes.depth)
    console.log("premultipliedAlpha    => " + attributes.premultipliedAlpha)
    console.log("preserveDrawingBuffer => " + attributes.preserveDrawingBuffer)
    console.log("stencil               => " + attributes.stencil)
  }
  contextLost(canvasId?: number): void {
  }
  destructor(): void {
    super.destructor()
  }
  get name(): string {
    return QUALIFIED_NAME
  }
}

export = ContextAttributesLogger