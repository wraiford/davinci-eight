import LinearElement = require('../math/LinearElement');
/**
 * This interface is provided to ensure consistency.
 * It is not part of the documented API.
 */
interface GeometricElement<I, M, S, V, D> extends LinearElement<I, M, S, V> {
  /**
   * The principle value of the rotation angle caused by a rotor.
   */
  arg(): number;
  // conjugate multiplied by norm (similar to inv).
  // adj(): M;
  /**
   * Conjugate
   */
  conj(): M;
  /**
   * Left contraction
   */
  lco(rhs: I): M;
  /**
   * Right contraction
   */
  rco(rhs: I): M;
  /**
   * divide really only applies to division algebras.
   */
  div(rhs: I): M;
  dual(m: D): M;
  exp(): M;
  inv(): M;
  log(): M;
  /**
   * abs(x) = |x|
   */
  magnitude(): number; // FIXME: This method drops units.
  /**
   *
   */
  mul(rhs: I): M;
  /**
   * squared norm, ||x|| = align(x, reverse(x))
   */
  norm(): M;
  /**
   * squared norm, ||x|| = align(x, reverse(x))
   */
  quaditude(): number; // FIXME: This method drops units. Some authors might call this `det`
  /**
   * Reverse
   */
  reverse(): M;
  /**
   * Scalar Product
   */
  align(rhs: I): M;
  /**
   * Outer Product.
   */
  wedge(rhs: I): M;
}

export = GeometricElement;
