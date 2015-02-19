function RootNode() {
	this.name = "root";
	this.parent = null;
	this.children = [];
}
inherits(RootNode, Node);

RootNode.prototype.generateCode = function() {
	var sonicPi = "";
	for (var i = 0; i < this.children.length; i++) {
		sonicPi += (this.children[i].generateCode() + "\n\n");
	}
	return sonicPi;
};

RootNode.prototype.generateHTML = function() {
	var sonicPi = '';
	for (var i = 0; i < this.children.length; i++) {
		sonicPi += (this.children[i].generateHTML() + "\n");
		if(!isBoxed(this.children[i])) {
			sonicPi += "\n";
		}
	}
	return sonicPi;
};
