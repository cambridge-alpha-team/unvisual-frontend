function TempoNode() {
	this.name = 'tempo';
	this.parent = root;
	this.children = [];
	this.parent.children.push(this);
	new ValueNode('bpm', this, 0, 60, 30, 300);
}

TempoNode.prototype.readName = function() {
	if(this.children[0] instanceof ValueNode || this.children[0] instanceof ChoiceNode) {
		return this.name + " " + this.children[0].choice;
	} else {
		return this.name;
	}
};

TempoNode.prototype.generateCode = function() {
	
};