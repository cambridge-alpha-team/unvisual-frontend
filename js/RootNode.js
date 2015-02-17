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
	if(this == activeNode) {
		sonicPi += '<pre style="border: black 2px solid; font-size: 1em; display: inline">';
	}
	for (var i = 0; i < this.children.length; i++) {
		sonicPi += (this.children[i].generateHTML() + "\n\n");
	}
	if(this == activeNode) {
		sonicPi += '</pre>';
	}
	return sonicPi;
};
