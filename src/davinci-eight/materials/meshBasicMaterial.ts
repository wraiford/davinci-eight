import material = require('davinci-eight/materials/material');

var meshBasicMaterial = function(spec) {
  var publicAPI = material(spec);
  return publicAPI;
};

export = meshBasicMaterial;