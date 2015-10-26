define(["require", "exports", '../checks/isDefined'], function (require, exports, isDefined) {
    function dotVectorsE2(a, b) {
        if (isDefined(a) && isDefined(b)) {
            return a.x * b.x + a.y * b.y;
        }
        else {
            return void 0;
        }
    }
    return dotVectorsE2;
});
