import IUnknown = require('../core/IUnknown');
import refChange = require('../utils/refChange');
import uuid4 = require('../utils/uuid4');

let LOGGING_NAME = 'NumberIUnknownMap';

class NumberIUnknownMap<V extends IUnknown> implements IUnknown {
  private _refCount = 1;
  private _elements: { [key: number]: V } = {};
  private _uuid = uuid4().generate();
  constructor() {
    refChange(this._uuid, LOGGING_NAME, +1);
  }
  addRef() {
    refChange(this._uuid, LOGGING_NAME, +1);
    this._refCount++;
    return this._refCount;
  }
  release() {
    refChange(this._uuid, LOGGING_NAME, -1);
    this._refCount--;
    if (this._refCount === 0) {
      let self = this;
      this.forEach(function(key) {
        self.put(key, void 0);
      });
      this._elements = void 0;
    }
    return this._refCount;
  }
  exists(key: number): boolean {
    let element = this._elements[key];
    return element ? true : false;
  }
  get(key: number): V {
    let element = this._elements[key];
    if (element) {
      element.addRef();
      return element;
    }
    else {
      return void 0;
    }
  }
  put(key: number, value: V): void {
    let existing = this._elements[key];
    if (existing) {
      if (value) {
        if (existing === value) {
          // do nothing
        }
        else {
          existing.release();
          value.addRef();
          this._elements[key] = value;
        }
      }
      else {
        existing.release();
        this._elements[key] = void 0;
      }
    }
    else {
      // There is no entry at the key specified.
      if (value) {
        value.addRef();
        this._elements[key] = value;
      }
      else {
        // do nothing.
      }
    }
  }
  forEach(callback: (key: number, value: V) => void) {
    let keys: number[] = this.keys;
    var i: number;
    let length: number = keys.length;
    for (i = 0; i < length; i++) {
      let key: number = keys[i];
      let value = this._elements[key];
      callback(key, value);
    }
  }
  get keys(): number[] {
    // TODO: memoize?
    return Object.keys(this._elements).map(function(keyString){return parseFloat(keyString)});
  }
  remove(key: number) {
    this.put(key, void 0);
    delete this._elements[key];
  }
}

export = NumberIUnknownMap;