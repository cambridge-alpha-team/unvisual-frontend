
function indent(text) {
  var t =text.split("\n").map(function(line) {
    return line ? ("  " + line) : "";
  }).join("\n");
  
  var tsplit = t.split("<span>");
  
  for(var i = 1; i < tsplit.length; i++) {
	  tsplit[i] = "  " + tsplit[i];
  }
  
  return tsplit.join("<span>");
}

function inherits(cls, sup) {
  cls.prototype = Object.create(sup.prototype);
  cls.parent = sup;
  cls.base = function(self, method /*, args... */) {
    return sup.prototype[method].call(self, [].slice.call(arguments, 2));
  };
};

function isBoxed(node) {
	 return (node == activeNode && ((node instanceof LoopNode || node instanceof FXNode) || node.name == "tempo"));
};
