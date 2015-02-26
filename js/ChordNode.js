function ChordNode(parent, childNumber) {
	this.name = 'play chord';
	this.parent = parent || null;
	this.children = [];
	if (childNumber != null) {
		parent.children.splice(childNumber, 0, this);
	} else if (parent != null) {
		parent.children.push(this);
	}
	new ChoiceNode('tonic', this, ['A', 'B', 'C', 'D', 'E', 'F', 'G'], 0);
	new ValueNode('octave', this, 1, 1, 1, 8, 1);
	new ChoiceNode('chord type', this, ['a', 'augmented', 'dim', 'dim7', 'diminished', 'diminished7', 'dom7', 'i', 'i7', 'm', 'm6', 'm7', 'm9', 'm11', 'm13', 'maj9', 'maj11', 'major', 'major7', 'minor', 'minor7', 'sus2', 'sus4'], 2);
	

}
inherits(ChordNode, Node);

ChordNode.prototype.readName = function() {
	
	return this.name + "( :" + this.children[0].choice + this.children[1].choice + ", :" + this.children[2].choice + ")";
};

ChordNode.prototype.generateCode = function() {
	var sonicPi = "play chord (:";
	for (var i = 0; i < this.children.length; i++) {
		sonicPi += this.children[i].generateCode();
	}
	sonicPi += ")";
	return sonicPi;
};

ChordNode.prototype.generateHTML = function() {
	var sonicPi = '';
	if (this == activeNode) {
		sonicPi += '<pre style="border: black 2px solid; font-size: 1em; display: inline">';
	}
	sonicPi += "play chord (:";
	for (var i = 0; i < this.children.length; i++) {
		sonicPi += this.children[i].generateHTML();
	}
	sonicPi += ")";
	if (this == activeNode) {
		sonicPi += '</pre>';
	}
	return sonicPi;
};

