define(["require", "exports", '../glsl/tokenizeString', '../glsl/parser'], function (require, exports, tokenizeString, parser) {
    function parse(code) {
        var tokens = tokenizeString(code);
        var reader = parser();
        for (var i = 0; i < tokens.length; i++) {
            reader(tokens[i]);
        }
        var x = reader(null);
        console.log(x);
        return x;
    }
    return parse;
});