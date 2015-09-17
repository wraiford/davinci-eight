var Color = require('../core/Color');
var expectArg = require('../checks/expectArg');
// FIXME: refChange for the renderer.
// FIXME: multi-context monitors: etc
// FIXME; Remove attributes
var renderer = function (canvas) {
    // FIXME: Replace.
    expectArg('canvas', canvas).toSatisfy(canvas instanceof HTMLCanvasElement, "canvas argument must be an HTMLCanvasElement");
    var $context = void 0;
    var refCount = 1;
    var autoClear = true;
    var clearColor = Color.fromRGB(0, 0, 0);
    var clearAlpha = 0;
    function drawHandler(drawable) {
        drawable.draw();
    }
    var self = {
        get canvas() { return canvas; },
        get context() { return $context; },
        addRef: function () {
            refCount++;
            // console.log("renderer.addRef() => " + refCount);
            return refCount;
        },
        release: function () {
            refCount--;
            // console.log("renderer.release() => " + refCount);
            if (refCount === 0) {
                $context = void 0;
            }
            return refCount;
        },
        contextFree: function () {
            $context = void 0;
        },
        contextGain: function (manager) {
            // FIXME: multi-context
            var context = manager.context;
            //let attributes: WebGLContextAttributes = context.getContextAttributes();
            //console.log(context.getParameter(context.VERSION));
            //console.log("alpha                 => " + attributes.alpha);
            //console.log("antialias             => " + attributes.antialias);
            //console.log("depth                 => " + attributes.depth);
            //console.log("premultipliedAlpha    => " + attributes.premultipliedAlpha);
            //console.log("preserveDrawingBuffer => " + attributes.preserveDrawingBuffer);
            //console.log("stencil               => " + attributes.stencil);
            $context = context;
            context.clearColor(clearColor.r, clearColor.g, clearColor.b, clearAlpha);
            context.clearDepth(1.0);
            context.enable($context.DEPTH_TEST);
            context.depthFunc($context.LEQUAL);
            context.viewport(0, 0, canvas.width, canvas.height);
        },
        contextLoss: function () {
            $context = void 0;
        },
        get autoClear() {
            return autoClear;
        },
        set autoClear(value) {
            autoClear = expectArg('autoClear', value).toBeBoolean().value;
        },
        clearColor: function (red, green, blue, alpha) {
            clearColor.r = expectArg('red', red).toBeNumber().value;
            clearColor.g = expectArg('green', green).toBeNumber().value;
            clearColor.b = expectArg('blue', blue).toBeNumber().value;
            clearAlpha = expectArg('alpha', alpha).toBeNumber().value;
            if ($context) {
                $context.clearColor(red, green, blue, alpha);
            }
        },
        render: function (drawList) {
            if ($context) {
                if (autoClear) {
                    $context.clear($context.COLOR_BUFFER_BIT | $context.DEPTH_BUFFER_BIT);
                }
            }
            else {
                console.warn("renderer is unable to clear because WebGLRenderingContext is missing");
            }
            drawList.traverse(drawHandler);
        }
    };
    return self;
};
module.exports = renderer;
