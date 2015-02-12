function ChoiceNode(name, parent, choices) {
	this.name = name;
	this.parent = parent || null;
	this.children = [];
	if(parent != null) {
		parent.children.splice(0, 0, this);
	}
	
	this.choices = choices;
	this.choice = choices[0];
}

ChoiceNode.prototype.readName = function() {
	return this.name + " " + this.choice;
};

ChoiceNode.prototype.generateCode = function() {
	
};