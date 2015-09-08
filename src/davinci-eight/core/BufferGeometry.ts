import BufferAttribute = require('../core/BufferAttribute');
import Geometry = require('../geometries/Geometry');
import Cartesian3 = require('../math/Cartesian3');
import Face3 = require('../core/Face3');

let NoColors = 0;
let FaceColors = 1;
let VertexColors = 2;

class BufferGeometry extends Geometry {
  private attributes: { [name: string]: BufferAttribute } = {};
  public attributesKeys: string[] = [];
  public uuid: string;
  public drawcalls: {start: number, count: number, index: number}[] = [];
  public boundingBox;
  public boundingSphere;
  constructor() {
    super();
  }
  addAttribute(name: string, attribute: BufferAttribute) {
    this.attributes[name] = attribute;
    this.attributesKeys = Object.keys(this.attributes);
  }
  getAttribute(name: string) {
    return this.attributes[name];
  }
  addDrawCall(start: number, count: number, indexOffset: number = 0) {
    this.drawcalls.push({start: start, count: count, index: indexOffset});
  }
  fromGeometry(geometry: Geometry, settings) {

    settings = settings || { 'vertexColors': NoColors };

    var vertices: Cartesian3[] = geometry.vertices;
    var faces: Face3[] = geometry.faces;
    var faceVertexUvs = geometry.faceVertexUvs;
    var vertexColors = settings.vertexColors;
    var hasFaceVertexUv = faceVertexUvs[ 0 ].length > 0;
    var hasFaceVertexNormals = faces[ 0 ].vertexNormals.length == 3;

    var positions = new Float32Array( faces.length * 3 * 3 );
    this.addAttribute( 'position', new BufferAttribute( positions, 3 ) );

    var normals = new Float32Array( faces.length * 3 * 3 );
    this.addAttribute( 'normal', new BufferAttribute( normals, 3 ) );

    if ( vertexColors !== NoColors ) {

      var colors = new Float32Array( faces.length * 3 * 3 );
      this.addAttribute( 'color', new BufferAttribute( colors, 3 ) );

    }

    if ( hasFaceVertexUv === true ) {

      var uvs = new Float32Array( faces.length * 3 * 2 );
      this.addAttribute( 'uv', new BufferAttribute( uvs, 2 ) );

    }

    for ( var i = 0, i2 = 0, i3 = 0; i < faces.length; i ++, i2 += 6, i3 += 9 ) {

      var face = faces[ i ];

      var a = vertices[ face.a ];
      var b = vertices[ face.b ];
      var c = vertices[ face.c ];

      positions[ i3     ] = a.x;
      positions[ i3 + 1 ] = a.y;
      positions[ i3 + 2 ] = a.z;

      positions[ i3 + 3 ] = b.x;
      positions[ i3 + 4 ] = b.y;
      positions[ i3 + 5 ] = b.z;

      positions[ i3 + 6 ] = c.x;
      positions[ i3 + 7 ] = c.y;
      positions[ i3 + 8 ] = c.z;

      if ( hasFaceVertexNormals === true ) {

        var na = face.vertexNormals[ 0 ];
        var nb = face.vertexNormals[ 1 ];
        var nc = face.vertexNormals[ 2 ];

        normals[ i3     ] = na.x;
        normals[ i3 + 1 ] = na.y;
        normals[ i3 + 2 ] = na.z;

        normals[ i3 + 3 ] = nb.x;
        normals[ i3 + 4 ] = nb.y;
        normals[ i3 + 5 ] = nb.z;

        normals[ i3 + 6 ] = nc.x;
        normals[ i3 + 7 ] = nc.y;
        normals[ i3 + 8 ] = nc.z;

      } else {

        var n = face.normal;

        normals[ i3     ] = n.x;
        normals[ i3 + 1 ] = n.y;
        normals[ i3 + 2 ] = n.z;

        normals[ i3 + 3 ] = n.x;
        normals[ i3 + 4 ] = n.y;
        normals[ i3 + 5 ] = n.z;

        normals[ i3 + 6 ] = n.x;
        normals[ i3 + 7 ] = n.y;
        normals[ i3 + 8 ] = n.z;

      }

      if ( vertexColors === FaceColors ) {

        var fc = face.color;

        colors[ i3     ] = fc.r;
        colors[ i3 + 1 ] = fc.g;
        colors[ i3 + 2 ] = fc.b;

        colors[ i3 + 3 ] = fc.r;
        colors[ i3 + 4 ] = fc.g;
        colors[ i3 + 5 ] = fc.b;

        colors[ i3 + 6 ] = fc.r;
        colors[ i3 + 7 ] = fc.g;
        colors[ i3 + 8 ] = fc.b;

      } else if ( vertexColors === VertexColors ) {

        var vca = face.vertexColors[ 0 ];
        var vcb = face.vertexColors[ 1 ];
        var vcc = face.vertexColors[ 2 ];

        colors[ i3     ] = vca.r;
        colors[ i3 + 1 ] = vca.g;
        colors[ i3 + 2 ] = vca.b;

        colors[ i3 + 3 ] = vcb.r;
        colors[ i3 + 4 ] = vcb.g;
        colors[ i3 + 5 ] = vcb.b;

        colors[ i3 + 6 ] = vcc.r;
        colors[ i3 + 7 ] = vcc.g;
        colors[ i3 + 8 ] = vcc.b;

      }

      if ( hasFaceVertexUv === true ) {

        var uva = faceVertexUvs[ 0 ][ i ][ 0 ];
        var uvb = faceVertexUvs[ 0 ][ i ][ 1 ];
        var uvc = faceVertexUvs[ 0 ][ i ][ 2 ];

        uvs[ i2     ] = uva.x;
        uvs[ i2 + 1 ] = uva.y;

        uvs[ i2 + 2 ] = uvb.x;
        uvs[ i2 + 3 ] = uvb.y;

        uvs[ i2 + 4 ] = uvc.x;
        uvs[ i2 + 5 ] = uvc.y;

      }

    }

    this.computeBoundingSphere()

    return this;

  }
}

export = BufferGeometry;