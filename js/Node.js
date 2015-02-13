function Node(name, parent, childNumber, children) {
 	this.name = name;
	this.parent = parent || null;
	this.children = children || [];
	if(childNumber != null) {
		parent.children.splice(childNumber, 0, this);
	} else if(parent != null) {
		parent.children.push(this);
	}
}

Node.prototype.readName = function() {
	if(this.children[0] instanceof ValueNode || this.children[0] instanceof ChoiceNode) {
		return this.name + " " + this.children[0].choice;
	} else {
		return this.name;
	}
};

Node.prototype.readFull = function() {
    var number = this.parent.children.indexOf(this) + 1;
    return this.readName() + ";   item " + number + " of " + this.parent.children.length;
};

