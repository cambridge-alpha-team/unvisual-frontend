function SampleNode(parent, childNumber) {
	this.name = 'sample';
	this.parent = parent || null;
	this.children = [];
	if(childNumber != null) {
		parent.children.splice(childNumber, 0, this);
	} else if(parent != null) {
		parent.children.push(this);
	}
	
	new ChoiceNode('sample name', this, ['bass_hit_c', 'loop_industrial', 'guit_harmonics']);
	new ValueNode('amp', this, 1, 1, 0, 1);
}

SampleNode.prototype.readName = function() {
	if(this.children[0] instanceof ValueNode || this.children[0] instanceof ChoiceNode) {
		return this.name + " " + this.children[0].choice;
	} else {
		return this.name;
	}
};