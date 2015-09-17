import ContextManager = require('../core/ContextManager');
import ICamera = require('../scene/ICamera');
import IProgram = require('../core/IProgram');
import UniformData = require('../core/UniformData');
import UniformDataVisitor = require('../core/UniformDataVisitor');
import Vector3 = require('../math/Vector3');
/**
 * @module EIGHT
 * @class PerspectiveCamera
 * @implements ICamera
 * @implements UniformData
 */
declare class PerspectiveCamera implements ICamera, UniformData {
    position: Vector3;
    private _refCount;
    private _uuid;
    material: IProgram;
    constructor(fov?: number, aspect?: number, near?: number, far?: number);
    addRef(): number;
    accept(visitor: UniformDataVisitor): void;
    contextFree(): void;
    contextGain(manager: ContextManager): void;
    contextLoss(): void;
    draw(): void;
    release(): number;
}
export = PerspectiveCamera;
