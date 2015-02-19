function ValueNode(name, parent, childNumber, defaultValue, min, max, stepSize) {
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
	var increments = stepSize || 1;
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
            "end"
        );
	} else {
		sonicPi += this.name + ": " + this.choice;
	}
	return sonicPi;
};

ValueNode.prototype.generateHTML = function() {
	var sonicPi = '';
	if(this == activeNode) {
		if (this.name != "tempo") {
			sonicPi += '<pre style="display: inline; font-size: 1em; border: black 2px solid">';
		} else {
			sonicPi += '<pre style="margin: 0px; font-size: 1em; border: black 2px solid"><span>';
		}
	}
	
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
            "end"
        );
	} else {
		sonicPi += this.name + ": " + this.choice;
	}
	if(this == activeNode) {
		sonicPi += '</pre>';
	}
	return sonicPi;
};
