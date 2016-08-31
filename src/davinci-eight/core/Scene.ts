import {Facet} from '../core/Facet';
import ContextManager from './ContextManager';
import ContextProvider from '../core/ContextProvider';
import mustBeObject from '../checks/mustBeObject';
import {Renderable} from '../core/Renderable';
import ShareableArray from '../collections/ShareableArray';
import {ShareableContextConsumer} from '../core/ShareableContextConsumer';

/**
 * A collection of drawable objects.
 */
export class Scene extends ShareableContextConsumer {

    private _drawables: ShareableArray<Renderable>;

    /**
     * @param contextManager
     */
    constructor(contextManager: ContextManager, levelUp = 0) {
        super(contextManager);
        this.setLoggingName('Scene');
        mustBeObject('contextManager', contextManager);
        this._drawables = new ShareableArray<Renderable>([]);
        if (levelUp === 0) {
            this.synchUp();
        }
    }

    /**
     * @param levelUp
     */
    protected destructor(levelUp: number): void {
        if (levelUp === 0) {
            this.cleanUp();
        }
        this._drawables.release();
        super.destructor(levelUp + 1);
    }

    /**
     * <p>
     * Adds the <code>drawable</code> to this <code>Scene</code>.
     * </p>
     *
     * @param drawable
     */
    add(drawable: Renderable): void {
        mustBeObject('drawable', drawable);
        this._drawables.push(drawable);
        this.synchUp();
    }

    /**
     * @param drawable
     * @returns `true` if the drawable is contained in this scene, otherwise `false`.
     */
    contains(drawable: Renderable): boolean {
        mustBeObject('drawable', drawable);
        return this._drawables.indexOf(drawable) >= 0;
    }

    /**
     * Traverses the collection of AbstractDrawable objects, calling render(ambients) on each one.
     * The rendering takes place in two stages.
     * In the first stage, non-transparent objects are drawn.
     * In the second state, transparent objects are drawn.
     *
     * @param ambients
     */
    draw(ambients: Facet[]): void {
        const gl = this.gl;
        if (gl) {
            const ds = this._drawables;
            const iLen = ds.length;
            /**
             * true is non-transparent objects exist.
             */
            let passOne = false;
            /**
             * true if transparent objects exist.
             */
            let passTwo = false;
            // Zeroth pass through objects determines what kind of objects exist.
            for (let i = 0; i < iLen; i++) {
                const d = ds.getWeakRef(i);
                if (d.transparent) {
                    passTwo = true;
                }
                else {
                    passOne = true;
                }
            }
            if (passOne || passTwo) {
                if (passTwo) {
                    const previousMask: boolean = gl.getParameter(gl.DEPTH_WRITEMASK);
                    if (passOne) {
                        // Render non-transparent objects in the first pass.
                        gl.depthMask(true);
                        for (let i = 0; i < iLen; i++) {
                            const d = ds.getWeakRef(i);
                            if (!d.transparent) {
                                d.render(ambients);
                            }
                        }
                    }
                    // Render transparent objects in the second pass.
                    gl.depthMask(false);
                    for (let i = 0; i < iLen; i++) {
                        const d = ds.getWeakRef(i);
                        if (d.transparent) {
                            d.render(ambients);
                        }
                    }
                    gl.depthMask(previousMask);
                }
                else {
                    // There must be non-transparent objects, render them.
                    for (let i = 0; i < iLen; i++) {
                        const d = ds.getWeakRef(i);
                        if (!d.transparent) {
                            d.render(ambients);
                        }
                    }
                }
            }
        }
    }

    /**
     * @param match
     */
    find(match: (drawable: Renderable) => boolean): ShareableArray<Renderable> {
        return this._drawables.find(match);
    }

    /**
     * @param match
     */
    findOne(match: (drawable: Renderable) => boolean): Renderable {
        return this._drawables.findOne(match);
    }

    /**
     * @param name
     */
    findOneByName(name: string): Renderable {
        return this.findOne(function(drawable) { return drawable.name === name });
    }

    /**
     * @param name
     */
    findByName(name: string): ShareableArray<Renderable> {
        return this.find(function(drawable) { return drawable.name === name });
    }

    /**
     * <p>
     * Removes the <code>drawable</code> from this <code>Scene</code>.
     * </p>
     *
     * @param drawable
     */
    remove(drawable: Renderable): void {
        // TODO: Remove the appropriate parts from the scene.
        mustBeObject('drawable', drawable);
        const index = this._drawables.indexOf(drawable);
        if (index >= 0) {
            this._drawables.splice(index, 1).release();
        }
    }

    /**
     * @param context
     */
    contextFree(context: ContextProvider): void {
        for (let i = 0; i < this._drawables.length; i++) {
            const drawable = this._drawables.getWeakRef(i);
            drawable.contextFree(context);
        }
        super.contextFree(context);
    }

    /**
     * @param context
     */
    contextGain(context: ContextProvider): void {
        for (let i = 0; i < this._drawables.length; i++) {
            const drawable = this._drawables.getWeakRef(i);
            drawable.contextGain(context);
        }
        super.contextGain(context);
    }

    /**
     *
     */
    contextLost(): void {
        for (let i = 0; i < this._drawables.length; i++) {
            const drawable = this._drawables.getWeakRef(i);
            drawable.contextLost();
        }
        super.contextLost();
    }
}
