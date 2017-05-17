"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @deprecated
 */
function computePointers(attributes, aNames) {
    var aNamesLen = aNames.length;
    var pointers = [];
    var offset = 0;
    for (var a = 0; a < aNamesLen; a++) {
        var aName = aNames[a];
        var attrib = attributes[aName];
        // FIXME: It's a lot more complicated choosing these parameters than for the simple FLOAT case.
        pointers.push({ name: aName, size: attrib.size, type: attrib.type, normalized: true, offset: offset });
        offset += attrib.size * 4; // We're assuming that the data type is gl.FLOAT
    }
    return pointers;
}
exports.computePointers = computePointers;
