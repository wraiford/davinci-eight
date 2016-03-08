import BlendFactor from '../commands/BlendFactor';
import ContextProvider from '../core/ContextProvider';
import incLevel from '../base/incLevel';
import ShareableBase from '../core/ShareableBase';

const factors = [
  BlendFactor.DST_ALPHA,
  BlendFactor.DST_COLOR,
  BlendFactor.ONE,
  BlendFactor.ONE_MINUS_DST_ALPHA,
  BlendFactor.ONE_MINUS_DST_COLOR,
  BlendFactor.ONE_MINUS_SRC_ALPHA,
  BlendFactor.ONE_MINUS_SRC_COLOR,
  BlendFactor.SRC_ALPHA,
  BlendFactor.SRC_ALPHA_SATURATE,
  BlendFactor.SRC_COLOR,
  BlendFactor.ZERO
]

function mustBeFactor(name: string, factor: BlendFactor): BlendFactor {
  if (factors.indexOf(factor) >= 0) {
    return factor;
  }
  else {
    throw new Error(factor + " is not a valid factor.")
  }
}

function factor(factor: BlendFactor, gl: WebGLRenderingContext): number {
  switch (factor) {
    case BlendFactor.ONE: return gl.ONE;
    case BlendFactor.SRC_ALPHA: return gl.SRC_ALPHA;
    default: {
      throw new Error(factor + " is not a valid factor.")
    }
  }
}

/**
 * @class WebGLBlendFunc
 * @extends ShareableBase
 */
export default class WebGLBlendFunc extends ShareableBase {
  public sfactor: BlendFactor;
  public dfactor: BlendFactor;
  /**
   * @class WebGLBlendFunc
   * @constructor
   * @param sfactor {BlendFactor}
   * @param dfactor {BlendFactor}
   * @param [level = 0] {number}
   */
  constructor(sfactor: BlendFactor, dfactor: BlendFactor, level = 0) {
    super('WebGLBlendFunc', incLevel(level))
    this.sfactor = mustBeFactor('sfactor', sfactor)
    this.dfactor = mustBeFactor('dfactor', dfactor)
  }

  /**
   * @method destructor
   * @param level {number}
   * @return {void}
   */
  destructor(level: number): void {
    this.sfactor = void 0
    this.dfactor = void 0
    super.destructor(incLevel(level))
  }

  contextFree(manager: ContextProvider): void {
    // do nothing
  }

  contextGain(manager: ContextProvider): void {
    this.execute(manager.gl)
  }

  contextLost(): void {
    // do nothing
  }

  private execute(gl: WebGLRenderingContext): void {
    gl.blendFunc(factor(this.sfactor, gl), factor(this.dfactor, gl))
  }
}
