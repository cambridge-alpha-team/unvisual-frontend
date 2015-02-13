
function indent(text) {
  return text.split("\n").map(function(line) {
    return line ? ("  " + line) : "";
  }).join("\n");
}

function inherits(cls, sup) {
  cls.prototype = Object.create(sup.prototype);
  cls.parent = sup;
  cls.base = function(self, method /*, args... */) {
    return sup.prototype[method].call(self, [].slice.call(arguments, 2));
  };
};

