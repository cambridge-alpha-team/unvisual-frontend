function ValueNode(name, parent, childNumber, defaultValue, min, max) {
	this.name = name;
	this.parent = parent || null;
	this.children = [];
	if(childNumber != null) {
		parent.children.splice(childNumber, 0, this);
	} else if(parent != null) {
		parent.children.push(this);
	}
	this.choice = defaultValue;
	this.cubelet = 0;
	this.Min = min;
	this.Max = max;
	
	this.choices = [];
	var increments = 1; //TODO make these sensible
	for(var i = min; i < max; i = i + increments) {
		this.choices.push(i);
	}
	this.choices.push(max);
}

ValueNode.prototype.readName = function() {
	return this.name + " " + this.choice;
};

//TODO this needs special cases for name = sleep and tempo
ValueNode.prototype.generateCode = function() {
	var sonicPi = "";
	if(this.name == "sleep") {
		sonicPi += "sleep " + this.choice;
	} else if (this.name == "tempo") {
		sonicPi += "define :tempo do\n";
		sonicPi += "return " + this.choice + "\n";
		sonicPi += "end\n";
		sonicPi += "live_loop :beat do\n";
		sonicPi += "with_bpm tempo do\n";
		sonicPi += "sleep 1\n";
		sonicPi += "end\n";
		sonicPi += "end";
	} else {
		sonicPi += this.name + ": " + this.choice;
	}
	return sonicPi;
};
