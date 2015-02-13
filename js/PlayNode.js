function PlayNode(parent, childNumber) {
	this.name = 'play';
	this.parent = parent || null;
	this.children = [];
	if(childNumber != null) {
		parent.children.splice(childNumber, 0, this);
	} else if(parent != null) {
		parent.children.push(this);
	}
	new ValueNode('note', this, 0, 60, 40, 100);
	new ValueNode('amp', this, 1, 1, 0, 1);
	new ValueNode('release', this, 2, 1, 0, 5);
	
}
inherits(PlayNode, Node);

PlayNode.prototype.readName = function() {
	if(this.children[0] instanceof ValueNode || this.children[0] instanceof ChoiceNode) {
		return this.name + " " + this.children[0].choice;
	} else {
		return this.name;
	}
};

PlayNode.prototype.generateCode = function() {
	var sonicPi = "play ";
	for (var i = 0; i < this.children.length; i++) {
		if(i != 0) sonicPi += ", ";
		
		sonicPi += this.children[i].generateCode();
	}
	return sonicPi;
};

