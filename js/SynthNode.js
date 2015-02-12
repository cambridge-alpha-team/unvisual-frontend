function SynthNode(parent, childNumber) {
	var synthNode = new ApplyNode('synth', parent, childNumber);
	this.name = 'synth';
	this.parent = parent || null;
	this.children = [];
	if(childNumber != null) {
		parent.children.splice(childNumber, 0, this);
	} else if(parent != null) {
		parent.children.push(this);
	}
	new ChoiceNode('synth name', synthNode, ['dsaw', 'fm', 'prophet']);
	
	return synthNode;
}

SynthNode.prototype.readName = function() {
	if(this.children[0] instanceof ValueNode || this.children[0] instanceof ChoiceNode) {
		return this.name + " " + this.children[0].choice;
	} else {
		return this.name;
	}
};