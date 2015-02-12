function RootNode() {
	this.name = "root";
	this.parent = null;
	this.children = [];
}

RootNode.prototype.generateCode = function() {
	
	var sonicPi = "";
	for (var i = 0; i < this.children.length; i++) {
		sonicPi += (this.children[i].generateCode() + "\n");
	}
	return sonicPi;
};
