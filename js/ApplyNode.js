function ApplyNode(name, parent, childNumber, children) {
	this.name = name;
	this.parent = parent || null;
	this.children = children || [];
	if(childNumber != null) {
		parent.children.splice(childNumber, 0, this);
	} else if(parent != null) {
		parent.children.push(this);
	}
}

ApplyNode.prototype.readName = function() {
	if(this.children[0] instanceof ValueNode || this.children[0] instanceof ChoiceNode) {
		return this.name + " " + this.children[0].choice;
	} else {
		return this.name;
	}
};

ApplyNode.prototype.remove = function() {
	
};
