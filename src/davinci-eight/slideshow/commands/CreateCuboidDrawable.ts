import VectorE3 = require('../../math/VectorE3')

import ColorFacet = require('../../uniforms/ColorFacet')
import CuboidSimplexGeometry = require('../../geometries/CuboidSimplexGeometry')
import Drawable = require('../../scene/Drawable')
import SimplexGeometry = require('../../geometries/SimplexGeometry')
import ISlide = require('../../slideshow/ISlide')
import ISlideCommand = require('../../slideshow/ISlideCommand')
import IMaterial = require('../../core/IMaterial')
import IDirector = require('../../slideshow/IDirector')
import PointMaterial = require('../../materials/PointMaterial')
import LineMaterial = require('../../materials/LineMaterial')
import MeshMaterial = require('../../materials/MeshMaterial')
import ModelFacet = require('../../models/ModelFacet')
import Shareable = require('../../utils/Shareable')
import Simplex = require('../../geometries/Simplex')
import R3 = require('../../math/R3')

function createMaterial(geometry: SimplexGeometry): IMaterial
{
  switch(geometry.meta.k)
  {
    case Simplex.POINT:
    {
      return new PointMaterial()
    }
    case Simplex.LINE:
    {
      return new LineMaterial()
    }
    case Simplex.TRIANGLE:
    {
      return new MeshMaterial()
    }
    default: {
      throw new Error('Unexpected dimensions for simplex: ' + geometry.meta.k)
    }
  }
}

class CreateCuboidDrawable extends Shareable implements ISlideCommand
{
  private name: string;
  private a: R3;
  private b: R3;
  private c: R3;
  private k: number;
  private subdivide: number;
  private boundary: number;
  constructor(name: string, a: VectorE3 = R3.e1, b: VectorE3 = R3.e2, c: VectorE3 = R3.e3, k: number = Simplex.TRIANGLE, subdivide: number = 0, boundary: number = 0)
  {
    super('CreateCuboidDrawable')
    this.name = name
    this.a = R3.copy(a)
    this.b = R3.copy(b)
    this.c = R3.copy(c)
    this.k = k
    this.subdivide = subdivide
    this.boundary = boundary
  }
  protected destructor(): void
  {
    super.destructor();
  }
  redo(slide: ISlide, director: IDirector)
  {
    var geometry = new CuboidSimplexGeometry()
    geometry.a.copy(this.a)
    geometry.b.copy(this.b)
    geometry.c.copy(this.c)
    geometry.k = this.k
    geometry.subdivide(this.subdivide)
    geometry.boundary(this.boundary)
    var primitives = geometry.toPrimitives()
    var material = createMaterial(geometry)
    var drawable = new Drawable(primitives, material)
    drawable.setFacet('model', new ModelFacet()).decRef()
    drawable.setFacet('color', new ColorFacet()).decRef().setRGB(1, 1, 1)
    director.addDrawable(drawable, this.name)
  }
  undo(slide: ISlide, director: IDirector)
  {
    director.removeDrawable(this.name).release()
  }
}

export = CreateCuboidDrawable