function FXNode(parent) {
	this.name = "fx";
	this.parent = parent || null;
	this.children = [];
	parent.children.splice(0, 0, this);
	while (parent.children.length > 1) {
		this.children.push(parent.children.pop());
		this.children[this.children.length-1].parent = this;
	}
	this.children.reverse();
	new ChoiceNode('fx name', this, ['echo', 'distortion', 'wobble']);
}
inherits(FXNode, Node);

FXNode.prototype.readName = function() {
	if(this.children[0] instanceof ValueNode || this.children[0] instanceof ChoiceNode) {
		return this.name + " " + this.children[0].choice;
	} else {
		return this.name;
	}
};

FXNode.prototype.generateCode = function() {
	var sonicPi = "with_fx :" + this.children[0].generateCode() + " do\n";
	for (var i = 1; i < this.children.length; i++) {
		sonicPi += indent(this.children[i].generateCode() + "\n");
	}
	sonicPi += "end";
	return sonicPi;
};

FXNode.prototype.generateHTML = function() {
	var sonicPi = '';
	if(this == activeNode) {
		sonicPi += '<pre style="font-size: 1em; margin: 0px; border: black 2px solid">';
	}
	sonicPi += "with_fx :" + this.children[0].generateHTML() + " do\n";
	for (var i = 1; i < this.children.length; i++) {
		sonicPi += indent(this.children[i].generateHTML() + "\n");
	}
	sonicPi += "end";
	if(this == activeNode) {
		sonicPi += '</pre>';
	}
	return sonicPi;
};
