import AttribDataInfos = require('../core/AttribDataInfos');
import AttribMetaInfos = require('../core/AttribMetaInfos');
import DataUsage = require('../core/DataUsage');
import DrawMode = require('../core/DrawMode');
import RenderingContextUser = require('../core/RenderingContextUser');
/**
 * @class AttribProvider
 */
interface AttribProvider extends RenderingContextUser {
  /**
   * @method draw
   */
  draw(): void;
  /**
   * @method update
   */
  update(): void;
  /**
   * Provides the values required for vertex shader attributes. 
   * @method getAttributeData
   * @return {Float32Array} The array of attribute values.
   */
  getAttribArray(name: string): { usage: DataUsage; data: Float32Array };
  /**
   * Provides the data information corresponsing to provided attribute values. 
   * @method getAttribData
   * @return {AttribDataInfos} The data information corresponding to all attributes supported.
   */
  getAttribData(): AttribDataInfos;
  /**
   * Provides the meta information corresponsing to provided attribute values. 
   * @method getAttribMeta
   * @return {AttribMetaInfos} The meta information corresponding to all attributes supported.
   */
  getAttribMeta(): AttribMetaInfos;
  /**
   * @property drawMode
   * @type number
   * Determines how the thing will be rendered.
   */
  drawMode: DrawMode;
  /**
   * Determines when and how often the update method is called. 
   * @property dynamic
   * @type boolean
   */
  dynamic: boolean;
  /**
   * Determines whether this attribute provider uses vetex indexing.
   * @method hasElementArray
   * @return {Boolean} true if the provider uses vertex indexing.
   */
  hasElementArray(): boolean;
  /**
   * @method getElementArray
   * @return {usage: DataUsage; data:Unit16Array} The array of vertex indices.
   */
  getElementArray(): {usage: DataUsage; data: Uint16Array};
}

export = AttribProvider;