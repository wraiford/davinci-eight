/// <reference path='../renderers/VertexUniformProvider.d.ts'/>
class ChainedVertexUniformProvider implements VertexUniformProvider {
  private provider: VertexUniformProvider;
  private fallback: VertexUniformProvider;
  constructor(provider: VertexUniformProvider, fallback: VertexUniformProvider) {
    this.provider = provider;
    this.fallback = fallback;
  }
  getUniformMatrix3(name: string) {
    var m3 = this.provider.getUniformMatrix3(name);
    if (m3) {
      return m3;
    }
    else {
      return this.fallback.getUniformMatrix3(name);
    }
  }
  getUniformMatrix4(name: string) {
    var m4 = this.provider.getUniformMatrix4(name);
    if (m4) {
      return m4;
    }
    else {
      return this.fallback.getUniformMatrix4(name);
    }
  }
}

export = ChainedVertexUniformProvider;