/// <reference path="../geometries/Geometry.d.ts" />
define(["require", "exports"], function (require, exports) {
    var RGBGeometry = (function () {
        function RGBGeometry() {
        }
        RGBGeometry.prototype.draw = function (context) {
            context.drawElements(context.POINTS, this.elements.length, context.UNSIGNED_SHORT, 0);
        };
        RGBGeometry.prototype.dynamic = function () {
            return false;
        };
        RGBGeometry.prototype.getAttributes = function () {
            return [
                { name: 'aVertexPosition', size: 3 },
                { name: 'aVertexColor', size: 3 }
            ];
        };
        RGBGeometry.prototype.getElements = function () {
            return this.elements;
        };
        RGBGeometry.prototype.getVertexAttribArrayData = function (name) {
            switch (name) {
                case 'aVertexPosition': {
                    return this.vertices;
                }
                case 'aVertexColor': {
                    return this.vertexColors;
                }
                default: {
                    return;
                }
            }
        };
        RGBGeometry.prototype.update = function (time) {
            var vs = [
                0, 0, 1,
                0, 0, 0,
                1, 0, 1,
                1, 0, 0,
                0, 1, 1,
                0, 1, 0,
                1, 1, 1,
                1, 1, 0
            ].map(function (coord) { return coord - 0.5; });
            var cs = [
                0, 0, 0,
                0, 0, 1,
                0, 1, 0,
                0, 1, 1,
                1, 0, 0,
                1, 0, 1,
                1, 1, 0,
                1, 1, 1 // white
            ];
            //var ls: number[] = [0,1,0,2,0,4,1,3,1,5,2,3,2,6,3,7,4,6,5,7,4,5,6,7];
            //this.lines = new Uint16Array(ls);
            var ps = [0, 1, 2, 3, 4, 5, 6, 7];
            this.elements = new Uint16Array(ps);
            this.vertices = new Float32Array(vs);
            this.vertexColors = new Float32Array(cs);
        };
        return RGBGeometry;
    })();
    return RGBGeometry;
});