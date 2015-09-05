var GeometryAdapter = require('../geometries/GeometryAdapter');
var SphereGeometry = require('../geometries/SphereGeometry');
var adapterOptions = require('../mesh/adapterOptions');
function sphereGeometry(options) {
    options = options || {};
    return new SphereGeometry(options.radius, options.widthSegments, options.heightSegments, options.phiStart, options.phiLength, options.thetaStart, options.thetaLength);
}
function sphereMesh(options) {
    var base = new GeometryAdapter(sphereGeometry(options), adapterOptions(options));
    var refCount = 0;
    var publicAPI = {
        draw: function () {
            return base.draw();
        },
        update: function () {
            return base.update();
        },
        getAttribArray: function (name) {
            return base.getAttribArray(name);
        },
        getAttribData: function () {
            return base.getAttribData();
        },
        getAttribMeta: function () {
            return base.getAttribMeta();
        },
        get drawMode() {
            return base.drawMode;
        },
        set drawMode(value) {
            base.drawMode = value;
        },
        get dynamic() {
            return base.dynamic;
        },
        hasElementArray: function () {
            return base.hasElementArray();
        },
        getElementArray: function () {
            return base.getElementArray();
        },
        addRef: function () {
            refCount++;
        },
        release: function () {
            refCount--;
            if (refCount === 0) {
                base.release();
            }
        },
        contextFree: function () {
            return base.contextFree();
        },
        contextGain: function (context) {
            return base.contextGain(context);
        },
        contextLoss: function () {
            return base.contextLoss();
        },
        hasContext: function () {
            return base.hasContext();
        }
    };
    return publicAPI;
}
module.exports = sphereMesh;