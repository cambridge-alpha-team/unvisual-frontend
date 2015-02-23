function SampleNode(parent, childNumber) {
	this.name = 'sample';
	this.parent = parent || null;
	this.children = [];
	if (childNumber != null) {
		parent.children.splice(childNumber, 0, this);
	} else if (parent != null) {
		parent.children.push(this);
	}

	new ChoiceNode('sample name', this, ['bass_hit_c', 'loop_industrial', 'guit_harmonics']);
}
inherits(SampleNode, Node);

SampleNode.prototype.readName = function() {
	if (this.children[0] instanceof ValueNode || this.children[0] instanceof ChoiceNode) {
		return this.name + " " + this.children[0].choice;
	} else {
		return this.name;
	}
};

SampleNode.prototype.generateCode = function() {
	var sonicPi = "sample :" + this.children[0].generateCode() + " ";
	for (var i = 1; i < this.children.length; i++) {
		if (i != 1) sonicPi += ", ";

		sonicPi += this.children[i].generateCode();
	}
	return sonicPi;
};

SampleNode.prototype.generateHTML = function() {
	var sonicPi = '';
	if (this == activeNode) {
		sonicPi += '<pre style="display: inline; font-size: 1em; border: black 2px solid">';
	}

	sonicPi += "sample :" + this.children[0].generateHTML();
	for (var i = 1; i < this.children.length; i++) {
		if (i == 1) {
			sonicPi += " ";
		} else {
			sonicPi += ", ";
		}
		sonicPi += this.children[i].generateHTML();
	}

	if (this == activeNode) {
		sonicPi += '</pre>';
	}
	return sonicPi;
};

