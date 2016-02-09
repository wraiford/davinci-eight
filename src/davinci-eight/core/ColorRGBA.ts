import ColorRGB from './ColorRGB';

/**
 * @module EIGHT
 * @submodule core
 */

/**
 * @class ColorRGBA
 * @extends ColorRGB
 */
interface ColorRGBA extends ColorRGB {
    /**
     * The <em>alpha</em> component of the color.
     * @property α
     * @type {number}
     */
    α: number;
}

export default ColorRGBA;
