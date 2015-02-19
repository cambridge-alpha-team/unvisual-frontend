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

inherits(SynthNode, Node);

SynthNode.prototype.readName = function() {
	if(this.children[0] instanceof ValueNode || this.children[0] instanceof ChoiceNode) {
		return this.name + " " + this.children[0].choice;
	} else {
		return this.name;
	}
};

SynthNode.prototype.generateCode = function() {
	var sonicPi = "use_synth :";
	for (var i = 0; i < this.children.length; i++ ){
		sonicPi += this.children[i].generateCode();
	}
	return sonicPi;
};

SynthNode.prototype.generateHTML = function() {
	var sonicPi = '';
	if(this == activeNode) {
		sonicPi += '<pre style="display: inline; font-size: 1em; border: black 2px solid">';
	}
	
	sonicPi += "use_synth :";
	for (var i = 0; i < this.children.length; i++ ){
		sonicPi += this.children[i].generateHTML();
	}
	
	if(this == activeNode) {
		sonicPi += '</pre>';
	}
	return sonicPi;
};
