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
	var increments = 0;
	if (this.name == "sleep") {
		increments = 0.125;
	} else if (this.name == "tempo") {
		increments = 5;
	} else if (this.name == "note") {
		increments = 1;
	} else if (this.name == "amp" || this.name == "release") {
		increments = 0.5; //TODO: increment 0.1 but fix rounding issues
	}
	for(var i = min; i < max; i = i + increments) {
		this.choices.push(i);
	}
	this.choices.push(max);
}
inherits(ValueNode, Node);

ValueNode.prototype.readName = function() {
	return this.name + " " + this.choice;
};

ValueNode.prototype.generateCode = function() {

	var depth = -1;
	var sonicPi = "";
	if(this.name == "sleep") {
		sonicPi += "sleep " + this.choice;
	} else if (this.name == "tempo") {
		sonicPi += (
            "define :tempo do\n" +
            indent("return " + this.choice + "\n") +
            "end\n" +
            "\n" +
            "live_loop :beat do\n" +
            indent("with_bpm tempo do\n" +
                indent(
                    "sleep 1\n"
                ) +
            "end\n") +
            "end\n"
        );
	} else {
		sonicPi += this.name + ": " + this.choice;
	}
	return sonicPi;
};
