import Facet from '../core/Facet'
import IContextProvider from '../core/IContextProvider'
import ShareableArray from '../collections/ShareableArray'
import ShareableContextListener from '../core/ShareableContextListener'
import IDrawable from '../core/IDrawable'

/**
 * A simple list of meshes that does not bypass the draw method of the IDrawable.
 * This allows the IDrawable to override the draw method to produce history and draw trails.
 */
export default class DrawList extends ShareableContextListener {
    private _meshes: ShareableArray<IDrawable>

    constructor() {
        super('DrawList')
        this._meshes = new ShareableArray<IDrawable>()
    }

    protected destructor(): void {
        this._meshes.release()
        super.destructor()
    }

    add(mesh: IDrawable): void {
        // Don't return the index because we don't want to guarantee the order.
        this._meshes.push(mesh)
    }

    draw(ambients: Facet[]) {
        const iLen = this._meshes.length
        for (let i = 0; i < iLen; i++) {
            const mesh = this._meshes.getWeakRef(i)
            mesh.draw(ambients)
        }
    }

    contextFree(context: IContextProvider): void {
        const iLen = this._meshes.length
        for (let i = 0; i < iLen; i++) {
            const mesh = this._meshes.getWeakRef(i)
            mesh.contextFree(context)
        }
        super.contextFree(context)
    }

    contextGain(context: IContextProvider): void {
        const iLen = this._meshes.length
        for (let i = 0; i < iLen; i++) {
            const mesh = this._meshes.getWeakRef(i)
            mesh.contextGain(context)
        }
        super.contextGain(context)
    }

    contextLost(): void {
        const iLen = this._meshes.length
        for (let i = 0; i < iLen; i++) {
            const mesh = this._meshes.getWeakRef(i)
            mesh.contextLost()
        }
        super.contextLost()
    }
}
