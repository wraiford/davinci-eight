/// <reference path="../worlds/World.d.ts" />
/// <reference path="../core/Drawable.d.ts" />
var object3D = require('davinci-eight/core/object3D');
var world = function () {
    var drawables = [];
    var drawGroups = {};
    // TODO: What do we want out of the base object3D?
    var base = object3D();
    var gl;
    var contextId;
    var publicAPI = {
        get drawGroups() { return drawGroups; },
        get children() { return drawables; },
        contextFree: function (context) {
            for (var i = 0, length = drawables.length; i < length; i++) {
                drawables[i].contextFree(context);
            }
        },
        contextGain: function (context, contextId) {
            gl = context;
            contextId = contextId;
            drawables.forEach(function (drawable) {
                drawable.contextGain(context, contextId);
                var groupName = drawable.drawGroupName;
                if (!drawGroups[groupName]) {
                    drawGroups[groupName] = [];
                }
                drawGroups[groupName].push(drawable);
            });
        },
        contextLoss: function () {
            drawables.forEach(function (drawable) {
                drawable.contextLoss();
            });
            gl = void 0;
            contextId = void 0;
        },
        hasContext: function () {
            return !!gl;
        },
        add: function (child) {
            drawables.push(child);
        }
    };
    return publicAPI;
};
module.exports = world;