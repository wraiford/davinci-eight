//
// davinci-eight.d.ts
//
// This file was created manually in order to support the davinci-eight library.
// These declarations are appropriate when using the library through the global
// variable, 'EIGHT'.
//
/**
 * WebGL library for mathematical physics using Geometric Algebra.
 */
declare module EIGHT {

  /**
   * Enables clients of Shareable instances to declare their references.
   */
  interface Shareable {
    /**
     * Notifies this instance that something is referencing it.
     */
    addRef(): number;
    /**
     * Notifies this instance that something is dereferencing it.
     */
    release(): number;
  }

  /**
   * Convenience base class for classes requiring reference counting.
   */
  class ShareableBase implements Shareable {

    /**
     *
     */
    constructor();

    /**
     * Notifies this instance that something is referencing it.
     */
    addRef(): number;

    /**
     *
     */
    protected destructor(levelUp: number): void;

    /**
     *
     */
    getLoggingName(): string;

    /**
     *
     */
    isZombie(): boolean;

    /**
     * Notifies this instance that something is dereferencing it.
     */
    release(): number;

    /**
     *
     */
    protected setLoggingName(name: string): void;
  }

  class ShareableArray<T extends Shareable> extends ShareableBase {
    length: number;
    /**
     * Collection class for maintaining an array of types derived from Shareable.
     * Provides a safer way to maintain reference counts than a native array.
     */
    constructor(elements: T[]);
    forEach(callback: (value: T, index: number) => void): void;
    get(index: number): T;
    /**
     * Gets the element at the specified index without incrementing the reference count.
     * Use this method when you don't intend to hold onto the returned value.
     */
    getWeakRef(index: number): T;
    indexOf(searchElement: T, fromIndex?: number): number;
    pop(): T;
    push(element: T): number;
    /**
     * Pushes an element onto the tail of the list without incrementing the element reference count.
     */
    pushWeakRef(element: T): number;
    shift(): T;
    slice(begin?: number, end?: number): ShareableArray<T>;
    splice(index: number, deleteCount: number): ShareableArray<T>;
  }

  class NumberShareableMap<V extends Shareable> extends ShareableBase {
    keys: number[];
    constructor()
    exists(key: number): boolean
    get(key: number): V
    getWeakRef(key: number): V
    put(key: number, value: V): void
    putWeakRef(key: number, value: V): void
    forEach(callback: (key: number, value: V) => void)
    remove(key: number): void
  }

  class StringShareableMap<V extends Shareable> extends ShareableBase {
    keys: string[];
    constructor()
    exists(key: string): boolean
    forEach(callback: (key: string, value: V) => void)
    get(key: string): V
    getWeakref(key: string): V
    put(key: string, value: V): void
    putWeakRef(key: string, value: V): void
    remove(key: string): void
  }
  ///////////////////////////////////////////////////////////////////////////////
  interface BrowserAppOptions {
    memcheck?: boolean;
    window?: Window;
  }
  /**
   *
   */
  class BrowserApp {
    protected window: Window;
    constructor(optins?: BrowserAppOptions);
    protected destructor(): void;
    protected initialize(): void;
    public isRunning(): boolean;
    public isWaiting(): boolean;
    public isZombie(): boolean;
    public manage(managed: Shareable): void;
  }

  interface WindowAnimationRunner {

    /**
     *
     */
    start(): void;

    /**
     *
     */
    stop(): void;

    /**
     *
     */
    reset(): void;

    /**
     *
     */
    lap(): void;

    /**
     *
     */
    time: number;

    /**
     *
     */
    isRunning: boolean;

    /**
     *
     */
    isPaused: boolean;
  }

  class Engine extends ShareableBase {

    /**
     * If the canvas property has not been initialized by calling `start()`,
     * then any attempt to access this property will trigger the construction of
     * a new HTML canvas element which will remain in effect for this Engine
     * until `stop()` is called.
     */
    canvas: HTMLCanvasElement;

    /**
     *
     */
    commands: ShareableArray<ContextConsumer>;

    /**
     * The underlying WebGLRenderingContext.
     */
    gl: WebGLRenderingContext;

    /**
     * Determines whether this Engine may use a cache to optimize WebGL API calls.
     */
    mayUseCache: boolean;

    /**
     * Constructs an <code>Engine</code> using <code>WebGLContextAttributes</code>.
     */
    constructor(attributes?: WebGLContextAttributes);

    /**
     * Called when the last reference to this Engine has been released.
     */
    protected destructor(levelUp: number): void;

    /**
     *
     */
    addContextListener(user: ContextConsumer): void;

    /**
     *
     */
    clear(): void;

    /**
     * <p>
     * Specifies color values to use by the <code>clear</code> method to clear the color buffer.
     * <p>
     */
    clearColor(red: number, green: number, blue: number, alpha: number): Engine;

    /**
     * Turns off specific WebGL capabilities for this context.
     */
    disable(capability: Capability): Engine;

    /**
     * Turns on specific WebGL capabilities for this context.
     */
    enable(capability: Capability): Engine;

    /**
     * Returns the implementation dependent viewport maximum dimensions.
     * e.g. Int32Array[maxWidth, maxHeight]
     */
    getMaxViewportDims(): Int32Array;

    /**
     * Returns the current viewport parameters.
     * e.g. Int32Array[x, y, width, height]
     */
    getViewport(): Int32Array;

    /**
     *
     */
    removeContextListener(user: ContextConsumer): void;

    /**
     * Initializes the WebGL context for the specified <code>canvas</code>.
     */
    start(canvas: HTMLCanvasElement): Engine;

    /**
     * Terminates the <code>WebGLRenderingContext</code> for the underlying canvas.
     */
    stop(): Engine;

    /**
     *
     */
    synchronize(user: ContextConsumer): void;

    /**
     * Defines what part of the canvas will be used in rendering the drawing buffer.
     * x
     * y
     * width
     * height
     */
    viewport(x: number, y: number, width: number, height: number): Engine;
  }
  ///////////////////////////////////////////////////////////////////////////////
  interface EngineAppOptions extends BrowserAppOptions {
  }
  /**
   *
   */
  class EngineApp extends BrowserApp {
    protected canvas: HTMLCanvasElement;
    protected engine: Engine;
    constructor(options: EngineAppOptions);
    /**
     * Sets the graphics buffers to values preselected by clearColor, clearDepth or clearStencil.
     * This method is a shortcut for this.engine.clear()
     */
    protected clear(): void;
    protected destructor(): void;
    protected initialize(): void;
  }
  ///////////////////////////////////////////////////////////////////////////////
  /**
   *
   */
  interface AnimationAppOptions extends EngineAppOptions {
  }
  ///////////////////////////////////////////////////////////////////////////////
  /**
   *
   */
  class AnimationApp extends EngineApp {
    protected animation: WindowAnimationRunner;
    constructor(options: AnimationAppOptions);
    protected animate(time: number): void;
    protected destructor(): void;
    protected initialize(): void;
    protected reset(): void;
    protected start(): void;
    protected stop(): void;
  }

  /**
   *
   */
  interface ContextConsumer extends Shareable {
    /**
     * Called to request the dependent to free any WebGL resources acquired and owned.
     * The dependent may assume that its cached context is still valid in order
     * to properly dispose of any cached resources. In the case of shared objects, this
     * method may be called multiple times for what is logically the same context. In such
     * cases the dependent must be idempotent and respond only to the first request.
     */
    contextFree(context: ContextProvider): void;
    /**
     * Called to inform the dependent of a new WebGL rendering context.
     * The implementation should ignore the notification if it has already
     * received the same context.
     */
    contextGain(context: ContextProvider): void;
    /**
     * Called to inform the dependent of a loss of WebGL rendering context.
     * The dependent must assume that any cached context is invalid.
     * The dependent must not try to use and cached context to free resources.
     * The dependent should reset its state to that for which there is no context.
     */
    contextLost(): void;
  }

  class ShareableContextConsumer extends ShareableBase implements ContextConsumer {
    cleanUp(): void;
    contextFree(contextProvider: ContextProvider): void;
    contextGain(contextProvider: ContextProvider): void;
    contextLost(): void;
    subscribe(engine: Engine): void;
    synchUp(): void;
    unsubscribe(): void;
  }

  /**
   * A wrapper around a WebGLBuffer with bunding to ARRAY_BUFFER.
   */
  class VertexBuffer extends ShareableContextConsumer {
    data: Float32Array
    constructor(engine: Engine)
    bind(): void
    unbind(): void
  }

  /**
   * Utility class for managing a shader uniform variable.
   */
  class UniformLocation implements ContextProgramConsumer {
    constructor(info: WebGLActiveInfo);

    contextFree(): void;
    contextGain(gl: WebGLRenderingContext, program: WebGLProgram): void;
    contextLost(): void;

    /**
     * Sets the uniform location to the value of the specified matrix.
     */
    matrix2fv(transpose: boolean, value: Float32Array): void;

    /**
     * Sets the uniform location to the value of the specified matrix.
     */
    matrix3fv(transpose: boolean, value: Float32Array): void;

    /**
     * Sets the uniform location to the value of the specified matrix.
     */
    matrix4fv(transpose: boolean, value: Float32Array): void;

    toString(): string;

    uniform1f(x: number): void;
    uniform1fv(data: Float32Array): void;
    uniform2f(x: number, y: number): void;
    uniform2fv(data: Float32Array): void;
    uniform3f(x: number, y: number, z: number): void;
    uniform3fv(data: Float32Array): void;
    uniform4f(x: number, y: number, z: number, w: number): void;
    uniform4fv(data: Float32Array): void;
  }

  /**
   *
   */
  interface FacetVisitor {
    mat2(name: string, matrix: Matrix2, transpose: boolean): void;
    mat3(name: string, matrix: Matrix3, transpose: boolean): void;
    mat4(name: string, matrix: Matrix4, transpose: boolean): void;
    uniform1f(name: string, x: number): void;
    uniform2f(name: string, x: number, y: number): void;
    uniform3f(name: string, x: number, y: number, z: number): void;
    uniform4f(name: string, x: number, y: number, z: number, w: number): void;
    vec2(name: string, vector: VectorE2): void;
    vec3(name: string, vector: VectorE3): void;
    vec4(name: string, vector: VectorE4): void;
    vector2fv(name: string, data: Float32Array): void;
    vector3fv(name: string, data: Float32Array): void;
    vector4fv(name: string, data: Float32Array): void;
  }

  interface Material extends FacetVisitor, ContextConsumer {
    vertexShaderSrc: string
    fragmentShaderSrc: string
    getAttribLocation(name: string): number
    getUniformLocation(name: string): UniformLocation
    use(): void
  }

  /**
   *
   */
  interface PrimitiveBuffers extends Shareable {
    uuid: string;
    bind(material: Material, aNameToKeyName?: { [name: string]: string }): void;
    draw(): void;
    unbind(): void;
  }

  /**
   * The draw mode determines how the WebGL pipeline consumes and processes the vertices.
   */
  enum DrawMode {
    /**
     * Each vertex is drawn as an isolated pixel or group of pixes based upon gl_PointSize.
     */
    POINTS,
    /**
     * Vertices are consumed in pairs creating connected line segments.
     */
    LINES,
    /**
     * Connects each vertex to the next by a line segment.
     */
    LINE_STRIP,
    /**
     * Vertices are consumed in groups of three to form triangles.
     */
    TRIANGLES,
    /**
     * After the first triangle, each subsequent point make a new triangle
     * using the previous two points.
     */
    TRIANGLE_STRIP
  }

  /**
   * The ErrorMode provides some control over how the system responds to illegal inputs.
   */
  enum ErrorMode {
    /**
     * The implementation will respond to illegal inputs by throwing exceptions.
     */
    STRICT,

    /**
     * The implementation will quietly ignore illegal inputs by ignoring the request.
     */
    IGNORE,

    /**
     * The implementation will provide warning at the console and may improvise responses.
     */
    WARNME
  }

  /**
   * The current mode that determines how errors are handled.
   */
  var errorMode: ErrorMode

  /**
   * An array of attribute values associated with meta data describing how to interpret the values.
   * {values: number[]; size: number;}
   */
  interface Attribute {
    /**
     * The attribute values.
     */
    values: number[];
    /**
     * The number of values that are associated with a given vertex.
     */
    size: number;
  }

  /**
   * {mode: DrawMode; indices: number[]; attributes: {[name: string]: Attribute};}
   */
  interface Primitive {
    /**
     *
     */
    mode: DrawMode;

    /**
     *
     */
    indices: number[];

    /**
     *
     */
    attributes: { [name: string]: Attribute };
  }

  /**
   *
   */
  interface ContextProgramConsumer {
    contextFree(): void;
    contextGain(gl: WebGLRenderingContext, program: WebGLProgram): void;
    contextLost(): void;
  }

  /**
   * Manages the lifecycle of an attribute used in a vertex shader.
   */
  class AttribLocation implements ContextProgramConsumer {
    index: number;
    contextFree(): void;
    contextGain(gl: WebGLRenderingContext, program: WebGLProgram): void;
    contextLost(): void;
    enable(): void;
    disable(): void;
    vertexPointer(size: number, normalized?: boolean, stride?: number, offset?: number): void;
  }

  /**
   *
   */
  interface ITexture extends ContextConsumer {
    bind(): void;
    unbind(): void;
  }

  /**
   * A reference-counted wrapper around a `WebGLTexture`.
   * It is associated with the `TEXTURE_2D` target at construction time. 
   */
  interface ITexture2D extends ITexture {

  }

  /**
   * A reference-counted wrapper around a `WebGLTexture`.
   * It is associated with the `TEXTURE_CUBE_MAP` target at construction time. 
   */
  interface ITextureCubeMap extends ITexture {

  }

  /**
   * The QQ class represents a rational number.
   * The QQ implementation is that of an immutable value.
   * The numerator and denominator are reduced to their lowest form.
   * Construct new instances using the static valueOf method.
   */
  class QQ {

    /**
     * The denominator.
     */
    denom: number;

    /**
     * The numerator.
     */
    numer: number;

    /**
     *
     */
    add(rhs: QQ): QQ

    /**
     *
     */
    div(rhs: QQ): QQ

    /**
     *
     */
    equals(other: QQ): boolean

    /**
     * Computes the multiplicative inverse of this rational number.
     */
    inv(): QQ

    /**
     * Determines whether this rational number is the multiplicative identity, <b>1</b>.
     */
    isOne(): boolean

    /**
     * Determines whether this rational number is the additive identity, <b>0</b>.
     */
    isZero(): boolean

    /**
     *
     */
    mul(rhs: QQ): QQ

    /**
     * Computes the additive inverse of this rational number.
     */
    neg(): QQ

    /**
     *
     */
    sub(rhs: QQ): QQ

    /**
     *
     */
    toString(): string

    /**
     *
     */
    static valueOf(numer: number, denom: number): QQ
  }

  /**
   * The dimensions of a physical quantity.
   */
  class Dimensions {
    M: QQ;
    L: QQ;
    T: QQ;
    Q: QQ;
    temperature: QQ;
    amount: QQ;
    intensity: QQ;
    constructor(M: QQ, L: QQ, T: QQ, Q: QQ, temperature: QQ, amount: QQ, intensity);
    isOne(): boolean;
    isZero(): boolean;
    inv(): Dimensions;
    neg(): Dimensions;

    /**
     *
     */
    static ONE: Dimensions;

    /**
     *
     */
    static MASS: Dimensions;

    /**
     *
     */
    static LENGTH: Dimensions;

    /**
     *
     */
    static TIME: Dimensions;

    /**
     *
     */
    static CHARGE: Dimensions;

    /**
     *
     */
    static CURRENT: Dimensions;

    /**
     *
     */
    static TEMPERATURE: Dimensions;

    /**
     *
     */
    static AMOUNT: Dimensions;

    /**
     *
     */
    static INTENSITY: Dimensions;
  }

  /**
   * The unit of measure for a physical quantity.
   */
  class Unit {
    multiplier: number;
    dimensions: Dimensions;
    labels: string[];
    constructor(multiplier: number, dimensions: Dimensions, labels: string[]);
    inv(): Unit;
    isOne(): boolean;
    isZero(): boolean;
    neg(): Unit;

    /**
     * Tme multiplicative identity (1).
     */
    static ONE: Unit;

    /**
     * The kilogram.
     */
    static KILOGRAM: Unit;

    /**
     * The meter.
     */
    static METER: Unit;

    /**
     * The second.
     */
    static SECOND: Unit;

    /**
     * The coulomb.
     */
    static COULOMB: Unit;

    /**
     * The ampere.
     */
    static AMPERE: Unit;

    /**
     * The kelvin.
     */
    static KELVIN: Unit;

    /**
     * The mole.
     */
    static MOLE: Unit;

    /**
     * The candela.
     */
    static CANDELA: Unit;
  }

  class G2 {
    α: number
    alpha: number
    x: number
    y: number
    β: number
    beta: number
    uom: Unit
    constructor(α?: number, x?: number, y?: number, β?: number, uom?: Unit)
    add(rhs: G2): G2
    addPseudo(β: Unit): G2
    addScalar(α: Unit): G2
    angle(): G2
    copy(M: GeometricE2): G2
    direction(): G2
    exp(): G2
    inv(): G2
    isPinor(): boolean
    isZero(): boolean
    magnitude(): G2
    reflect(n: VectorE2): G2
    rotate(spinor: SpinorE2): G2
    squaredNorm(): G2
    scp(rhs: G2): G2
    toExponential(fractionDigits?: number): string;
    toFixed(fractionDigits?: number): string;
    toPrecision(precision?: number): string;
    toString(radix?: number): string;
    static ampere: G2
    static candela: G2
    static coulomb: G2
    static e1: G2
    static e2: G2
    static I: G2
    static kelvin: G2
    static kilogram: G2
    static meter: G2
    static mole: G2
    static one: G2
    static second: G2
    static zero: G2
    static fromVectorE2(vector: VectorE2): G2
    /**
     * Creates a vector from Cartesian coordinates and an optional unit of measure.
     */
    static vector(x: number, y: number, uom?: Unit): G2
  }

  /**
   * A measure with an optional unit of measure.
   */
  class G3 implements VectorE3, SpinorE3 {
    /**
     * The labels to use for the basis vectors.
     * For G3 there must be eight (8) labels.
     * e.g.
     * [['1'], ['e1'], ['e2'], ['e3'],['e12'], ['e23'], ['e32'], ['e123']]
     * or
     * [["1"], ["i"], ["j"], ["k"], ["ij"], ["jk"], ["ki"], ["I"]]
     */
    static BASIS_LABELS: string[][];
    // FIXME: When TypeScript has been upgraded we can do this...
    // static BASIS_LABELS: (string | string[])[];
    static BASIS_LABELS_GEOMETRIC: string[][];
    static BASIS_LABELS_HAMILTON: string[][];
    static BASIS_LABELS_STANDARD: string[][];
    static BASIS_LABELS_STANDARD_HTML: string[][];

    static ampere: G3;
    static candela: G3;
    static coulomb: G3;
    static e1: G3;
    static e2: G3;
    static e3: G3;
    static kelvin: G3;
    static kilogram: G3;
    static meter: G3;
    static mole: G3;
    static one: G3;
    static second: G3;
    static zero: G3;
    /**
     * The scalar component.
     */
    α: number
    alpha: number

    x: number
    y: number
    z: number
    /**
     * The bivector component in the <b>e</b><sub>2</sub><b>e</b><sub>3</sub> plane.
     */
    yz: number
    /**
     * The bivector component in the <b>e</b><sub>3</sub><b>e</b><sub>1</sub> plane.
     */
    zx: number
    /**
     * The bivector component in the <b>e</b><sub>1</sub><b>e</b><sub>2</sub> plane.
     */
    xy: number
    /**
     * The pseudoscalar component.
     */
    β: number
    beta: number
    /**
     * The (optional) unit of measure.
     */
    uom: Unit;
    constructor(α: number, x: number, y: number, z: number, xy: number, yz: number, zx: number, β: number, uom?: Unit)
    add(rhs: G3): G3;
    addPseudo(β: Unit): G3;
    addScalar(α: Unit): G3;
    adj(): G3;
    angle(); G3;
    conj(): G3;
    coordinate(index: number): number;
    cos(): G3;
    cosh(): G3;
    cross(vector: G3): G3;
    cubicBezier(t: number, controlBegin: GeometricE3, controlEnd: GeometricE3, endPoint: GeometricE3): G3;
    distanceTo(point: G3): number;
    div(rhs: G3): G3;
    divByScalar(α: number): G3;
    dual(): G3;
    equals(other: G3): G3;
    exp(): G3;
    ext(rhs: G3): G3;
    /**
     * Extracts the specified grade from this multivector.
     */
    grade(index: number): G3;
    inv(): G3;
    isOne(): boolean;
    isZero(): boolean;
    lco(rhs: G3): G3;
    lerp(target: G3, α: number): G3;
    log(): G3;
    magnitude(): G3;
    mul(rhs: G3): G3;
    neg(): G3;
    norm(): G3;
    pow(exponent: G3): G3;
    quad(): G3;
    quadraticBezier(t: number, controlPoint: GeometricE3, endPoint: GeometricE3): G3;
    rco(rhs: G3): G3;
    reflect(n: VectorE3): G3;
    rev(): G3;
    rotate(s: SpinorE3): G3;
    scale(α: number): G3;
    scp(rhs: G3): G3;
    sin(): G3;
    sinh(): G3;
    slerp(target: G3, α: number): G3;
    sqrt(): G3;
    squaredNorm(): G3;
    sub(rhs: G3): G3;
    toExponential(fractionDigits?: number): string;
    toFixed(fractionDigits?: number): string;
    toPrecision(precision?: number): string;
    toString(radix?: number): string;
    direction(): G3;
    static fromSpinor(spinor: SpinorE3): G3;
    static fromVector(vector: VectorE3): G3;
    /**
     * Computes a random multivector with an optional unit of measure.
     */
    static random(uom?: Unit): G3;
    static scalar(α: number, uom?: Unit): G3;
    static vector(x: number, y: number, z: number, uom?: Unit): G3;
  }

  /**
   *
   */
  class AbstractMatrix {
    elements: Float32Array;
    dimensions: number;
    modified: boolean;
    constructor(elements: Float32Array, dimensions: number);
  }

  /**
   * A 2x2 (square) matrix of <code>number</code>.
   */
  class Matrix2 extends AbstractMatrix {

    /**
     * Constructs a new <code>Matrix2</code> wrapper around a <code>Float32Array</code>.
     * The elements are expected to be in column-major order.
     */
    constructor(elements: Float32Array);

    /**
     * Sets this matrix to the value of <code>this</code> + <code>rhs</code>.
     */
    add(rhs: Matrix2): Matrix2;

    /**
     * Creates a copy of this matrix.
     */
    clone(): Matrix2;

    /**
     * Computes the determinant of this matrix.
     */
    det(): number;

    /**
     * Sets this matrix to its multiplicative inverse.
     */
    inv(): Matrix2;

    /**
     * Determines whether this matrix is the multiplicative identity.
     */
    isOne(): boolean;

    /**
     * Determines whether this matrix is the additive identity.
     */
    isZero(): boolean;

    /**
     * Sets this matrix to the value of <code>this</code> * <code>rhs</code>.
     */
    mul(rhs: Matrix2): Matrix2;

    /**
     * Sets this matrix to the value of <code>a</code> * <code>b</code>.
     */
    mul2(a: Matrix2, b: Matrix2): Matrix2;

    /**
     * Sets this matrix to its additive inverse.
     */
    neg(): Matrix2;

    /**
     * Sets this matrix to the multiplicative identity, <em>1</em>. 
     */
    one(): Matrix2;

    /**
     * <p>
     * Sets this matrix to a matrix that effects a reflection in the
     * line normal to the unit vector <code>n</code>.
     * </p>
     * <p>
     * this ⟼ reflection(<b>n</b>) = I - 2 * <b>n</b><sup>T</sup> * <b>n</b>
     * </p>
     */
    reflection(n: VectorE1): Matrix2;

    /**
     * Computes the row corresponding to the zero-based index, <code>i</code>.
     */
    row(i: number): Array<number>;

    /**
     * Sets this matrix to the value of <code>this</code> * <code>α</code>.
     */
    scale(α: number): Matrix2;

    /**
     * Sets the elements of this matrix.
     * The parameters are in row-major order.
     */
    set(n11: number, n12: number, n21: number, n22: number): Matrix2;

    /**
     * Sets this matrix to the value of <code>this</code> - <code>rhs</code>.
     */
    sub(rhs: Matrix2): Matrix2;

    /**
     * Computes a string representation of this matrix in exponential notation.
     */
    toExponential(fractionDigits?: number): string;

    /**
     * Computes a string representation of this matrix with a fixed number of digits.
     */
    toFixed(fractionDigits?: number): string;

    /**
     *
     */
    toPrecision(precision?: number): string;

    /**
     * Computes a string representation of this matrix.
     */
    toString(radix?: number): string;

    /**
     * Sets this matrix to the additive identity, <em>0</em>. 
     */
    zero(): Matrix2;

    /**
     * Creates a matrix that is the multiplicative identity, <em>1</em>. 
     */
    static one(): Matrix2;

    /**
     * <P>
     * Creates a matrix that effects a reflection in the line normal
     * to the unit vector <code>n</code>.
     * </p>
     * <p>
     * reflection(<b>n</b>) = I - 2 * <b>n</b><sup>T</sup> * <b>n</b>
     * </p>
     */
    static reflection(n: VectorE1): Matrix2;

    /**
     * Creates a matrix that is the additive identity, <em>0</em>. 
     */
    static zero(): Matrix2;
  }

  /**
   * A 3x3 (square) matrix of <code>number</code>.
   */
  class Matrix3 extends AbstractMatrix {

    /**
     * Constructs a new <code>Matrix3</code> wrapper around a <code>Float32Array</code>.
     * The elements are expected to be in column-major order.
     */
    constructor(elements: Float32Array);

    /**
     * Sets this matrix to the value of <code>this</code> + <code>rhs</code>.
     */
    add(rhs: Matrix3): Matrix3;

    /**
     * Creates a copy of this matrix.
     */
    clone(): Matrix3;

    /**
     *
     */
    copy(m: Matrix3): Matrix3;

    /**
     *
     */
    det(): number;

    /**
     *
     */
    inv(): Matrix3;

    /**
     *
     */
    isOne(): boolean;

    /**
     *
     */
    isZero(): boolean;

    /**
     *
     */
    mul(rhs: Matrix3): Matrix3;

    /**
     *
     */
    mul2(a: Matrix3, b: Matrix3): Matrix3;

    /**
     *
     */
    neg(): Matrix3;

    /**
     * Sets this matrix to the identity element for multiplication, <b>1</b>.
     */
    one(): Matrix4;

    reflection(n: VectorE3): Matrix3;
    rotate(spinor: SpinorE2): Matrix3;
    rotation(spinor: SpinorE2): Matrix3;
    row(i: number): number[];
    scale(alpha: number): Matrix3;
    set(m11: number, m12: number, m13: number, m21: number, m22: number, m23: number, m31: number, m32: number, m33: number): Matrix3;
    sub(rhs: Matrix3): Matrix3;
    toString(): string;
    transpose(): Matrix3;
    /**
     * Sets the target to the homogeneous translation matrix,
     *
     * -         -
     * |1  0  a.x|
     * |0  1  a.y|
     * |0  0  1  |
     * -         -
     */
    translation(a: VectorE2): Matrix3;
    zero(): Matrix3;

    /**
     *
     */
    normalFromMatrix4(matrix: Matrix4): void;

    /**
     * Generates a new identity matrix.
     */
    static one(): Matrix3;
    static reflection(n: VectorE2): Matrix3;
    /**
     * Generates the homogeneous (3x3) matrix corresponding to the 2D rotation given by the spinor.
     */
    static rotation(s: SpinorE2): Matrix3;
    /**
     * Generates the homogeneous (3x3) matrix corresponding to the 2D translation given by the vector.
     */
    static translation(a: VectorE2): Matrix3;
    static zero(): Matrix3;
  }

  /**
   *
   */
  class Matrix4 extends AbstractMatrix {
    constructor(elements: Float32Array);

    /**
     * Returns a copy of this matrix instance.
     */
    clone(): Matrix4;

    /**
     *
     */
    compose(scale: VectorE3, attitude: SpinorE3, position: VectorE3): Matrix4;

    /**
     *
     */
    copy(matrix: Matrix4): Matrix4;

    /**
     * Computes the determinant of the matrix.
     */
    det(): number;

    /**
     *
     */
    frustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4;

    /**
     *
     */
    invert(m: Matrix4, throwOnSingular?: boolean): Matrix4;

    /**
     *
     */
    mul(rhs: Matrix4): Matrix4;

    /**
     *
     */
    mul2(a: Matrix4, b: Matrix4): Matrix4;

    /**
     * Generates a new identity matrix.
     */
    static one(): Matrix4;

    /**
     * Sets this matrix to the identity element for multiplication, <b>1</b>.
     */
    one(): Matrix4;

    /**
     *
     */
    reflection(n: VectorE3): Matrix4;

    /**
     *
     */
    rmul(lhs: Matrix4): Matrix4;

    /**
     *
     */
    rotate(spinor: SpinorE3): Matrix4;

    /**
     * Generates a new rotation matrix.
     */
    static rotation(spinor: SpinorE3): Matrix4;

    /**
     *
     */
    rotation(spinor: SpinorE3): Matrix4;

    /**
     *
     */
    rotationAxis(axis: VectorE3, angle: number): Matrix4;

    /**
     *
     */
    row(i): Array<number>;

    /**
     *
     */
    scale(scale: VectorE3): Matrix4;

    /**
     *
     */
    scaleXYZ(scale: VectorE3): Matrix4;

    /**
     * Generates a new scaling matrix.
     */
    static scaling(scale: VectorE3): Matrix4;

    /**
     *
     */
    scaling(scale: VectorE3): Matrix4;

    /**
     *
     */
    toExponential(fractionDigits?: number): string;

    /**
     *
     */
    toFixed(fractionDigits?: number): string;

    /**
     *
     */
    toPrecision(precision?: number): string;

    /**
     *
     */
    toString(radix?: number): string;

    /**
     *
     */
    translate(displacement: VectorE3): Matrix4;

    /**
     * Generates a new translation matrix.
     */
    static translation(vector: VectorE3): Matrix4;

    /**
     *
     */
    translation(displacement: VectorE3): Matrix4;

    /**
     *
     */
    transpose(): Matrix4;

    /**
     * Creates a new matrix with all elements zero.
     */
    static zero(): Matrix4;
  }

  /**
   *
   */
  interface VectorE1 {
    /**
     * The Cartesian x-coordinate.
     */
    x: number;
  }

  /**
   *
   */
  interface VectorE2 {
    /**
     * The Cartesian x-coordinate or <em>abscissa</em>.
     */
    x: number;
    /**
     * The Cartesian y-coordinate or <em>ordinate</em>.
     */
    y: number;
  }

  /**
   *
   */
  interface SpinorE2 extends Scalar, Pseudo {
  }

  /**
   *
   */
  interface GeometricE2 extends Pseudo, Scalar, SpinorE2, VectorE2 {
  }

  /**
   * The Geometric Algebra of the Euclidean plane
   */
  class Geometric2 extends VectorN<number> implements GeometricE2 {
    /**
     * The labels to use for the basis vectors.
     * For Geometric2 there must be four (4) labels.
     * The first is the scalar symbol.
     * The second is the first vector symbol.
     * The third is the second vector symbol.
     * The fourth is the symbol for the pseudoscalar.
     * e.g.
     * [['1'], ['e1'], ['e2'], ['e12']]
     * or
     * [['1'], ['e1'], ['e2'], ['I']]
     * For compass directions you might use
     * [['1'], ['E'], ['N'], ['ccw']]
     * You can also use different symbols depending upon the sign.
     * The symbol for the negative sign goes on the left, positive on the right.
     * [['1'], ['W','E'], ['S','N'], ['clockwise','ccw']]
     * You can also use Unicode symbols
     * 
     */
    static BASIS_LABELS: (string | string[])[];

    static BASIS_LABELS_COMPASS: (string | string[])[];
    static BASIS_LABELS_GEOMETRIC: (string | string[])[];
    static BASIS_LABELS_STANDARD: (string | string[])[];

    /**
     * Constructs a <code>Geometric2</code>.
     * The multivector is initialized to zero.
     */
    constructor();

    /**
     * The coordinate corresponding to the unit standard basis scalar.
     */
    α: number

    /**
     * The coordinate corresponding to the unit standard basis scalar.
     */
    alpha: number

    /**
     * The coordinate corresponding to the <b>e</b><sub>1</sub> standard basis vector.
     */
    x: number;

    /**
     * The coordinate corresponding to the <b>e</b><sub>2</sub> standard basis vector.
     */
    y: number;

    /**
     * The coordinate corresponding to the <b>e</b><sub>1</sub><b>e</b><sub>2</sub> standard basis bivector.
     */
    β: number;

    /**
     * The coordinate corresponding to the <b>e</b><sub>1</sub><b>e</b><sub>2</sub> standard basis bivector.
     */
    beta: number;

    /**
     * <p>
     * <code>this ⟼ this + M * α</code>
     * </p>
     */
    add(M: GeometricE2, α?: number): Geometric2;

    /**
     * <p>
     * <code>this ⟼ a + b</code>
     * </p>
     */
    add2(a: GeometricE2, b: GeometricE2): Geometric2;

    addPseudo(β: number): Geometric2;

    addScalar(α: number): Geometric2;

    /**
     * <p>
     * <code>this ⟼ this + v * α</code>
     * </p>
     */
    addVector(v: VectorE2, α?: number): Geometric2;

    adj(): Geometric2;

    /**
     * The bivector whose area (magnitude) is θ/2, where θ is the radian measure. 
     */
    angle(): Geometric2;

    approx(n: number): Geometric2;

    /**
     *
     */
    clone(): Geometric2;

    /**
     * Sets this <em>multivector</em> to its <em>Clifford conjugate</em>.
     * <p>
     * <code>this ⟼ conj(this)</code>
     * </p>
     */
    conj(): Geometric2;

    /**
     * Sets this multivector to be a copy of another multivector.
     * <p>
     * <code>this ⟼ copy(M)</code>
     * </p>
     */
    copy(M: GeometricE2): Geometric2;

    copyScalar(α: number): Geometric2;

    /**
     * Sets this multivector to be a copy of a spinor.
     * <p>
     * <code>this ⟼ copy(spinor)</code>
     * </p>
     */
    copySpinor(spinor: SpinorE2): Geometric2;

    /**
     * Sets this multivector to be a copy of a vector.
     * <p>
     * <code>this ⟼ copyVector(vector)</code>
     * </p>
     */
    copyVector(vector: VectorE2): Geometric2;

    cos(): Geometric2;

    cosh(): Geometric2;

    cubicBezier(t: number, controlBegin: GeometricE2, controlEnd: GeometricE2, endPoint: GeometricE2): Geometric2;

    /**
     * <p>
     * <code>this ⟼ this / magnitude(this)</code>
     * </p>
     */
    normalize(): Geometric2;

    distanceTo(M: GeometricE2): number;

    /**
     * Sets this multivector to the result of division by another multivector.
     * <p>
     * <code>this ⟼ this / m</code>
     * </p>
     */
    div(m: GeometricE2): Geometric2;

    /**
     * <p>
     * <code>this ⟼ a / b</code>
     * </p>
     */
    div2(a: GeometricE2, b: GeometricE2): Geometric2;

    /**
     * <p>
     * <code>this ⟼ this / α</code>
     * </p>
     */
    divByScalar(α: number): Geometric2;

    /**
     * <p>
     * <code>this ⟼ dual(m) = I * m</code>
     * </p>
     * Notice that the dual of a vector is related to the spinor by the right-hand rule.
     */
    dual(m: GeometricE2): Geometric2;

    equals(M: GeometricE2): boolean;

    /**
     * <p>
     * <code>this ⟼ e<sup>this</sup></code>
     * </p>
     */
    exp(): Geometric2;

    /**
     * <p>
     * <code>this ⟼ this ^ m</code>
     * </p>
     */
    ext(m: GeometricE2): Geometric2;

    /**
     * <p>
     * <code>this ⟼ a ^ b</code>
     * </p>
     */
    ext2(a: GeometricE2, b: GeometricE2): Geometric2;

    grade(grade: number): Geometric2;

    /**
     * <p>
     * <code>this ⟼ conj(this) / quad(this)</code>
     * </p>
     */
    inv(): Geometric2;

    isOne(): boolean;

    isZero(): boolean;

    /**
     * Sets this multivector to the left contraction with another multivector.
     * <p>
     * <code>this ⟼ this << m</code>
     * </p>
     */
    lco(m: GeometricE2): Geometric2;

    /**
     * Sets this multivector to the left contraction of two multivectors. 
     * <p>
     * <code>this ⟼ a << b</code>
     * </p>
     */
    lco2(a: GeometricE2, b: GeometricE2): Geometric2;

    /**
     * <p>
     * <code>this ⟼ this + α * (target - this)</code>
     * </p>
     */
    lerp(target: GeometricE2, α: number): Geometric2;

    /**
     * <p>
     * <code>this ⟼ a + α * (b - a)</code>
     * </p>
     */
    lerp2(a: GeometricE2, b: GeometricE2, α: number): Geometric2;

    /**
     * <p>
     * <code>this ⟼ log(this)</code>
     * </p>
     */
    log(): Geometric2;

    /**
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     */
    magnitude(): number;

    /**
     * <p>
     * <code>this ⟼ this * s</code>
     * </p>
     */
    mul(m: GeometricE2): Geometric2;

    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     */
    mul2(a: GeometricE2, b: GeometricE2): Geometric2;

    /**
     * <p>
     * <code>this ⟼ -1 * this</code>
     * </p>
     */
    neg(): Geometric2;

    /**
     * <p>
     * <code>this ⟼ sqrt(this * conj(this))</code>
     * </p>
     */
    norm(): Geometric2;

    one(): Geometric2;

    pow(): Geometric2;

    /**
     * <p>
     * <code>this ⟼ this | ~this = scp(this, rev(this))</code>
     * </p>
     */
    quad(): Geometric2;

    quadraticBezier(t: number, controlPoint: GeometricE2, endPoint: GeometricE2): Geometric2;

    /**
     * Sets this multivector to the right contraction with another multivector.
     * <p>
     * <code>this ⟼ this >> m</code>
     * </p>
     */
    rco(m: GeometricE2): Geometric2;

    /**
     * Sets this multivector to the right contraction of two multivectors.
     * <p>
     * <code>this ⟼ a >> b</code>
     * </p>
     */
    rco2(a: GeometricE2, b: GeometricE2): Geometric2;

    /**
     * <p>
     * <code>this ⟼ - n * this * n</code>
     * </p>
     */
    reflect(n: VectorE2): Geometric2;

    /**
     * <p>
     * <code>this ⟼ rev(this)</code>
     * </p>
     */
    rev(): Geometric2;

    /**
     * <p>
     * <code>this ⟼ R * this * rev(R)</code>
     * </p>
     */
    rotate(R: SpinorE2): Geometric2;

    /**
     * <p>
     * Sets this multivector to a rotor representing a rotation from a to b.
     * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
     * </p>
     */
    rotorFromDirections(a: VectorE2, b: VectorE2): Geometric2;

    /**
     * <p>
     * <code>this = ⟼ exp(- B * θ / 2)</code>
     * </p>
     */
    rotorFromGeneratorAngle(B: SpinorE2, θ: number): Geometric2;

    /**
     * <p>
     * <code>this ⟼ this * α</code>
     * </p>
     */
    scale(α: number): Geometric2;

    /**
     * <p>
     * <code>this ⟼ scp(this, m)</code>
     * </p>
     */
    scp(m: GeometricE2): Geometric2;

    /**
     * <p>
     * <code>this ⟼ scp(a, b)</code>
     * </p>
     */
    scp2(a: GeometricE2, b: GeometricE2): Geometric2;

    sin(): Geometric2;

    sinh(): Geometric2;

    slerp(target: GeometricE2, α: number): Geometric2;

    /**
     * Computes the squared norm, scp(A, rev(A)).
     */
    squaredNorm(): Geometric2;

    stress(σ: VectorE2): Geometric2;

    /**
     * <p>
     * <code>this ⟼ this - M * α</code>
     * </p>
     */
    sub(M: GeometricE2, α?: number): Geometric2;

    /**
     * <p>
     * <code>this ⟼ a - b</code>
     * </p>
     */
    sub2(a: GeometricE2, b: GeometricE2): Geometric2;

    /**
     * Returns a string representing the number in exponential notation.
     */
    toExponential(fractionDigits?: number): string;

    /**
     * Returns a string representing the number in fixed-point notation.
     */
    toFixed(fractionDigits?: number): string;

    /**
     *
     */
    toPrecision(precision?: number): string;

    /**
     * Returns a string representation of the number.
     */
    toString(radix?: number): string;

    /**
     * <p>
     * <code>this ⟼ a * b = a · b + a ^ b</code>
     * </p>
     * Sets this Geometric2 to the geometric product a * b of the vector arguments.
     */
    versor(a: VectorE2, b: VectorE2): Geometric2;

    zero(): Geometric2;

    /**
     * Creates a copy of a multivector.
     */
    static copy(M: GeometricE2): Geometric2;

    /**
     * The identity element for addition, <b>0</b>.
     */
    static zero(): Geometric2;

    /**
     * Basis vector corresponding to the <code>x</code> coordinate.
     */
    static e1(): Geometric2;

    /**
     * Basis vector corresponding to the <code>y</code> coordinate.
     */
    static e2(): Geometric2;

    static fromCartesian(α: number, x: number, y: number, β: number): Geometric2;

    /**
     * Creates a copy of a spinor.
     */
    static fromSpinor(spinor: SpinorE2): Geometric2;

    /**
     * Creates a copy of a vector.
     */
    static fromVector(vector: VectorE2): Geometric2;

    /**
     * Basis vector corresponding to the <code>β</code> coordinate.
     */
    static I(): Geometric2;

    /**
     * Linear interpolation of two multivectors.
     *
     * A + α * (B - A)
     */
    static lerp(A: GeometricE2, B: GeometricE2, α: number): Geometric2;

    /**
     * The identity element for multiplication, 1.
     * This method creates a new Geometric2 instance.
     */
    static one(): Geometric2;

    /**
     * Computes the rotor corresponding to a rotation from vector <code>a</code> to vector <code>b</code>.
     */
    static rotorFromDirections(a: VectorE2, b: VectorE2): Geometric2;

    /**
     * Creates a copy of a pseudoscalar.
     */
    static scalar(β: number): Geometric2;

    /**
     * Creates a copy of a scalar.
     */
    static scalar(α: number): Geometric2;

    /**
     * Creates a vector from Cartesian coordinates
     */
    static vector(x: number, y: number): Geometric2;

    static zero(): Geometric2;
  }

  /**
   *
   */
  class VectorN<T> {
    coords: T[];
    modified: boolean;
    constructor(coords: T[], modified?: boolean, size?: number);
    clone(): VectorN<T>;
    getComponent(index: number): T;
    pop(): T;
    push(value: T): number;
    setComponent(index: number, value: T): void;
    toArray(array?: T[], offset?: number): T[];
    toLocaleString(): string;
    toString(): string;
  }

  /**
   *
   */
  class Vector1 extends VectorN<number> implements VectorE1 {
    x: number;
    constructor(coords?: number[], modified?: boolean);
  }

  /**
   *
   */
  class Vector2 extends VectorN<number> implements VectorE2 {
    x: number
    y: number
    constructor(coords?: number[], modified?: boolean)
    add(v: VectorE2): Vector2
    add2(a: VectorE2, b: VectorE2): Vector2
    applyMatrix(σ: Matrix2): Vector2
    clone(): Vector2
    copy(v: VectorE2): Vector2
    cubicBezier(t: number, controlBegin: VectorE2, endPoint: VectorE2): Vector2
    distanceTo(point: VectorE2): number
    lerp(v: VectorE2, α: number): Vector2
    lerp2(a: VectorE2, b: VectorE2, α: number): Vector2
    magnitude(): number
    neg(): Vector2
    quadraticBezier(t: number, controlPoint: VectorE2, endPoint: VectorE2): Vector2
    rotate(spinor: SpinorE2): Vector2
    scale(α: number): Vector2
    squaredNorm(): number
    set(x: number, y: number): Vector2
    sub(v: VectorE2): Vector2
    sub2(a: VectorE2, b: VectorE2): Vector2
    toExponential(fractionDigits?: number): string
    toFixed(fractionDigits?: number): string
    toPrecision(precision?: number): string
    toString(radix?: number): string
    zero(): Vector2
    static copy(v: VectorE2): Vector2
    static lerp(a: VectorE2, b: VectorE2, α: number): Vector2
    static random(): Vector2
    static vector(x: number, y: number): Vector2
  }

  class Spinor2 {
  }

  interface Scalar {
    α: number
    alpha: number
  }

  interface Pseudo {
    β: number
    beta: number
  }

  /**
   * The even sub-algebra of <code>G3</code>.
   */
  interface SpinorE3 extends Scalar {
    /**
     * The bivector component in the <b>e</b><sub>2</sub><b>e</b><sub>3</sub> plane.
     */
    yz: number;

    /**
     * The bivector component in the <b>e</b><sub>3</sub><b>e</b><sub>1</sub> plane.
     */
    zx: number;

    /**
     * The bivector component in the <b>e</b><sub>1</sub><b>e</b><sub>2</sub> plane.
     */
    xy: number;
  }

  /**
   * The coordinates for a multivector in 3D in geometric Cartesian basis.
   */
  interface GeometricE3 extends Pseudo, Scalar, SpinorE3, VectorE3 {

  }

  /**
   * A mutable multivector in 3D with a Euclidean metric.
   */
  class Geometric3 extends VectorN<number> implements GeometricE3 {
    /**
     * The coordinate corresponding to the unit standard basis scalar.
     */
    α: number
    alpha: number
    /**
     * The coordinate corresponding to the <b>e</b><sub>1</sub> standard basis vector.
     */
    x: number
    /**
     * The coordinate corresponding to the <b>e</b><sub>2</sub> standard basis vector.
     */
    y: number
    /**
     * The coordinate corresponding to the <b>e</b><sub>3</sub> standard basis vector.
     */
    z: number
    /**
     * The bivector component in the <b>e</b><sub>2</sub><b>e</b><sub>3</sub> plane.
     */
    yz: number
    /**
     * The bivector component in the <b>e</b><sub>3</sub><b>e</b><sub>1</sub> plane.
     */
    zx: number
    /**
     * The coordinate corresponding to the <b>e</b><sub>1</sub><b>e</b><sub>2</sub> standard basis bivector.
     */
    xy: number
    /**
     * The pseudoscalar coordinate of the multivector.
       */
    β: number
    beta: number

    /**
     *
     */
    uom: Unit
    /**
     * Constructs a <code>Geometric3</code>.
     * The multivector is initialized to zero.
     */
    constructor();

    /**
     * <p>
     * <code>this ⟼ this + M * α</code>
     * </p>
     */
    add(M: GeometricE3, α?: number): Geometric3;

    /**
     * <p>
     * <code>this ⟼ a + b</code>
     * </p>
     */
    add2(a: GeometricE3, b: GeometricE3): Geometric3;

    addPseudo(β: number): Geometric3;

    addScalar(α: number): Geometric3;

    /**
     * <p>
     * <code>this ⟼ this + v * α</code>
     * </p>
     */
    addVector(v: VectorE3, α?: number): Geometric3;

    align(m: GeometricE3): Geometric3;

    /**
     * The bivector whose area (magnitude) is θ/2, where θ is the radian measure. 
     */
    angle(): Geometric3;

    /**
     *
     */
    clone(): Geometric3;

    /**
     * Sets this <em>multivector</em> to its <em>Clifford conjugate</em>.
     * <p>
     * <code>this ⟼ conj(this)</code>
     * </p>
     */
    conj(): Geometric3;

    /**
     * <p>
     * <code>this ⟼ copy(M)</code>
     * </p>
     */
    copy(M: GeometricE3): Geometric3;

    /**
     * this ⟼ copy(α)
     */
    copyScalar(α: number): Geometric3;

    /**
     * <p>
     * <code>this ⟼ copy(spinor)</code>
     * </p>
     */
    copySpinor(spinor: SpinorE3): Geometric3;

    /**
     * <p>
     * <code>this ⟼ copyVector(vector)</code>
     * </p>
     */
    copyVector(vector: VectorE3): Geometric3;

    /**
     * this ⟼ this / magnitude(this)
     */
    normalize(): Geometric3;

    /**
     * Sets this multivector to the result of division by another multivector.
     * <p>
     * <code>this ⟼ this / m</code>
     * </p>
     */
    div(m: GeometricE3): Geometric3;

    /**
     * <p>
     * <code>this ⟼ a / b</code>
     * </p>
     * @param a
     * @param b
     */
    div2(a: SpinorE3, b: SpinorE3): Geometric3;

    /**
     * <p>
     * <code>this ⟼ this / α</code>
     * </p>
     */
    divByScalar(α: number): Geometric3;

    /**
     * <p>
     * <code>this ⟼ dual(m) = I * m</code>
     * </p>
     * Notice that the dual of a vector is related to the spinor by the right-hand rule.
     * @param m The vector whose dual will be used to set this spinor.
     */
    dual(m: VectorE3): Geometric3;

    e1(): Geometric3;
    e2(): Geometric3;
    e3(): Geometric3;

    /**
     * <p>
     * <code>this ⟼ e<sup>this</sup></code>
     * </p>
     */
    exp(): Geometric3;

    /**
     * <p>
     * <code>this ⟼ this ^ m</code>
     * </p>
     * @param m
     */
    ext(m: GeometricE3): Geometric3;

    /**
     * <p>
     * <code>this ⟼ a ^ b</code>
     * </p>
     * @param a
     * @param b
     */
    ext2(a: GeometricE3, b: GeometricE3): Geometric3;

    grade(grade: number): Geometric3;

    I(): Geometric3;

    /**
     * <p>
     * <code>this ⟼ conj(this) / quad(this)</code>
     * </p>
     */
    inv(): Geometric3;

    isOne(): boolean;

    isZero(): boolean;

    /**
     * Sets this multivector to the left contraction with another multivector.
     * <p>
     * <code>this ⟼ this << m</code>
     * </p>
     * @param m
     */
    lco(m: GeometricE3): Geometric3;

    /**
     * Sets this multivector to the left contraction of two multivectors. 
     * <p>
     * <code>this ⟼ a << b</code>
     * </p>
     * @param a
     * @param b
     */
    lco2(a: GeometricE3, b: GeometricE3): Geometric3;

    /**
     * <p>
     * <code>this ⟼ this + α * (target - this)</code>
     * </p>
     * @param target
     * @param α
     */
    lerp(target: GeometricE3, α: number): Geometric3;

    /**
     * <p>
     * <code>this ⟼ a + α * (b - a)</code>
     * </p>
     * @param a {GeometricE3}
     * @param b {GeometricE3}
     * @param α {number}
     */
    lerp2(a: GeometricE3, b: GeometricE3, α: number): Geometric3;

    /**
     * <p>
     * <code>this ⟼ log(this)</code>
     * </p>
     */
    log(): Geometric3;

    /**
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     */
    magnitude(): number;

    /**
     * <p>
     * <code>this ⟼ this * s</code>
     * </p>
     * @param m {GeometricE3}
     */
    mul(m: GeometricE3): Geometric3;

    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     * @param a
     * @param b
     */
    mul2(a: GeometricE3, b: GeometricE3): Geometric3;

    /**
     * <p>
     * <code>this ⟼ -1 * this</code>
     * </p>
     */
    neg(): Geometric3;

    /**
     * <p>
     * <code>this ⟼ sqrt(this * conj(this))</code>
     * </p>
     */
    norm(): Geometric3;

    one(): Geometric3;

    /**
     * <p>
     * <code>this ⟼ this | ~this = scp(this, rev(this))</code>
     * </p>
     */
    quad(): Geometric3;

    /**
     * Sets this multivector to the right contraction with another multivector.
     * <p>
     * <code>this ⟼ this >> m</code>
     * </p>
     * @param m
     */
    rco(m: GeometricE3): Geometric3;

    /**
     * Sets this multivector to the right contraction of two multivectors.
     * <p>
     * <code>this ⟼ a >> b</code>
     * </p>
     * @param a
     * @param b
     */
    rco2(a: GeometricE3, b: GeometricE3): Geometric3;

    /**
     * <p>
     * <code>this ⟼ - n * this * n</code>
     * </p>
     * @param n
     */
    reflect(n: VectorE3): Geometric3;

    /**
     * <p>
     * <code>this ⟼ rev(this)</code>
     * </p>
     */
    rev(): Geometric3;

    /**
     * <p>
     * <code>this ⟼ R * this * rev(R)</code>
     * </p>
     * @param R
     */
    rotate(R: SpinorE3): Geometric3;

    /**
     * <p>
     * <code>this = ⟼ exp(- dual(a) * θ / 2)</code>
     * </p>
     * @param axis
     * @param θ
     */
    rotorFromAxisAngle(axis: VectorE3, θ: number): Geometric3;

    /**
     * <p>
     * Sets this multivector to a rotor representing a rotation from a to b.
     * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
     * </p>
     * @param a The <em>from</em> vector.
     * @param b The <em>to</em> vector.
     */
    rotorFromDirections(a: VectorE3, b: VectorE3): Geometric3;

    /**
     * <p>
     * <code>this = ⟼ exp(- B * θ / 2)</code>
     * </p>
     * @param B
     * @param θ
     */
    rotorFromGeneratorAngle(B: SpinorE3, θ: number): Geometric3;

    /**
     * <p>
     * <code>this ⟼ this * α</code>
     * </p>
     * @param α
     */
    scale(α: number): Geometric3;

    /**
     * <p>
     * <code>this ⟼ scp(this, m)</code>
     * </p>
     * @param m
     */
    scp(m: GeometricE3): Geometric3;

    /**
     * <p>
     * <code>this ⟼ scp(a, b)</code>
     * </p>
     * @param a
     * @param b
     */
    scp2(a: GeometricE3, b: GeometricE3): Geometric3;

    /**
     * Computes the <em>squared norm</em> of this multivector.
     */
    squaredNorm(): Geometric3;

    /**
     * <p>
     * <code>this ⟼ this - M * α</code>
     * </p>
     * @param M
     * @param α
     */
    sub(M: GeometricE3, α?: number): Geometric3;

    /**
     * <p>
     * <code>this ⟼ a - b</code>
     * </p>
     * @param a
     * @param b
     */
    sub2(a: GeometricE3, b: GeometricE3): Geometric3;

    /**
     * Returns a string representing the number in exponential notation.
     */
    toExponential(fractionDigits?: number): string;

    /**
     * Returns a string representing the number in fixed-point notation.
     * @param fractionDigits
     */
    toFixed(fractionDigits?: number): string;

    /**
     *
     */
    toPrecision(precision?: number): string;

    /**
     * Returns a string representation of the number.
     */
    toString(radix?: number): string;

    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     * Sets this Geometric3 to the geometric product a * b of the vector arguments.
     * @param a
     * @param b
     */
    versor(a: VectorE3, b: VectorE3): Geometric3;

    wedge(m: GeometricE3): Geometric3;

    /**
     * The identity element for addition, <b>0</b>.
     */
    static zero(): Geometric3;

    /**
     * The identity element for multiplication, <b>1</b>.
     */
    static one(): Geometric3;

    /**
     * Basis vector corresponding to the <code>x</code> coordinate.
     */
    static e1(): Geometric3;

    /**
     * Basis vector corresponding to the <code>y</code> coordinate.
     */
    static e2(): Geometric3;

    /**
     * Basis vector corresponding to the <code>z</code> coordinate.
     */
    static e3(): Geometric3;

    /**
     * Basis vector corresponding to the <code>β</code> coordinate.
     */
    static I(): Geometric3;

    /**
     * Creates a copy of a scalar.
     */
    static fromScalar(scalar: Scalar): Geometric3;

    /**
     * Creates a copy of a spinor.
     */
    static fromSpinor(spinor: SpinorE3): Geometric3;

    /**
     * Creates a copy of a vector.
     */
    static fromVector(vector: VectorE3): Geometric3;

    /**
     * Computes the rotor that rotates vector <code>a</code> to vector <code>b</code>.
     * @param a The <em>from</em> vector.
     * @param b The <em>to</em> vector.
     */
    static rotorFromDirections(a: VectorE3, b: VectorE3): Geometric3;

    /**
     * Constructs a new scalar from a number
     */
    static scalar(α: number): Geometric3;

    /**
     * Constructs a new vector from Cartesian coordinates
     */
    static vector(x: number, y: number, z: number): Geometric3;
  }

  /**
   * The even sub-algebra of <code>Geometric3</code>.
   */
  class Spinor3 extends VectorN<number> implements SpinorE3 {
    /**
     * The bivector component in the <b>e</b><sub>2</sub><b>e</b><sub>3</sub> plane.
     */
    yz: number;

    /**
     * The bivector component in the <b>e</b><sub>3</sub><b>e</b><sub>1</sub> plane.
     */
    zx: number;

    /**
     * The bivector component in the <b>e</b><sub>1</sub><b>e</b><sub>2</sub> plane.
     */
    xy: number;

    /**
     * The coordinate corresponding to the 1 basis scalar.
     */
    α: number;

    /**
     * The coordinate corresponding to the 1 basis scalar.
     */
    alpha: number;

    /**
     * this ⟼ this + spinor * α
     */
    add(spinor: SpinorE3, α?: number): Spinor3

    add2(a: SpinorE3, b: SpinorE3): Spinor3

    addScalar(α: number): Spinor3

    adj(): Spinor3

    /**
     * The bivector whose area (magnitude) is θ/2, where θ is the radian measure. 
     */
    angle(): Spinor3

    approx(n: number): Spinor3

    /**
     * Computes a copy of this spinor.
     */
    clone(): Spinor3

    conj(): Spinor3

    /**
     * Sets this spinor to be a copy of the <code>spinor</code> argument.
     * this ⟼ copy(spinor)
     */
    copy(spinor: SpinorE3): Spinor3

    copyScalar(α: number): Spinor3

    normalize(): Spinor3

    div(s: SpinorE3): Spinor3

    div2(a: SpinorE3, b: SpinorE3): Spinor3

    divByScalar(α: number): Spinor3

    /**
     * this ⟼ dual(v) = I * v
     */
    dual(v: VectorE3, changeSign: boolean): Spinor3

    /**
     * this ⟼ exp(this)
     */
    exp(): Spinor3

    grade(grade: number): Spinor3

    inv(): Spinor3

    lco(rhs: SpinorE3): Spinor3

    lerp(target: SpinorE3, α: number): Spinor3;

    lerp2(a: SpinorE3, b: SpinorE3, α: number): Spinor3;

    /**
     * <p>
     * <code>this ⟼ log(this)</code>
     * </p>
     */
    log(): Spinor3

    magnitude(): number

    mul(rhs: SpinorE3): Spinor3

    /**
     * Sets this Spinor3 to the geometric product of the vectors a and b, a * b.
     */
    mul2(a: SpinorE3, b: SpinorE3): Spinor3

    neg(): Spinor3

    norm(): Spinor3

    quad(): Spinor3

    reflect(n: VectorE3): Spinor3

    rev(): Spinor3

    /**
     * this ⟼ R * this * rev(R)
     */
    rotate(R: SpinorE3): Spinor3

    /**
     * this ⟼ exp(- dual(axis) * θ / 2)
     * <code>axis</code> The direction (unit vector) of the rotation.
     * <code>θ</code> The angle of the rotation, measured in radians.
     */
    rotorFromAxisAngle(axis: VectorE3, θ: number): Spinor3

    /**
     * <p>
     * Sets this multivector to a rotor representing a rotation from a to b.
     * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
     * </p>
     * @param a {VectorE3} The <em>from</em> vector.
     * @param b {VectorE3} The <em>to</em> vector.
     */
    rotorFromDirections(a: VectorE3, b: VectorE3): Spinor3

    /**
     * <p>
     * <code>this = ⟼ exp(- B * θ / 2)</code>
     * </p>
     * @param B {SpinorE3}
     * @param θ {number}
     */
    rotorFromGeneratorAngle(B: SpinorE3, θ: number): Spinor3

    /**
     * this ⟼ this * α
     */
    scale(α: number): Spinor3

    squaredNorm(): Spinor3

    stress(σ: VectorE3): Spinor3

    /**
     * this ⟼ this - spinor * α
     */
    sub(spinor: SpinorE3, α?: number): Spinor3

    /**
     *
     */
    sub2(a: SpinorE3, b: SpinorE3): Spinor3

    toExponential(fractionDigits?: number): string

    toFixed(fractionDigits?: number): string

    toPrecision(precision?: number): string

    toString(radix?: number): string

    /**
     * this ⟼ a * b
     *
     * Sets this Spinor3 to the geometric product, a * b,  of the vector arguments
     */
    versor(a: VectorE3, b: VectorE3): Spinor3
    static copy(spinor: SpinorE3): Spinor3
    static dual(vector: VectorE3, changeSign: boolean): Spinor3
    static lerp(a: SpinorE3, b: SpinorE3, α: number): Spinor3
    static one(): Spinor3
    static rotorFromDirections(a: VectorE3, b: VectorE3): Spinor3
    static spinor(yz: number, zx: number, xy: number, α: number): Spinor3
    static zero(): Spinor3
  }

  /**
   * `Components` of a vector in a 3-dimensional Cartesian coordinate system.
   */
  interface VectorE3 {

    /**
     * The magnitude of the projection onto the standard e1 basis vector. 
     */
    x: number;

    /**
     * The magnitude of the projection onto the standard e2 basis vector. 
     */
    y: number;

    /**
     * The magnitude of the projection onto the standard e2 basis vector. 
     */
    z: number;
  }

  /**
   *
   */
  class Vector3 extends VectorN<number> implements VectorE3 {
    x: number;
    y: number;
    z: number;
    constructor(coordinates?: number[], modified?: boolean);
    /**
     * this += α * vector
     */
    add(vector: VectorE3, α?: number): Vector3;
    applyMatrix(σ: Matrix3): Vector3;
    applyMatrix4(σ: Matrix4): Vector3;
    clone(): Vector3;
    copy(source: VectorE3): Vector3;
    copyCoordinates(coordinates: number[]): Vector3;
    cross(v: VectorE3): Vector3;
    cross2(a: VectorE3, b: VectorE3): Vector3;
    distanceTo(point: VectorE3): number;
    divByScalar(rhs: number): Vector3;
    dot(v: VectorE3): number;
    dual(B: SpinorE3, changeSign: boolean): Vector3;
    lerp(target: VectorE3, α: number): Vector3;
    lerp2(a: VectorE3, b: VectorE3, α: number): Vector3;
    /**
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     */
    magnitude(): number;
    neg(): Vector3;
    normalize(): Vector3;
    quadranceTo(point: VectorE3): number;
    reflect(n: VectorE3): Vector3;
    rotate(R: SpinorE3): Vector3;
    scale(rhs: number): Vector3;
    set(x: number, y: number, z: number): Vector3;
    squaredNorm(): number;
    stress(σ: VectorE3): Vector3;
    sub(vector: VectorE3, α?: number): Vector3;
    toExponential(fractionDigits?: number): string;
    toFixed(fractionDigits?: number): string;
    toPrecision(precision?: number): string;
    toString(radix?: number): string;
    zero(): Vector3;
    static copy(vector: VectorE3): Vector3;
    static dot(a: VectorE3, b: VectorE3): number;
    static isInstance(x: any): boolean;
    static lerp(a: VectorE3, b: VectorE3, α: number): Vector3;
    static random(): Vector3;
    static vector(x: number, y: number, z: number): Vector3;
    static zero(): Vector3;
  }

  /**
   * An immutable vector in Euclidean 3D space with a unit of measure.
   */
  class R3 {
    x: number
    y: number
    z: number
    uom: Unit
    constructor(x: number, y: number, z: number);
    add(rhs: R3, α: number): R3
    divByScalar(α: Unit): R3
    lerp(target: R3, α: number): R3
    magnitude(): Unit
    neg(): R3
    reflect(n: VectorE3): R3
    rotate(R: SpinorE3): R3
    scale(α: Unit): R3
    slerp(target: R3, α: number): R3
    squaredNorm(): Unit
    sub(rhs: R3, α: number): R3
    toExponential(fractionDigits?: number): string
    toFixed(fractionDigits?: number): string
    toPrecision(precision?: number): string
    toString(radix?: number): string
    static direction(vector: VectorE3): R3
    static fromVector(vector: VectorE3, uom: Unit): R3
    static e1: R3
    static e2: R3
    static e3: R3
    static zero: R3
  }

  /**
   *
   */
  interface VectorE4 {
    x: number;
    y: number;
    z: number;
    w: number;
  }

  /**
   *
   */
  class Vector4 extends VectorN<number> implements VectorE4 {
    x: number
    y: number
    z: number
    w: number
    constructor(coords?: number[], modified?: boolean)
    applyMatrix(σ: Matrix4): Vector4
    clone(): Vector4
    copy(v: VectorE4): Vector4
  }

  /**
   * A provider of a collection of 'uniform' variables for use in a WebGL program.
   */
  interface Facet {
    setProperty(name: string, value: number[]): Facet;
    setUniforms(visitor: FacetVisitor): void;
  }

  /**
   *
   */
  interface AbstractColor {
    r: number;
    g: number;
    b: number;
  }

  /**
   *
   */
  class Color extends VectorN<number> implements AbstractColor {
    r: number;
    g: number;
    b: number;
    luminance: number;
    constructor(r: number, g: number, b: number);
    approx(n: number): Color;
    clone(): Color;
    copy(color: AbstractColor): Color;
    lerp(target: AbstractColor, α: number): Color;
    toString(): string;

    static black: Color;
    static blue: Color;
    static cyan: Color;
    static green: Color;
    static red: Color;
    static magenta: Color;
    static yellow: Color;
    static white: Color;
    static gray: Color;
    static copy(color: AbstractColor): Color;
    static fromCoords(coords: number[]): Color;
    static fromHSL(H: number, S: number, L: number): Color;
    static fromRGB(red: number, green: number, blue: number): Color;
    static lerp(a: AbstractColor, b: AbstractColor, α: number): Color;
    static luminance(r: number, g: number, b: number): number
  }

  /**
   * A collection of primitives, one for each canvas.
   */
  interface IGraphicsBuffers extends ContextConsumer {
    /**
     *
     */
    draw(program: Material): void;
  }

  /**
   *
   */
  interface AttribMetaInfo {
    /**
     * The type keyword as it appears in the GLSL shader program.
     */
    glslType: string,
  }

  /**
   *
   */
  interface UniformMetaInfo {
    /**
     * Specifies an optional override of the name used as a key.
     */
    name?: string;
    /**
     * The type keyword as it appears in the GLSL shader program.
     */
    glslType: string;
  }

  /**
   *
   */
  interface ContextProvider extends Shareable {
    gl: WebGLRenderingContext;
  }
  ///////////////////////////////////////////////////////////////////////////////
  /**
   * A set of state variables for graphics modeling in Euclidean 2D space.
   */
  class ModelE2 {
    static PROP_ATTITUDE: string;
    static PROP_POSITION: string;
    /**
     * Attitude (spinor). Initialized to 1.
     */
    R: Geometric2;
    /**
     * Position (vector). Initialized to 0.
     */
    X: Geometric2;
    /**
     *
     */
    constructor();
    getProperty(name: string): number[];
    setProperty(name: string, value: number[]): ModelE2;
  }
  ///////////////////////////////////////////////////////////////////////////////
  /**
   *
   */
  class ModelE3 {
    static PROP_ATTITUDE: string;
    static PROP_POSITION: string;
    /**
     * Attitude (spinor). Initialized to 1.
     */
    R: Geometric3;
    /**
     * Position (vector). Initialized to 0.
     */
    X: Geometric3;
    /**
     *
     */
    constructor();
    getProperty(name: string): number[];
    setProperty(name: string, value: number[]): ModelE3;
  }
  ///////////////////////////////////////////////////////////////////////////////
  /**
   * A collection of properties governing GLSL uniforms for Computer Graphics Modeling.
   */
  class ModelFacet extends ModelE3 {
    /**
     * The matrix that is used for the uniform conventionally named 'uModel'.
     */
    matrix: Matrix4
    /**
     * The overall scale.
     */
    stress: Matrix4
    /**
     * Constructs a ModelFacet at the origin and with unity attitude.
     */
    constructor()
    setProperty(name: string, value: number[]): ModelFacet
    setUniforms(visitor: FacetVisitor): void
  }
  ///////////////////////////////////////////////////////////////////////////////
  /**
   * Record reference count changes and debug reference counts.
   *
   * Instrumenting reference counting:
   *   constructor():
   *     refChange(uuid, 'YourClassName',+1);
   *   addRef():
   *     refChange(uuid, 'YourClassName',+1);
   *   release():
   *     refChange(uuid, 'YourClassName',-1);
   *
   * Debugging reference counts:
   *   Start tracking reference counts:
   *     refChange('start'[, 'where']);
   *     The system will record reference count changes.
   *   Stop tracking reference counts:
   *     refChange('stop'[, 'where']);
   *     The system will compute the total outstanding number of reference counts.
   *   Dump tracking reference counts:
   *     refChange('dump'[, 'where']);
   *     The system will log net reference count changes to the console.
   *   Don't track reference counts (default):
   *     refChange('reset'[, 'where']);
   *     The system will clear statistics and enter will not record changes.
   *   Trace reference counts for a particular class:
   *     refChange('trace', 'YourClassName');
   *     The system will report reference count changes on the specified class.
   *
   * Returns the number of outstanding reference counts for the 'stop' command.
   */
  function refChange(uuid: string, name?: string, change?: number): number;

  /**
   * Canonical variable names, which also act as semantic identifiers for name overrides.
   * These names must be stable to avoid breaking custom vertex and fragment shaders.
   */
  class GraphicsProgramSymbols {
    /**
     * 'aColor'
     */
    static ATTRIBUTE_COLOR: string;
    /**
     * 'aGeometryIndex'
     */
    static ATTRIBUTE_GEOMETRY_INDEX: string;
    /**
     * 'aNormal'
     */
    static ATTRIBUTE_NORMAL: string;
    /**
     * 'aPosition'
     */
    static ATTRIBUTE_POSITION: string;
    /**
     * 'aTextureCoords'
     */
    static ATTRIBUTE_COORDS: string;

    static UNIFORM_AMBIENT_LIGHT: string;
    static UNIFORM_COLOR: string;
    static UNIFORM_DIRECTIONAL_LIGHT_COLOR: string;
    static UNIFORM_DIRECTIONAL_LIGHT_DIRECTION: string;
    static UNIFORM_POINT_LIGHT_COLOR: string;
    static UNIFORM_POINT_LIGHT_POSITION: string;
    static UNIFORM_PROJECTION_MATRIX: string;
    static UNIFORM_REFLECTION_ONE_MATRIX: string;
    static UNIFORM_REFLECTION_TWO_MATRIX: string;
    static UNIFORM_MODEL_MATRIX: string;
    static UNIFORM_NORMAL_MATRIX: string;
    static UNIFORM_VIEW_MATRIX: string;

    static VARYING_COLOR: string;
    static VARYING_LIGHT: string;
  }

  ///////////////////////////////////////////////////////

  /**
   *
   */
  class Scene extends ShareableContextConsumer {
    constructor(engine: Engine)
    add(drawable: AbstractDrawable): void
    contains(drawable: AbstractDrawable)
    contextFree(contextProvider: ContextProvider): void
    contextGain(contextProvider: ContextProvider): void
    contextLost(): void
    protected destructor(): void
    draw(ambients: Facet[]): void
    find(match: (drawable: AbstractDrawable) => boolean): ShareableArray<AbstractDrawable>
    findByName(name: string): ShareableArray<AbstractDrawable>
    findOne(match: (drawable: AbstractDrawable) => boolean): AbstractDrawable
    findOneByName(name: string): AbstractDrawable
    remove(drawable: AbstractDrawable): void
  }

  interface View {
    eye: Geometric3;
    look: Geometric3;
    up: Geometric3;
    setEye(eye: VectorE3): View;
    setLook(look: VectorE3): View;
    setUp(up: VectorE3): View;
  }

  /**
   *
   */
  class PerspectiveCamera extends AbstractFacet implements View {

    /**
     * The aspect ratio of the viewport, i.e., width / height.
     */
    aspect: number;

    /**
     * The position of the camera, a position vector.
     */
    eye: Geometric3;

    /**
     * The distance to the far plane of the viewport.
     */
    far: number;

    /**
     * The field of view is the angle in the camera horizontal plane that the viewport subtends at the camera.
     * The field of view is measured in radians.
     */
    fov: number;

    /**
     * The point (position vector) that the camera looks at.
     */
    look: Geometric3;

    /**
     *The distance to the near plane of the viewport.
     */
    near: number;

    /**
     * The direction that is used to orient the camera. 
     */
    up: Geometric3;

    constructor(fov?: number, aspect?: number, near?: number, far?: number)
    getProperty(name: string): number[]
    setAspect(aspect: number): PerspectiveCamera
    setEye(eye: VectorE3): PerspectiveCamera
    setFar(far: number): PerspectiveCamera
    setFov(fov: number): PerspectiveCamera
    setLook(look: VectorE3): PerspectiveCamera
    setNear(near: number): PerspectiveCamera
    setProperty(name: string, value: number[]): PerspectiveCamera
    setUniforms(visitor: FacetVisitor): void
    setUp(up: VectorE3): PerspectiveCamera
  }

  interface VertexAttribPointer {
    /**
     * The name of the vertex attribute.
     */
    name: string;
    /**
     * The number of values per vertex for this attribute.
     */
    size: number;
    /**
     * Determines what range to use when normalizing values.
     */
    normalized: boolean;
    /**
     * The offset of the values in bytes.
     */
    offset: number
  }

  interface VertexArrays {
    drawMode: DrawMode
    indices: number[]
    attributes: number[]
    stride: number
    pointers: VertexAttribPointer[]
  }

  interface Geometry extends ContextConsumer {
    partsLength: number;
    scaling: Matrix4;
    addPart(geometry: Geometry): void;
    draw(material: Material): void;
    getPart(index: number): Geometry;
    getPrincipalScale(name: string): number;
    hasPrincipalScale(name: string): boolean;
    isLeaf(): boolean;
    removePart(index: number): void;
    setPrincipalScale(name: string, value: number): void;
  }

  class GeometryContainer extends ShareableBase implements Geometry {
    data: VertexArrays;
    partsLength: number;
    scaling: Matrix4;
    constructor();
    addPart(geometry: Geometry): void;
    contextFree(context: ContextProvider): void;
    contextGain(context: ContextProvider): void;
    contextLost(): void;
    draw(material: Material): void;
    getPart(index: number): Geometry;
    getPrincipalScale(name: string): number;
    hasPrincipalScale(name: string): boolean;
    isLeaf(): boolean;
    removePart(index: number): void;
    setPrincipalScale(name: string, value: number): void;
  }

  /**
   * A Geometry for supporting drawArrays.
   */
  class GeometryArrays extends ShareableContextConsumer implements Geometry {
    drawMode: DrawMode
    partsLength: number;
    scaling: Matrix4;
    /**
     *
     */
    constructor(engine: Engine);
    protected destructor(levelUp: number): void;
    addPart(geometry: Geometry): void;
    draw(material: Material): void;
    getAttribute(name: string): Attribute;
    getPart(index: number): Geometry;
    getPrincipalScale(name: string): number;
    hasPrincipalScale(name: string): boolean;
    isLeaf(): boolean;
    removePart(index: number): void;
    setAttribute(name: string, attribute: Attribute): void;
    setPrincipalScale(name: string, value: number): void;
  }

  class GeometryElements extends ShareableContextConsumer implements Geometry {
    attributes: number[]
    drawMode: DrawMode;
    indices: number[];
    partsLength: number;
    pointers: VertexAttribPointer[];
    scaling: Matrix4;
    /**
     * The total number of bytes for each element.
     */
    stride: number;
    constructor(data: VertexArrays, engine: Engine);
    protected destructor(levelUp: number): void;
    addPart(geometry: Geometry): void;
    draw(material: Material): void;
    getPart(index: number): Geometry;
    getPrincipalScale(name: string): number;
    hasPrincipalScale(name: string): boolean;
    isLeaf(): boolean;
    removePart(index: number): void;
    setPrincipalScale(name: string, value: number): void;
  }

  interface GeometryBuilder {
    stress: Vector3
    tilt: Spinor3
    offset: Vector3
    toGeometry(): Geometry
  }

  class ArrowBuilder implements GeometryBuilder {
    heightCone: number
    offset: Vector3
    radiusCone: number
    radiusShaft: number
    sliceAngle: number
    stress: Vector3
    thetaSegments: number
    tilt: Spinor3
    useNormal: boolean
    usePosition: boolean
    useTextureCoord: boolean
    constructor(e: VectorE3, cutLine: VectorE3, clockwise: boolean)
    toGeometry(): Geometry
  }

  class ConicalShellBuilder implements GeometryBuilder {
    height: number
    offset: Vector3
    radius: number
    radialSegments: number
    sliceAngle: number
    stress: Vector3
    thetaSegments: number
    tilt: Spinor3
    useNormal: boolean
    usePosition: boolean
    useTextureCoord: boolean
    constructor(e: VectorE3, cutLine: VectorE3, clockwise: boolean)
    toGeometry(): Geometry
  }

  class CylinderBuilder implements GeometryBuilder {
    offset: Vector3
    openBase: boolean
    openCap: boolean
    sliceAngle: number
    stress: Vector3
    tilt: Spinor3
    useNormal: boolean
    usePosition: boolean
    useTextureCoord: boolean
    constructor(e: VectorE3, cutLine: VectorE3, clockwise: boolean)
    boundary(times?: number): void
    toGeometry(): Geometry
  }

  class CylindricalShellBuilder implements GeometryBuilder {
    height: number
    offset: Vector3
    radialSegments: number
    radius: number
    sliceAngle: number
    stress: Vector3
    thetaSegments: number
    tilt: Spinor3
    useNormal: boolean
    usePosition: boolean
    useTextureCoord: boolean
    constructor(e: VectorE3, cutLine: VectorE3, clockwise: boolean)
    toGeometry(): Geometry
  }

  class RingBuilder implements GeometryBuilder {
    innerRadius: number
    offset: Vector3
    outerRadius: number
    radialSegments: number
    sliceAngle: number
    stress: Vector3
    thetaSegments: number
    tilt: Spinor3
    useNormal: boolean
    usePosition: boolean
    useTextureCoord: boolean
    constructor(e: VectorE3, cutLine: VectorE3, clockwise: boolean)
    toGeometry(): Geometry
  }

  /**
   *
   */
  class MaterialBase extends ShareableContextConsumer implements Material {
    attributeNames: string[];
    fragmentShaderSrc: string;
    vertexShaderSrc: string;
    constructor(vertexShaderSrc: string, fragmentShaderSrc: string, attribs: string[], engine: Engine);
    contextFree(contextProvider: ContextProvider): void;
    contextGain(contextProvider: ContextProvider): void;
    contextLost(): void;
    protected destructor(levelUp: number): void;
    disableAttrib(name: string): void;
    disableAttribs(): void;
    enableAttrib(name: string): void;
    enableAttribs(): void;
    getAttribLocation(name: string): number;
    getUniformLocation(name: string): UniformLocation;
    hasUniformLocation(name: string): boolean;
    mat2(name: string, matrix: Matrix2, transpose: boolean): void;
    mat3(name: string, matrix: Matrix3, transpose: boolean): void;
    mat4(name: string, matrix: Matrix4, transpose: boolean): void;
    uniform1f(name: string, x: number): void;
    uniform2f(name: string, x: number, y: number): void;
    uniform3f(name: string, x: number, y: number, z: number): void;
    uniform4f(name: string, x: number, y: number, z: number, w: number): void;
    use(): void;
    vec2(name: string, vector: VectorE2): void;
    vec3(name: string, vector: VectorE3): void;
    vec4(name: string, vector: VectorE4): void;
    vector2fv(name: string, data: Float32Array): void;
    vector3fv(name: string, data: Float32Array): void;
    vector4fv(name: string, data: Float32Array): void;
    vertexPointer(name: string, size: number, normalized: boolean, stride: number, offset: number): void;
  }

  interface AbstractDrawable extends ContextConsumer {
    fragmentShaderSrc: string;
    geometry: Geometry;
    material: Material;
    name: string;
    vertexShaderSrc: string;
    visible: boolean;
  }


  /**
   * A collection of primitives, a single graphics program, and some facets.
   * The primitives provide attribute arguments to the graphics program.
   * The facets provide uniform arguments to the graphics program. 
   */
  class Drawable extends ShareableContextConsumer implements AbstractDrawable {

    /**
     *
     */
    fragmentShaderSrc: string;

    /**
     *
     */
    geometry: Geometry;

    /**
     *
     */
    material: Material;

    /**
     * A user-assigned name that allows the composite object to be found.
     */
    name: string;

    /**
     *
     */
    vertexShaderSrc: string;

    /**
     * Determines whether this Drawable will be rendered.
     */
    visible: boolean;

    /**
     *
     */
    constructor(geometry: Geometry, material: Material, engine: Engine);

    contextFree(manager: ContextProvider): void;
    contextGain(manager: ContextProvider): void;
    contextLost(): void;

    protected destructor(levelUp: number): void;

    draw(ambients: Facet[]): void;

    /**
     * Gets a facet of this composite object by name.
     * Facets provide uniform arguments to the graphics program.
     */
    getFacet(name: string): Facet;

    /**
     * Sets a facet of this composite object by name.
     * Facets provide uniform arguments to the graphics program.
     */
    setFacet(name: string, facet: Facet): void;

    setUniforms(): void;
  }

  /**
   * A material based upon scripts in a DOM.
   */
  class HTMLScriptsMaterial extends MaterialBase {
    /**
     *
     */
    constructor(scriptIds: string[], dom: Document, attribs: string[], engine: Engine);
    protected destructor(levelUp: number): void;
  }

  interface PointMaterialOptions {

    /**
     *
     */
    attributes?: { [name: string]: number }

    /**
     *
     */
    uniforms?: { [name: string]: string }
  }

  /**
   *
   */
  class PointMaterial extends MaterialBase {
    constructor(options: PointMaterialOptions, engine: Engine);
    protected destructor(levelUp: number): void;
  }

  interface LineMaterialOptions {

    /**
     *
     */
    attributes?: { [name: string]: number }

    /**
     *
     */
    uniforms?: { [name: string]: string }
  }

  /**
   *
   */
  class LineMaterial extends MaterialBase {
    constructor(options: LineMaterialOptions, engine: Engine)
    protected destructor(levelUp: number): void;
  }

  interface MeshMaterialOptions {

    /**
     *
     */
    attributes?: { [name: string]: number }

    /**
     *
     */
    uniforms?: { [name: string]: string }
  }

  /**
   *
   */
  class MeshMaterial extends MaterialBase {
    constructor(options: MeshMaterialOptions, engine: Engine);
    protected destructor(levelUp: number): void;
  }

  /**
   *
   */
  class MeshNormalMaterial extends MaterialBase {
    constructor();
  }

  class AbstractFacet implements Facet {
    getProperty(name: string): number[];
    setProperty(name: string, value: number[]): Facet;
    setUniforms(visitor: FacetVisitor): void;
  }

  class AmbientLight extends AbstractFacet {
    color: Color;
    constructor(color: AbstractColor);
  }

  /**
   *
   */
  class ColorFacet extends AbstractFacet implements AbstractColor {
    r: number;
    g: number;
    b: number;
    α: number
    constructor(name?: string);
    scaleRGB(α: number): ColorFacet;
    scaleRGBA(α: number): ColorFacet;
    setColorRGB(color: AbstractColor): ColorFacet;
    setRGB(red: number, green: number, blue: number): ColorFacet;
    setRGBA(red: number, green: number, blue: number, alpha: number): ColorFacet;
  }

  /**
   * <code>DirectionalLight</code> provides two uniform values.
   * GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION
   * GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR
   */
  class DirectionalLight extends AbstractFacet {
    /**
     * The <em>direction</em> (unit vector) in which the light is travelling.
     */
    direction: Geometric3;
    /**
     * The <em>color</em> of the light.
     */
    color: Color;
    /**
     * Constructs a <code>DirectionalLight</code>.
     * [direction = -e3] The initial direction.
     * [color = white] The initial color.
     */
    constructor(direction?: VectorE3, color?: AbstractColor);
    /**
     * Sets the <code>direction</code> property by copying a vector.
     * The direction is normalized to be a unit vector.
     * @param direction
     */
    setDirection(direction: VectorE3): DirectionalLight;
  }


  class PointSizeFacet extends AbstractFacet {
    pointSize: number
    constructor(pointSize?: number);
  }

  /**
   * A (name: string, vector: Vector3) pair that can be used to set a uniform variable.
   */
  class Vector3Facet extends AbstractFacet {
    constructor(name: string, vector: Vector3);
  }

  /**
   *
   */
  class ReflectionFacetE2 extends ShareableBase implements Facet {
    /**
     * The vector perpendicular to the (hyper-)plane of reflection.
     */
    public normal: Vector2;

    /**
     * @param name The name of the uniform variable associated with this facet.
     */
    constructor(name: string);

    /**
     * @param name
     */
    getProperty(name: string): Array<number>;

    /**
     * @param name
     * @param value
     */
    setProperty(name: string, value: Array<number>): ReflectionFacetE2;

    /**
     *
     */
    setUniforms(visitor: FacetVisitor): void;
  }

  /**
   *
   */
  class ReflectionFacetE3 extends ShareableBase implements Facet {
    /**
     * The vector perpendicular to the (hyper-)plane of reflection.
     *
     */
    public normal: Vector3;

    /**
     * @param name The name of the uniform variable associated with this facet.
     */
    constructor(name: string);

    /**
     * @param name
     */
    getProperty(name: string): Array<number>;

    /**
     * @param name
     * @param value
     */
    setProperty(name: string, value: Array<number>): ReflectionFacetE3;

    /**
     *
     */
    setUniforms(visitor: FacetVisitor): void;
  }

  /**
   * The enumerated blending factors for use with <code>WebGLBlendFunc</code>.
   * Assuming destination with RGBA values of (R<sub>d</sub>, G<sub>d</sub>, B<sub>d</sub>, A<sub>d</sub>),
   * and source fragment with values (R<sub>s</sub>, G<sub>s</sub>, B<sub>s</sub>, A<sub>s</sub>),
   * <ul>
   * <li>R<sub>result</sub> = R<sub>s</sub> * S<sub>r</sub> + R<sub>d</sub> * D<sub>r</sub></li>
   * </ul>
   */
  enum BlendFactor {
    /**
     *
     */
    DST_ALPHA,

    /**
     *
     */
    DST_COLOR,

    /**
     *
     */
    ONE,

    /**
     *
     */
    ONE_MINUS_DST_ALPHA,

    /**
     *
     */
    ONE_MINUS_DST_COLOR,

    /**
     *
     */
    ONE_MINUS_SRC_ALPHA,

    /**
     *
     */
    ONE_MINUS_SRC_COLOR,

    /**
     *
     */
    SRC_ALPHA,

    /**
     *
     */
    SRC_ALPHA_SATURATE,

    /**
     *
     */
    SRC_COLOR,

    /**
     *
     */
    ZERO
  }

  /**
   * `blendFunc(sfactor: number, dfactor: number): void`
   */
  class WebGLBlendFunc extends ShareableBase {
    sfactor: BlendFactor;
    dfactor: BlendFactor;
    constructor(sfactor: BlendFactor, dfactor: BlendFactor);

    /**
     *
     */
    contextFree(manager: ContextProvider): void;

    /**
     *
     */
    contextGain(manager: ContextProvider): void;

    /**
     *
     */
    contextLost(): void;
  }

  /**
   * `clearColor(red: number, green: number, blue: number, alpha: number): void`
   */
  class WebGLClearColor extends ShareableBase {
    red: number;
    green: number;
    blue: number;
    alpha: number;
    constructor(red?: number, green?: number, blue?: number, alpha?: number);
    /**
     *
     */
    contextFree(manager: ContextProvider): void;
    /**
     *
     */
    contextGain(manager: ContextProvider): void;
    /**
     *
     */
    contextLost(): void;
  }

  /**
   * A capability that may be enabled or disabled for a <code>WebGLRenderingContext</code>.
   */
  enum Capability {
    /**
     * Blend computed fragment color values with color buffer values.
     */
    BLEND,

    /**
     * Let polygons be culled.
     */
    CULL_FACE,

    /**
     * Enable updates of the depth buffer.
     */
    DEPTH_TEST,

    /**
     * Add an offset to the depth values of a polygon's fragments.
     */
    POLYGON_OFFSET_FILL,

    /**
     * Abandon fragments outside a scissor rectangle.
     */
    SCISSOR_TEST
  }

  /**
   * `disable(capability: number): void`
   */
  class WebGLDisable extends ShareableBase {
    /**
     *
     */
    constructor(capability: Capability);
    /**
     *
     */
    contextFree(manager: ContextProvider): void;
    /**
     *
     */
    contextGain(manager: ContextProvider): void;
    /**
     *
     */
    contextLost(): void;
  }

  /**
   * `enable(capability: number): void`
   */
  class WebGLEnable extends ShareableBase {
    /**
     *
     */
    constructor(capability: Capability);
    /**
     *
     */
    contextFree(manager: ContextProvider): void;
    /**
     *
     */
    contextGain(manager: ContextProvider): void;
    /**
     *
     */
    contextLost(): void;
  }

  ///////////////////////////////////////////////////////////////////////////////
  /**
   *
   */
  interface AbstractMesh extends AbstractDrawable {
    /**
     * Color
     */
    color: Color;
    /**
     * Attitude (spinor)
     */
    R: Geometric3;
    /**
     * Position (vector)
     */
    X: Geometric3;
    /**
     * Stress (tensor)
     */
    stress: Matrix4;
  }
  ///////////////////////////////////////////////////////////////////////////////
  /**
   * A Mesh is a Decorator for a Drawable.
   * A Mesh adds attitude, color, position, and scale properties to a Drawable
   * which are implemented as Facet(s).
   */
  class Mesh extends Drawable implements AbstractMesh {
    /**
     * Color
     */
    color: Color;
    /**
     * Attitude (spinor)
     */
    R: Geometric3;
    /**
     * Stress (tensor)
     */
    stress: Matrix4;
    /**
     * Position (vector)
     */
    X: Geometric3;
    /**
     *
     */
    constructor(geometry: Geometry, material: Material, engine: Engine);
    /**
     *
     */
    protected destructor(levelUp: number): void;
    getPrincipalScale(name: string): number;
    protected setPrincipalScale(name: string, value: number): void;
  }
  ///////////////////////////////////////////////////////////////////////////////
  /**
   *
   */
  class RigidBodyWithUnits extends ShareableBase {
    /**
     * Axis (vector)
     */
    axis: G3
    /**
     * Angular momentum (bivector)
     */
    L: G3
    /**
     * Mass (scalar)
     */
    m: G3
    /**
     * Momentum (vector)
     */
    P: G3
    /**
     * Charge
     */
    Q: G3
    /**
     * Attitude (spinor)
     */
    R: G3
    /**
     * Position (vector)
     */
    X: G3
    /**
     *
     */
    constructor(mesh: Mesh, axis: VectorE3);
    protected destructor(levelUp: number): void;
  }
  ///////////////////////////////////////////////////////////////////////////////
  /**
   * Decorates the Mesh by adding properties for physical modeling.
   */
  class RigidBody extends Mesh {
    /**
     * Axis (vector).
     * The axis of the RigidBody.
     */
    public axis: Geometric3;
    /**
     *
     */
    public initialAxis: R3;
    /**
     * Angular momentum (bivector)
     */
    public L: Geometric3;
    /**
     * Mass (scalar)
     */
    public m: number;
    /**
     * Momentum (vector)
     */
    public P: Geometric3;
    /**
     * Charge
     */
    public Q: Geometric3;
    /**
     *
     */
    constructor(geometry: Geometry, material: Material, engine: Engine, initialAxis: VectorE3);
    protected destructor(levelUp: number): void;
  }

  class Arrow extends Mesh {

    /**
     * The vector from the tail of the Arrow to the head of the Arrow.
     */
    h: Geometric3;

    constructor(
      options?: {
        attitude?: SpinorE3;
        color?: AbstractColor;
        engine?: Engine;
        offset?: VectorE3;
        position?: VectorE3;
        tilt?: SpinorE3;
        vector?: VectorE3;
      });
    protected destructor(levelUp: number): void;
  }

  class Box extends Mesh {
    width: number;
    height: number;
    depth: number;
    constructor(
      options?: {
        attitude?: SpinorE3;
        color?: AbstractColor;
        depth?: number;
        engine?: Engine;
        height?: number;
        offset?: VectorE3;
        openBack?: boolean;
        openBase?: boolean;
        openCap?: boolean;
        openFront?: boolean;
        openLeft?: boolean;
        openRight?: boolean;
        position?: VectorE3;
        tilt?: SpinorE3;
        width?: number;
      })
  }

  class Cylinder extends RigidBody {
    length: number;
    radius: number;
    constructor(
      options?: {
        attitude?: SpinorE3;
        axis?: VectorE3;
        color?: AbstractColor;
        engine?: Engine;
        length?: number;
        offset?: VectorE3;
        openBase?: boolean;
        openCap?: boolean;
        openWall?: boolean;
        position?: VectorE3;
        radius?: number;
        tilt?: SpinorE3;
      })
  }

  class Curve extends Mesh {
    constructor(
      options?: {
        aColor?: (u: number) => AbstractColor;
        aPosition?: (u: number) => VectorE3;
        attitude?: SpinorE3;
        color?: AbstractColor;
        drawMode?: DrawMode;
        engine?: Engine;
        offset?: VectorE3;
        position?: VectorE3;
        tilt?: SpinorE3;
        uMax?: number;
        uMin?: number;
        uSegments?: number;
      })
  }

  class Grid extends Mesh {
    constructor(
      options?: {
        aColor?: (u: number, v: number) => AbstractColor;
        aNormal?: (u: number, v: number) => VectorE3;
        aPosition?: (u: number, v: number) => VectorE3;
        attitude?: SpinorE3;
        color?: AbstractColor;
        drawMode?: DrawMode;
        engine?: Engine;
        offset?: VectorE3;
        position?: VectorE3;
        tilt?: SpinorE3;
        uMax?: number;
        uMin?: number;
        uSegments?: number;
        vMax?: number;
        vMin?: number;
        vSegments?: number;
      })
  }

  class Sphere extends RigidBody {
    radius: number;
    constructor(
      options?: {
        attitude?: SpinorE3;
        color?: AbstractColor;
        engine?: Engine;
        offset?: VectorE3;
        position?: VectorE3;
        radius?: number;
        tilt?: SpinorE3;
      })
  }

  class Tetrahedron extends Mesh {
    radius: number;
    constructor(
      options?: {
        attitude?: SpinorE3;
        color?: AbstractColor;
        engine?: Engine;
        offset?: VectorE3;
        position?: VectorE3;
        tilt?: SpinorE3;
      })
    protected destructor(levelUp: number): void;
  }
  ///////////////////////////////////////////////////////////////////////////////
  /**
   *
   */
  interface TrailConfig {
    /**
     * Determines whether the trail will record historical events and draw them.
     * Default is true.
     */
    enabled: boolean;
    /**
     * Determines the number of animation frames between the recording of events.
     * Default is 10.
     */
    interval: number;
    /**
     * Determines the maximum number of historical events that form the trail.
     * Default is 10.
     */
    retain: number;
  }
  ///////////////////////////////////////////////////////////////////////////////
  /**
   *
   */
  class Trail extends ShareableBase {
    /**
     *
     */
    config: TrailConfig
    /**
     * Constructs a trail for the specified mesh.
     */
    constructor(mesh: Mesh);
    protected destructor(levelUp: number): void;
    /**
     * Draws the mesh in its historical positions and attitudes.
     */
    draw(ambients: Facet[]): void;
    /**
     * Erases the trail history.
     */
    erase(): void;
    /**
     * Records the graphics model variables.
     */
    snapshot(): void;
  }
  ///////////////////////////////////////////////////////////////////////////////
  /**
   *
   */
  class Viewport extends ShareableBase {
    ambients: Facet[];
    ambLight: AmbientLight;
    camera: PerspectiveCamera;
    dirLight: DirectionalLight;
    height: number;
    /**
     * The Scene associated with this Viewport.
     * This property is a strong reference to the Scene.
     */
    scene: Scene;
    width: number;
    x: number;
    y: number;
    constructor(engine: Engine);
    protected destructor(levelUp?: number): void;
    public draw(): void;
    public setPortal(x: number, y: number, width: number, height: number): void;
  }
  ///////////////////////////////////////////////////////////////////////////////
  /**
   *
   */
  interface SingleViewAppOptions extends AnimationAppOptions {
  }
  ///////////////////////////////////////////////////////////////////////////////
  /**
   *
   */
  class SingleViewApp extends AnimationApp {
    protected view: Viewport;
    constructor(options?: SingleViewAppOptions);
    protected destructor(): void;
    protected draw(): void;
    protected initialize(): void;
  }
  ///////////////////////////////////////////////////////////////////////////////
  /**
   *
   */
  interface MultiViewAppOptions extends AnimationAppOptions {
    numViews?: number;
  }
  ///////////////////////////////////////////////////////////////////////////////
  /**
   *
   */
  class MultiViewApp extends AnimationApp {
    protected views: ShareableArray<Viewport>;
    constructor(options?: MultiViewAppOptions);
    protected destructor(): void;
    protected draw(): void;
    protected initialize(): void;
  }
  ///////////////////////////////////////////////////////////////////////////////
  /**
   *
   */
  interface World extends Shareable {
    ambientLight: AmbientLight;
    ambients: Facet[];
    canvas: HTMLCanvasElement;
    add(mesh: Drawable): void;
  }
  ///////////////////////////////////////////////////////////////////////////////
  /**
   *
   */
  function bootstrap(
    canvasId: string,
    animate: (timestamp: number) => any,
    options?: {
      height?: number;
      memcheck?: boolean;
      onload?: () => any;
      onunload?: () => any;
      width?: number;
    }): World;
  ///////////////////////////////////////////////////////////////////////////////
  /**
   *
   */
  class MouseControls extends ShareableBase {
    enabled: boolean;
    maxDistance: number;
    minDistance: number;
    protected moveCurr: Geometric2;
    protected movePrev: Geometric2;
    noPan: boolean;
    noRotate: boolean;
    noZoom: boolean;
    protected panEnd: Geometric2;
    protected panStart: Geometric2;
    protected zoomEnd: Geometric2;
    protected zoomStart: Geometric2;
    constructor(wnd: Window);
    protected destructor(levelUp: number): void;
    handleResize(): void;
    move(x: number, y: number): void;
    reset(): void;
    subscribe(domElement: HTMLElement): void;
    unsubscribe(): void;
  }
  ///////////////////////////////////////////////////////////////////////////////
  /**
   *
   */
  interface ViewController {
    /**
     * Called during the animation loop to update the target.
     */
    update(): void;
    /**
     * Reset the view to the last synchronization point.
     */
    reset(): void;
    /**
     * Called at any time to set a view for this controller.
     */
    setView(view: View): void;
    /**
     * Synchronizes this controller with the view.
     */
    synchronize(): void;
  }
  ///////////////////////////////////////////////////////////////////////////////
  /**
   *
   */
  class ViewControls extends MouseControls implements ViewController {
    protected eyeMinusLook: Geometric3;
    protected look: Geometric3;
    public panSpeed: number;
    public rotateSpeed: number;
    protected view: View;
    public zoomSpeed: number;
    constructor(view: View, wnd: Window);
    protected destructor(levelUp: number): void;
    /**
     *
     */
    protected panCamera(): void;
    /**
     * Resets the camera position and attitude.
     */
    reset(): void;
    /**
     *
     */
    protected rotateCamera(): void;
    /**
     * Sets the view being controlled vythe view controller.
     */
    setView(view: View): void;
    /**
     * Synchronizes this controller with the view.
     */
    synchronize(): void;
    /**
     * Updates the camera position and attitude based upon movement of the mouse controls.
     */
    update(): void;
    /**
     *
     */
    protected zoomCamera(): void;
  }
  ///////////////////////////////////////////////////////////////////////////////
  /**
   *
   */
  class OrbitControls extends ViewControls {
    constructor(view: View, wnd: Window);
    protected destructor(levelUp: number): void;
  }
  ///////////////////////////////////////////////////////////////////////////////
  /**
   *
   */
  class TrackballControls extends ViewControls {
    constructor(view: View, wnd: Window)
    protected destructor(): void
  }
  ///////////////////////////////////////////////////////////////////////////////
  /**
   * Universal cosine function.
   */
  function cos<T>(x: T): T;
  /**
   * Universal hyperbolic cosine function.
   */
  function cosh<T>(x: T): T;
  /**
   * Universal exponential function.
   */
  function exp<T>(x: T): T;
  /**
   * Universal (natural) logarithm function.
   */
  function log<T>(x: T): T;
  /**
   *
   */
  function norm<T>(x: T): T;
  /**
   *
   */
  function quad<T>(x: T): T;
  /**
   * Universal sine function.
   */
  function sin<T>(x: T): T;
  /**
   * Universal hyperbolic sine function.
   */
  function sinh<T>(x: T): T;
  /**
   *
   */
  function sqrt<T>(x: T): T;
  ///////////////////////////////////////////////////////////////////////////////
}

declare module 'eight' {
  export = EIGHT;
}
