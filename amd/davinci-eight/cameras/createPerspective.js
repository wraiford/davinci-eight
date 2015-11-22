define(["require", "exports", '../cameras/createView', '../math/Mat4R', '../core/GraphicsProgramSymbols', '../math/R1', '../checks/isUndefined', '../checks/expectArg', '../cameras/perspectiveMatrix'], function (require, exports, createView, Mat4R, GraphicsProgramSymbols, R1, isUndefined, expectArg, computePerspectiveMatrix) {
    /**
     * @function createPerspective
     * @constructor
     * @param fov {number}
     * @param aspect {number}
     * @param near {number}
     * @param far {number}
     * @return {Perspective}
     */
    var createPerspective = function (options) {
        options = options || {};
        var fov = new R1([isUndefined(options.fov) ? 75 * Math.PI / 180 : options.fov]);
        var aspect = new R1([isUndefined(options.aspect) ? 1 : options.aspect]);
        var near = new R1([isUndefined(options.near) ? 0.1 : options.near]);
        var far = new R1([expectArg('options.far', isUndefined(options.far) ? 2000 : options.far).toBeNumber().value]);
        var projectionMatrixName = isUndefined(options.projectionMatrixName) ? GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX : options.projectionMatrixName;
        var refCount = 1;
        var base = createView(options);
        var projectionMatrix = Mat4R.one();
        var matrixNeedsUpdate = true;
        var self = {
            addRef: function () {
                refCount++;
                return refCount;
            },
            release: function () {
                refCount--;
                return refCount;
            },
            get uuid() {
                return "";
            },
            getProperty: function (name) {
                return void 0;
            },
            setProperty: function (name, value) {
            },
            // Delegate to the base camera.
            get eye() {
                return base.eye;
            },
            set eye(eye) {
                base.eye = eye;
            },
            setEye: function (eye) {
                base.setEye(eye);
                return self;
            },
            get look() {
                return base.look;
            },
            set look(value) {
                base.look = value;
            },
            setLook: function (look) {
                base.setLook(look);
                return self;
            },
            get up() {
                return base.up;
            },
            set up(value) {
                base.up = value;
            },
            setUp: function (up) {
                base.setUp(up);
                return self;
            },
            get fov() {
                return fov.x;
            },
            set fov(value) {
                self.setFov(value);
            },
            setFov: function (value) {
                expectArg('fov', value).toBeNumber();
                matrixNeedsUpdate = matrixNeedsUpdate || fov.x !== value;
                fov.x = value;
                return self;
            },
            get aspect() {
                return aspect.x;
            },
            set aspect(value) {
                self.setAspect(value);
            },
            setAspect: function (value) {
                expectArg('aspect', value).toBeNumber();
                matrixNeedsUpdate = matrixNeedsUpdate || aspect.x !== value;
                aspect.x = value;
                return self;
            },
            get near() {
                return near.x;
            },
            set near(value) {
                self.setNear(value);
            },
            setNear: function (value) {
                expectArg('near', value).toBeNumber();
                matrixNeedsUpdate = matrixNeedsUpdate || near.x !== value;
                near.x = value;
                return self;
            },
            get far() {
                return far.x;
            },
            set far(value) {
                self.setFar(value);
            },
            setFar: function (value) {
                expectArg('far', value).toBeNumber();
                matrixNeedsUpdate = matrixNeedsUpdate || far.x !== value;
                far.x = value;
                return self;
            },
            setUniforms: function (visitor, canvasId) {
                if (matrixNeedsUpdate) {
                    computePerspectiveMatrix(fov.x, aspect.x, near.x, far.x, projectionMatrix);
                    matrixNeedsUpdate = false;
                }
                visitor.mat4(projectionMatrixName, projectionMatrix, false, canvasId);
                base.setUniforms(visitor, canvasId);
            }
        };
        return self;
    };
    return createPerspective;
});
