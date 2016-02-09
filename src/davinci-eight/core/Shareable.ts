import mustBeString from '../checks/mustBeString';
import readOnly from '../i18n/readOnly';
import refChange from './refChange';
import IUnknown from '../core/IUnknown';
import uuid4 from './uuid4';

/**
 * @module EIGHT
 * @submodule core
 * @class Shareable
 */
export default class Shareable implements IUnknown {
    private _refCount: number = 1
    protected _type: string
    private _uuid = uuid4().generate()
    /**
     * <p>
     * Convenient base class for derived classes implementing <code>IUnknown</code>.
     * </p>
     * @class Shareable
     * @extends IUnknown
     * @constructor
     * @param type {string} The human-readable name of the derived type.
     */
    constructor(type: string) {
        this._type = mustBeString('type', type)
        refChange(this._uuid, type, +1)
    }

    isZombie(): boolean {
        return typeof this._refCount === 'undefined';
    }

    /**
     * <p>
     * Notifies this instance that something is dereferencing it.
     * </p>
     *
     * @method addRef
     * @return {number} The new value of the reference count.
     */
    addRef(): number {
        this._refCount++
        refChange(this._uuid, this._type, +1)
        return this._refCount
    }

    /**
     * <p>
     * Notifies this instance that something is dereferencing it.
     * </p>
     *
     * @method release
     * @return {number} The new value of the reference count.
     */
    release(): number {
        this._refCount--
        refChange(this._uuid, this._type, -1)
        const refCount = this._refCount
        if (refCount === 0) {
            // destructor called with `true` means grumble if the method has not been overridden.
            this.destructor(true)
            // refCount is used to indicate zombie status so let that go to undefined.
            this._refCount = void 0
            // Keep the type and uuid around for debugging reference count problems.
            // this._type = void 0
            // this._uuid = void 0
        }
        return refCount;
    }

    /**
     * <p>
     * Outputs a warning to the console that this method should be implemented by the derived class.
     * </p>
     * <p>
     * <em>This method should be implemented by derived classes.</em>
     * </p>
     * <p>
     * <em>Not implementing this method in a derived class risks leaking resources allocated by the derived class.</em>
     * </p>
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(grumble = false): void {
        if (grumble) {
            console.warn("`protected destructor(): void` method should be implemented by `" + this._type + "`.")
        }
    }

    /**
     * @property uuid
     * @type {string}
     * @readOnly
     */
    get uuid(): string {
        return this._uuid
    }
    set uuid(unused: string) {
        throw new Error(readOnly('uuid').message)
    }
}
