function RootNode() {
	this.name = "root";
	this.parent = null;
	this.children = [];
}
inherits(RootNode, Node);

RootNode.prototype.generateCode = function() {
	var depth = -1;
	var sonicPi = "";
	depth++;
	for (var i = 0; i < this.children.length; i++) {
		for (var n = 0; n < depth; n++){
			sonicPi += "    ";
		}
		sonicPi += (this.children[i].generateCode() + "\n");
	}
	depth--;
	return sonicPi;
};
