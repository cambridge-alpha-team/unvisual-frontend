function ActionNode(name, parent, childNumber) {
	this.name = name;
	this.parent = parent || null;
	this.children = [];
	if (childNumber != null) {
		parent.children.splice(childNumber, 0, this);
	} else if (parent != null) {
		parent.children.push(this);
	}
}
inherits(ActionNode, Node);

ActionNode.prototype.readName = function() {
	if (this.children[0] instanceof ValueNode || this.children[0] instanceof ChoiceNode) {
		return this.name + " " + this.children[0].choice;
	} else {
		return this.name;
	}
};

ActionNode.prototype.generateCode = function() {

};

