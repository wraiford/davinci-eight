/**
 * @class AttribMetaInfo
 */
interface AttribMetaInfo {
  /**
   * The type keyword as it appears in the GLSL shader program.
   * This property is used for program generation.
   * @property glslType
   * @type {string}
   */
  glslType: string,
}

export = AttribMetaInfo;
