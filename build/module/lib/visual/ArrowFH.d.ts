import { Facet } from '../..';
import { Color } from '../core/Color';
import { ContextManager } from '../core/ContextManager';
import { Renderable } from '../core/Renderable';
import { Geometric3 } from '../math/Geometric3';
import { VectorE3 } from '../math/VectorE3';
import { ArrowOptions } from './ArrowOptions';
/**
 * An arrow with a fixed head and variable length.
 */
export declare class ArrowFH implements Renderable {
    private readonly head;
    private readonly tail;
    private readonly $vector;
    private $vectorLock;
    private readonly $position;
    private $positionLock;
    private readonly $attitude;
    private $attitudeLock;
    private $isHeadVisible;
    /**
     * @param contextManager This will usually be provided by the `Engine`.
     * @param options
     * @param levelUp Leave as zero unless you are extending this class.
     */
    constructor(contextManager: ContextManager, options?: Partial<ArrowOptions>, levelUp?: number);
    name?: string;
    transparent?: boolean;
    render(ambients: Facet[]): void;
    contextFree?(): void;
    contextGain?(): void;
    contextLost?(): void;
    addRef?(): number;
    release?(): number;
    get vector(): VectorE3;
    set vector(vector: VectorE3);
    get length(): number;
    set length(length: number);
    isZombie(): boolean;
    get X(): Geometric3;
    set X(X: Geometric3);
    get position(): Geometric3;
    set position(position: Geometric3);
    get R(): Geometric3;
    set R(R: Geometric3);
    get attitude(): Geometric3;
    set attitude(attitude: Geometric3);
    get axis(): VectorE3;
    set axis(axis: VectorE3);
    get color(): Color;
    set color(color: Color);
    private setPosition;
    private setAttitude;
    private updateHeadPosition;
    private updateHeadAttitude;
}