import DrawMode from '../../core/DrawMode'
import GridPrimitive from './GridPrimitive'
import mustBeInteger from '../../checks/mustBeInteger'
import numPostsForFence from './numPostsForFence'
import Vertex from './Vertex'

/**
 * Computes the vertex index from integer coordinates.
 * Both lengths are included for symmetry!
 */
function vertexIndex(i: number, j: number, iLength: number, jLength: number): number {
  return j * iLength + i
}

function linesForGrid(uSegments: number, vSegments: number): number[] {
  const iLength = numPostsForFence(uSegments)
  const jLength = numPostsForFence(vSegments)
  const elements: number[] = []
  for (let i = 0; i < iLength; i++) {
    for (let j = 0; j < jLength; j++) {
      // The first line is in the direction of increasing i.
      // 
      if (i < uSegments) {
        elements.push(vertexIndex(i, j, iLength, jLength))
        elements.push(vertexIndex(i + 1, j, iLength, jLength))
      }
      // The second line is in the direction of increasing j.
      if (j < vSegments) {
        elements.push(vertexIndex(i, j, iLength, jLength))
        elements.push(vertexIndex(i, j + 1, iLength, jLength))
      }
    }
  }
  return elements
}

/**
 * @class GridLines
 * @extends GeometryPrimitive
 */
export default class GridLines extends GridPrimitive {

  /**
   * @class GridLines
   * @constructor
   * @param uSegments {number}
   * @param vSegments {number}
   */
  constructor(uSegments: number, vSegments: number) {
    super(DrawMode.LINES, uSegments, vSegments)
    this.elements = linesForGrid(uSegments, vSegments)
    const iLength = numPostsForFence(uSegments)
    const jLength = numPostsForFence(vSegments)
    for (let i = 0; i < iLength; i++) {
      for (let j = 0; j < jLength; j++) {
        const coords = this.vertex(i, j).coords
        coords.setComponent(0, i)
        coords.setComponent(1, j)
      }
    }
  }

  /**
   * @method vertex
   * @param i {number} An integer. 0 <= i < uLength
   * @param j {number} An integer. 0 <= j < vLength
   * @return {Vertex}
   */
  vertex(i: number, j: number): Vertex {
    mustBeInteger('i', i)
    mustBeInteger('j', j)
    return this.vertices[vertexIndex(i, j, this.uLength, this.vLength)]
  }

}