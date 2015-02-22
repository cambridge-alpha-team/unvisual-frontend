function FXNode(parent) {
	this.name = "fx";
	this.parent = parent || null;
	this.children = [];
	if (parent instanceof FXNode) {
		parent.children.splice(1, 0, this);
		while (parent.children.length > 2) {
			this.children.push(parent.children.pop());
			this.children[this.children.length - 1].parent = this;
		}
	} else {
		parent.children.splice(0, 0, this);
		while (parent.children.length > 1) {
			this.children.push(parent.children.pop());
			this.children[this.children.length - 1].parent = this;
		}
	}
	this.children.reverse();
	new ChoiceNode('fx name', this, ['echo', 'distortion', 'wobble']);
}
inherits(FXNode, Node);

FXNode.prototype.readName = function() {
	if (this.children[0] instanceof ValueNode || this.children[0] instanceof ChoiceNode) {
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
	if (this == activeNode) {
		sonicPi += '<pre style="margin: 0px; font-size: 1em; border: black 2px solid"><span>';
	}
	if (this == activeNode) {
		//sonicPi += '<pre style="font-size: 1em; margin: 0px; border: black 2px solid">';
	}
	sonicPi += "with_fx :" + this.children[0].generateHTML() + " do";
	if (!(isBoxed(this.children[1]))) {
		sonicPi += "\n";
	}
	for (var i = 1; i < this.children.length; i++) {
		sonicPi += indent(this.children[i].generateHTML());
		if (!isBoxed(this.children[i + 1]) && !isBoxed(this.children[i])) {
			sonicPi += "\n";
		}
	}
	sonicPi += "end";
	if (this == activeNode) {
		sonicPi += '</pre>';
	}
	return sonicPi;
};

