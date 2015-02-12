function SleepNode(parent, childNumber) {
	this.name = 'sleep';
	this.parent = parent || null;
	this.children = [];
	if(childNumber != null) {
		parent.children.splice(childNumber, 0, this);
	} else if(parent != null) {
		parent.children.push(this);
	}
	
	new ValueNode('beats', this, 0, 1, 0, 4);
}

SleepNode.prototype.readName = function() {
	if(this.children[0] instanceof ValueNode || this.children[0] instanceof ChoiceNode) {
		return this.name + " " + this.children[0].choice;
	} else {
		return this.name;
	}
};

SleepNode.prototype.generateCode = function() {
	
};
