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

FXNode.prototype.readName = function() {
	if(this.children[0] instanceof ValueNode || this.children[0] instanceof ChoiceNode) {
		return this.name + " " + this.children[0].choice;
	} else {
		return this.name;
	}
};

FXNode.prototype.remove = function() {
};
FXNode.prototype.addPlay = function() {
};
FXNode.prototype.addSleep = function() {
};
FXNode.prototype.addSample = function() {
};
FXNode.prototype.addSynth = function() {
};