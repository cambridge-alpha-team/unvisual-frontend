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
	if (this.name == "tempo"){
		return this.choice;
	} else if(this.name == "sample") {
		var beats;
		if (this.name == "loop_amen" || this.name == "loop_breakbeat") {
			beats = 4;
		} else if (this.name == "loop_amen_full" || this.name == "loop_compus" || this.name == "loop_garzul" || this.name == "loop_mika"){
			beats = 16;
		} else if (this.name == "loop_industrial") {
			beats = 2;
		} else {
			beats = 1; 
		}
		var want_duration = beats * 60;
		return "sample :" + this.choice + ", rate: (sample_duration :" + this.choice + ") / (" + want_duration + "/current_bpm)" ;
	} else if(this.name == "change sound") {
		return "use_synth :" + this.choice;
	} else {
		return this.choice;
	}
};

ChoiceNode.prototype.generateHTML = function() {
	var sonicPi = '';
	if (this == activeNode) {
		sonicPi += '<pre style="font-size: 1em; border: black 2px solid; display: inline">';
	}
	if (this.name == "sample") {
		sonicPi += "sample :" + this.choice;
	} else if (this.name == "change sound") {
		sonicPi += "use_synth :" + this.choice;
	} else {
		sonicPi += this.choice;
	}
	if (this == activeNode) {
		sonicPi += '</pre>';
	}
	return sonicPi;
};

