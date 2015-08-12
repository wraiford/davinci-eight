define(['davinci-eight/math/Matrix4'], function(Matrix4)
{
  describe("Matrix4", function() {
    describe("elements", function() {
      it("should be a Float32Array to support WebGL", function() {
        var m = new Matrix4(new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]));
        expect(m.elements instanceof Float32Array).toBe(true);
      });
    });
  });
});