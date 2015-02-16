function SynthNode(parent, childNumber) {
	this.name = 'synth';
	this.parent = parent || null;
	this.children = [];
	if(childNumber != null) {
		parent.children.splice(childNumber, 0, this);
	} else if(parent != null) {
		parent.children.push(this);
	}
	new ChoiceNode('synth name', this, ['dsaw', 'fm', 'prophet']);
}

SynthNode.prototype.readName = function() {
	if(this.children[0] instanceof ValueNode || this.children[0] instanceof ChoiceNode) {
		return this.name + " " + this.children[0].choice;
	} else {
		return this.name;
	}
};

SynthNode.prototype.generateCode = function() {
	var synthStg = "use_synth :";
	for (var i = 0; i < this.children.length; i++ ){
		synthStg += this.children[i].generateCode();
	}
	synthStg += "\n";
	return synthStg;
};


