/// <reference path="./Mesh.d.ts" />
/// <reference path="../cameras/Camera.d.ts" />
/// <reference path="../geometries/Geometry.d.ts" />
/// <reference path="../materials/Material.d.ts" />
/// <reference path="../../../vendor/davinci-blade/dist/davinci-blade.d.ts" />
import VertexAttribArray = require('./VertexAttribArray');
import object3D = require('davinci-eight/core/object3D');
import vs_source = require('davinci-eight/shaders/shader-vs');
import fs_source = require('davinci-eight/shaders/shader-fs');
import glMatrix = require('gl-matrix');
import ElementArray = require('davinci-eight/objects/ElementArray');

// A work in progress?
class UniformMatrix4fv {
  private location: WebGLUniformLocation;
  private name: string;
  constructor(name: string) {
    this.name = name;
  }
  contextGain(context: WebGLRenderingContext, program: WebGLProgram) {
    this.location = context.getUniformLocation(program, this.name);
  }
  foo(context: WebGLRenderingContext, transpose: boolean, matrix) {
    context.uniformMatrix4fv(this.location, transpose, matrix);
  }
}

var mesh = function<G extends Geometry, M extends Material>(geometry: G, material: M): Mesh<G, M> {
  /**
   *
   */
  function vertexAttrib(declaration: { name: string }): VertexAttribArray {
    let attributes = geometry.getAttributes();
    let name = declaration.name;
    let candidates = attributes.filter(function(attribute) {return attribute.name === name;});
    if (candidates.length === 1) {
      let candidate = candidates[0];
      let size = candidate.size;
      let normalized = candidate.normalized;
      let stride = candidate.stride;
      let offset = candidate.offset;
      return new VertexAttribArray(name, size, normalized, stride, offset);
    }
    else {
      throw new Error("The geometry does not support the attribute " + name);
    }
  }

    var base = object3D();
    var contextGainId: string;
    var elements = new ElementArray(geometry);
    var vertexAttributes: VertexAttribArray[] = material.attributes.map(vertexAttrib);

    var MVMatrix: UniformMatrix4fv = new UniformMatrix4fv('uMVMatrix');
    var uNormalMatrix: WebGLUniformLocation;
    var PMatrix: UniformMatrix4fv = new UniformMatrix4fv('uPMatrix');
    // It might be nice to decouple from glMatrix, since that is the direction?
    var matrix = glMatrix.mat4.create();
    var normalMatrix = glMatrix.mat3.create();

    function updateGeometry(context: WebGLRenderingContext, time: number) {
      // Make sure to update the geometry first so that the material gets the correct data.
      geometry.update(time, material.attributes);
      vertexAttributes.forEach(function(vertexAttribute) {
        vertexAttribute.bufferData(context, geometry);
      });
      elements.bufferData(context, geometry);
    }

    var publicAPI = {
        get geometry(): G {
          return geometry;
        },
        get material(): M {
          return material;
        },
        contextFree(context: WebGLRenderingContext) {
          material.contextFree(context);
          vertexAttributes.forEach(function(vertexAttribute) {
            vertexAttribute.contextFree(context);
          });
          elements.contextFree(context);
        },
        contextGain(context: WebGLRenderingContext, contextId: string) {
          if (contextGainId !== contextId) {
            contextGainId = contextId;
            material.contextGain(context, contextId);
            vertexAttributes.forEach(function(vertexAttribute) {
              vertexAttribute.contextGain(context, material.program);
            });
            elements.contextGain(context);
            if (!geometry.dynamic()) {
              updateGeometry(context, 0);
            }

            // TODO; We won't need material.program when these are encapsulated.
            MVMatrix.contextGain(context, material.program);
            // This could come back as null, meaning there is no such Uniform in the shader.
            uNormalMatrix = context.getUniformLocation(material.program, 'uNormalMatrix');
            PMatrix.contextGain(context, material.program);
          }
        },
        contextLoss() {
          material.contextLoss();
          vertexAttributes.forEach(function(vertexAttribute) {
            vertexAttribute.contextLoss();
          });
          elements.contextLoss();
        },
        hasContext(): boolean {
          return material.hasContext();
        },
        get drawGroupName(): string {return material.programId;},
        useProgram(context: WebGLRenderingContext) {
          context.useProgram(material.program);
        },
        draw(context: WebGLRenderingContext, time: number, camera: Camera) {
          var position = base.position;
          var attitude = base.attitude;
          if (material.hasContext()) {
            if (geometry.dynamic()) {
              updateGeometry(context, time);
            }
            glMatrix.mat4.identity(matrix);
            glMatrix.mat4.translate(matrix, matrix, [position.x, position.y, position.z]);
            var rotationMatrix = glMatrix.mat4.create();
            glMatrix.mat4.fromQuat(rotationMatrix, [attitude.yz, attitude.zx, attitude.xy, attitude.w]);
            glMatrix.mat4.mul(matrix, matrix, rotationMatrix);
            rotationMatrix = null;

            PMatrix.foo(context, false, camera.projectionMatrix);
            MVMatrix.foo(context, false, matrix);
            if (uNormalMatrix) {
              glMatrix.mat3.normalFromMat4(normalMatrix, matrix);
              context.uniformMatrix3fv(uNormalMatrix, false, normalMatrix);
            }

            vertexAttributes.forEach(function(vertexAttribute) {
              vertexAttribute.enable(context);
            });

            vertexAttributes.forEach(function(vertexAttribute) {
              vertexAttribute.bind(context);
            });

            geometry.draw(context);
            elements.bind(context);

            vertexAttributes.forEach(function(vertexAttribute) {
              vertexAttribute.disable(context);
            });
          }
        },
        get position(): blade.Euclidean3 {return base.position },
        set position(position) { base.position = position },
        get attitude(): blade.Euclidean3 {return base.attitude },
        set attitude(attitude) { base.attitude = attitude }
    };

    return publicAPI;
};

export = mesh;
