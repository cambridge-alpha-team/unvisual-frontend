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
		if (this.choice.substr(0,5) == "loop_") {
			return "sample :" + this.choice + ", rate: (current_bpm / 60.0) \nsleep (sample_duration :" + this.choice + ")" ;
		} else {
			return "sample :" + this.choice;
		}
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
		if (this.choice.substr(0,5) == "loop_") {
			if (this == activeNode){
				sonicPi += "sample :" + this.choice + '</pre> \n<pre style="font-size: 1em; border: black 2px solid; display: inline">sleep (sample_duration :' + this.choice + ") </pre>" ;
			} else {
				sonicPi += "sample :" + this.choice + "\nsleep (sample_duration :" + this.choice + ")" ;
			}
		} else {
			sonicPi += "sample :" + this.choice;
		}
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

