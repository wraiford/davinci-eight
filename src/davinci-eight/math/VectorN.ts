import Mutable from '../math/Mutable';
import expectArg from '../checks/expectArg';
import isDefined from '../checks/isDefined';
import isUndefined from '../checks/isUndefined';

function constructorString(T: string): string {
    return "new VectorN<" + T + ">(data: " + T + "[], modified: boolean = false, size?: number)";
}

function pushString(T: string): string {
    return "push(value: " + T + "): number";
}

function popString(T: string): string {
    return "pop(): " + T;
}

function contextNameKind(context: string, name: string, kind: string): string {
    return name + " must be a " + kind + " in " + context;
}

function contextNameLength(context: string, name: string, length: number): string {
    return name + " length must be " + length + " in " + context;
}

function ctorDataKind(): string {
    return contextNameKind(constructorString('T'), 'data', 'T[]');
}

function ctorDataLength(length: number): () => string {
    return function(): string {
        return contextNameLength(constructorString('T'), 'data', length);
    };
}

function verboten(operation: string): string {
    return operation + " is not allowed for a fixed size vector";
}

function verbotenPush(): string {
    return verboten(pushString('T'));
}

function verbotenPop(): string {
    return verboten(popString('T'));
}

function ctorModifiedKind(): string {
    return contextNameKind(constructorString('T'), 'modified', 'boolean');
}

function ctorSizeKind(): string {
    return contextNameKind(constructorString('T'), 'size', 'number');
}

/**
 * @class VectorN<T>
 */
export default class VectorN<T> implements Mutable<T[]> {
    private _size: number;
    private _data: T[];
    private _callback: () => T[];
    /**
     * @property modified
     * @type {boolean}
     */
    public modified: boolean;
    /**
     * @class VectorN<T>
     * @constructor
     * @param data {T[]}
     * @param modified [boolean = false]
     * @param [size]
     */
    constructor(data: T[], modified = false, size?: number) {
        let dataArg = expectArg('data', data).toBeObject(ctorDataKind);
        this.modified = expectArg('modified', modified).toBeBoolean(ctorModifiedKind).value;
        if (isDefined(size)) {
            this._size = expectArg('size', size).toBeNumber(ctorSizeKind).toSatisfy(size >= 0, "size must be positive").value;
            this._data = dataArg.toSatisfy(data.length === size, ctorDataLength(size)()).value;
        }
        else {
            this._size = void 0;
            this._data = dataArg.value;
        }
    }

    /**
     * @property data
     * @type {T[]}
     */
    get coords(): T[] {
        if (this._data) {
            return this._data;
        }
        else if (this._callback) {
            var data = this._callback();
            if (isDefined(this._size)) {
                expectArg('callback()', data).toSatisfy(data.length === this._size, "callback() length must be " + this._size);
            }
            return this._callback();
        }
        else {
            throw new Error("Vector" + this._size + " is undefined.");
        }
    }
    set coords(data: T[]) {
        if (isDefined(this._size)) {
            expectArg('data', data).toSatisfy(data.length === this._size, "data length must be " + this._size);
        }
        this._data = data;
        this._callback = void 0;
        this.modified = true;
    }
    /**
     * @property callback
     * @type {() => T[]}
     */
    get callback(): () => T[] {
        return this._callback;
    }
    set callback(reactTo: () => T[]) {
        this._callback = reactTo;
        this._data = void 0;
        this.modified = true;
    }
    /**
     * @property length
     * @type {number}
     * @readOnly
     */
    get length(): number {
        return this.coords.length;
    }
    /**
     * @method clone
     * @return {VectorN<T>}
     */
    clone(): VectorN<T> {
        return new VectorN<T>(this._data, this.modified, this._size);
    }
    /**
     * @method getComponent
     * @param index {number}
     * @return {T}
     */
    getComponent(index: number): T {
        return this.coords[index];
    }
    /**
     * @method pop
     * @return {T}
     */
    pop(): T {
        if (isUndefined(this._size)) {
            return this.coords.pop();
        }
        else {
            throw new Error(verbotenPop());
        }
    }
    /**
     * @method push
     * @param value {T}
     * @return {number}
     */
    push(value: T): number {
        if (isUndefined(this._size)) {
            let data = this.coords;
            let newLength = data.push(value);
            this.coords = data;
            return newLength;
        }
        else {
            throw new Error(verbotenPush());
        }
    }

    /**
     * @method setComponent
     * @param index {number}
     * @param value {T}
     * @return {void}
     */
    setComponent(index: number, value: T): void {
        let data: T[] = this.coords;
        let existing = data[index];
        if (value !== existing) {
            data[index] = value;
            this.coords = data;
            this.modified = true;
        }
    }
    /**
     * @method toArray
     * @param [array = []] {T[]}
     * @param [offset = 0] {number}
     * @return {T[]}
     */
    toArray(array: T[] = [], offset = 0): T[] {
        let data = this.coords;
        let length = data.length;
        for (var i = 0; i < length; i++) {
            array[offset + i] = data[i];
        }
        return array;
    }
    /**
     * @method toLocaleString
     * @return {string}
     */
    toLocaleString(): string {
        return this.coords.toLocaleString();
    }
    /**
     * @method toString
     * @return {string}
     */
    toString(): string {
        return this.coords.toString();
    }
}
