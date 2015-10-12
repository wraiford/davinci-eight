import AttribMetaInfo = require('../core/AttribMetaInfo')
import getAttribVarName = require('../core/getAttribVarName')
import getUniformVarName = require('../core/getUniformVarName')
import mustBeBoolean = require('../checks/mustBeBoolean')
import mustBeDefined = require('../checks/mustBeDefined')
import Symbolic = require('../core/Symbolic')
import UniformMetaInfo = require('../core/UniformMetaInfo')

function getUniformCodeName(uniforms: { [name: string]: UniformMetaInfo }, name: string) {
  return getUniformVarName(uniforms[name], name)
}

let SPACE = ' '
let ATTRIBUTE = 'attribute' + SPACE
let UNIFORM = 'uniform' + SPACE
let COMMA = ',' + SPACE
let SEMICOLON = ';'
let LPAREN = '('
let RPAREN = ')'
let TIMES  = SPACE + '*' + SPACE
let ASSIGN = SPACE + '=' + SPACE
let DIRECTIONAL_LIGHT_COSINE_FACTOR_VARNAME = "directionalLightCosineFactor"

function indent(n: number): string {
  return SPACE + SPACE
}

/**
 * Generates a vertex shader.
 */
function vertexShader(attributes: { [name: string]: AttribMetaInfo }, uniforms: { [name: string]: UniformMetaInfo }, vColor: boolean, vLight: boolean): string {

  mustBeDefined('attributes', attributes)
  mustBeDefined('uniforms', uniforms)
  mustBeBoolean('vColor', vColor)
  mustBeBoolean('vLight', vLight)

  var lines: string[] = []
  lines.push("// generated vertex shader")
  for (var aName in attributes) {
    lines.push(ATTRIBUTE + attributes[aName].glslType + SPACE + getAttribVarName(attributes[aName], aName) + SEMICOLON)
  }
  for (var uName in uniforms) {
    lines.push(UNIFORM + uniforms[uName].glslType + SPACE + getUniformCodeName(uniforms, uName) + SEMICOLON)
  }
  if (vColor) {
    lines.push("varying highp vec4 vColor;")
  }
  if (vLight) {
    lines.push("varying highp vec3 vLight;");
  }
  lines.push("void main(void) {")
  let glPosition: string[] = []
  glPosition.unshift(SEMICOLON)

  if (attributes[Symbolic.ATTRIBUTE_POSITION]) {
    glPosition.unshift(RPAREN)
    glPosition.unshift("1.0")
    glPosition.unshift(COMMA)
    glPosition.unshift(getAttribVarName(attributes[Symbolic.ATTRIBUTE_POSITION], Symbolic.ATTRIBUTE_POSITION))
    glPosition.unshift(LPAREN)
    glPosition.unshift("vec4")
  }
  else {
    glPosition.unshift("vec4(0.0, 0.0, 0.0, 1.0)")
  }

  if (uniforms[Symbolic.UNIFORM_MODEL_MATRIX]) {
    glPosition.unshift(TIMES)
    glPosition.unshift(getUniformCodeName(uniforms, Symbolic.UNIFORM_MODEL_MATRIX))
  }
  if (uniforms[Symbolic.UNIFORM_VIEW_MATRIX]) {
    glPosition.unshift(TIMES)
    glPosition.unshift(getUniformCodeName(uniforms, Symbolic.UNIFORM_VIEW_MATRIX))
  }
  if (uniforms[Symbolic.UNIFORM_PROJECTION_MATRIX]) {
    glPosition.unshift(TIMES)
    glPosition.unshift(getUniformCodeName(uniforms, Symbolic.UNIFORM_PROJECTION_MATRIX))
  }
  glPosition.unshift(ASSIGN)
  glPosition.unshift("gl_Position")
  glPosition.unshift('  ')
  lines.push(glPosition.join(''))

  if (uniforms[Symbolic.UNIFORM_POINT_SIZE]) {
    lines.push("  gl_PointSize = " + getUniformCodeName(uniforms, Symbolic.UNIFORM_POINT_SIZE) + ";")
  }

  if (vColor) {
    if (attributes[Symbolic.ATTRIBUTE_COLOR]) {
      let colorAttribVarName = getAttribVarName(attributes[Symbolic.ATTRIBUTE_COLOR], Symbolic.ATTRIBUTE_COLOR)
      switch(attributes[Symbolic.ATTRIBUTE_COLOR].glslType) {
        case 'vec4': {
          lines.push("  vColor = " + colorAttribVarName + SEMICOLON)
        }
        break
        case 'vec3': {
          lines.push("  vColor = vec4(" + colorAttribVarName + ", 1.0);")
        }
        break
        default: {
          throw new Error("Unexpected type for color attribute: " + attributes[Symbolic.ATTRIBUTE_COLOR].glslType)
        }
      }
    }
    else if (uniforms[Symbolic.UNIFORM_COLOR]) {
      let colorUniformVarName = getUniformCodeName(uniforms, Symbolic.UNIFORM_COLOR)
      switch(uniforms[Symbolic.UNIFORM_COLOR].glslType) {
        case 'vec4': {
          lines.push("  vColor = " + colorUniformVarName + SEMICOLON)
        }
        break
        case 'vec3': {
          lines.push("  vColor = vec4(" + colorUniformVarName + ", 1.0);")
        }
        break
        default: {
          throw new Error("Unexpected type for color uniform: " + uniforms[Symbolic.UNIFORM_COLOR].glslType)
        }
      }
    }
    else {
      lines.push("  vColor = vec4(1.0, 1.0, 1.0, 1.0);")
    }
  }

  if (vLight) {
    if (uniforms[Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR] && uniforms[Symbolic.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION] && uniforms[Symbolic.UNIFORM_NORMAL_MATRIX] && attributes[Symbolic.ATTRIBUTE_NORMAL]) {
      lines.push("  vec3 L = normalize(" + getUniformCodeName(uniforms, Symbolic.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION) + ");")
      lines.push("  vec3 N = normalize(" + getUniformCodeName(uniforms, Symbolic.UNIFORM_NORMAL_MATRIX) + " * " + getAttribVarName(attributes[Symbolic.ATTRIBUTE_NORMAL], Symbolic.ATTRIBUTE_NORMAL) + ");")
      lines.push("  // The minus sign arises because L is the light direction, so we need dot(N, -L) = -dot(N, L)")
      lines.push("  float " + DIRECTIONAL_LIGHT_COSINE_FACTOR_VARNAME + " = max(-dot(N, L), 0.0);")
      if (uniforms[Symbolic.UNIFORM_AMBIENT_LIGHT]) {
        lines.push("  vLight = " + getUniformCodeName(uniforms, Symbolic.UNIFORM_AMBIENT_LIGHT) + " + " + DIRECTIONAL_LIGHT_COSINE_FACTOR_VARNAME + " * " + getUniformCodeName(uniforms, Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR) + ";")
      }
      else {
        lines.push("  vLight = " + DIRECTIONAL_LIGHT_COSINE_FACTOR_VARNAME + " * " + getUniformCodeName(uniforms, Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR) + ";")
      }
    }
    else {
      if (uniforms[Symbolic.UNIFORM_AMBIENT_LIGHT]) {
        lines.push("  vLight = " + getUniformCodeName(uniforms, Symbolic.UNIFORM_AMBIENT_LIGHT) + ";")
      }
      else {
        lines.push("  vLight = vec3(1.0, 1.0, 1.0);")
      }
    }
  }
  lines.push("}")

  let code = lines.join("\n")
  return code
}

export = vertexShader
