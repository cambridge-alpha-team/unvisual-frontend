function ChoiceNode(name, parent, choices, childNumber) {
	this.name = name;
	this.parent = parent || null;
	this.children = [];
	if(childNumber != null) {
		parent.children.splice(childNumber, 0, this);
	} else if(parent != null) {
		parent.children.splice(0, 0, this);
	}
	
	this.choices = choices;
	this.choice = choices[0];
}
inherits(ChoiceNode, Node);

ChoiceNode.prototype.readName = function() {
	return this.name + " " + this.choice;	
};

ChoiceNode.prototype.generateCode = function() {
	if(this.name == "sample") {
		return "sample :" + this.choice;
	} else if(this.name == "synth") {
		return "use_synth :" + this.choice;
	} else {
		return this.choice;
	}
};

ChoiceNode.prototype.generateHTML = function() {
	var sonicPi = '';
	if(this == activeNode) {
		sonicPi += '<pre style="font-size: 1em; border: black 2px solid; display: inline">';
	}
	if(this.name == "sample") {
		sonicPi += "sample :" + this.choice;
	} else if(this.name == "synth") {
		sonicPi += "use_synth :" + this.choice;
	} else {
		sonicPi += this.choice;
	}
	if(this == activeNode) {
		sonicPi += '</pre>';
	}
	return sonicPi;
};
