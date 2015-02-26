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
	this.min = min;
	this.max = max;
	
	this.choices = [];
	this.stepSize = stepSize || 1;
	for(var i = min; i < max; i = i + this.stepSize) {
		this.choices.push(i);
	}
	this.choices.push(max);
}
inherits(ValueNode, Node);

ValueNode.prototype.readName = function() {
	return this.name + " " + this.choice;
	
};

ValueNode.prototype.getValueCode = function() {
	var sonicPi = '';
	if (this.cubelet == 0) {
		sonicPi += this.choice;
	} else {
		sonicPi += 'getCubeletValue('
						+ this.cubelet + ', '
						+ this.min + ', '
						+ this.max + ', '
						+ this.stepSize + ', '
						+ this.choice + ')';
	}
	return sonicPi;
};

ValueNode.prototype.generateCode = function() {
	var sonicPi = "";
	if(this.name == "sleep") {
		sonicPi += "sleep " + this.getValueCode();
	} else if (this.name == "tempo") {
		sonicPi += (
            "define :tempo do\n" +
            indent("return " + this.getValueCode() + "\n") +
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
	} else if (this.name == "octave"){
		sonicPi += this.getValueCode();
	} else {
		sonicPi += this.name + ": " + this.getValueCode();
	}
	return sonicPi;
};

ValueNode.prototype.getValueHTML = function() {
	var sonicPi = '';
	if (this.cubelet == 0) {
		sonicPi += this.choice;
	} else {
		sonicPi += 'getCubeletValue('
						+ this.cubelet + ', '
						+ this.min + ', '
						+ this.max + ', '
						+ this.stepSize + ', '
						+ this.choice + ')';
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
		sonicPi += "sleep " + this.getValueHTML();
	} else if (this.name == "tempo") {
		sonicPi += (
            "define :tempo do\n" +
            indent("return " + this.getValueHTML() + "\n") +
            "end"
        );
	} else if (this.name == "octave"){
		sonicPi += this.getValueHTML();
	} 
	else {
		sonicPi += this.name + ": " + this.getValueHTML();
	}
	if(this == activeNode) {
		sonicPi += '</pre>';
	}
	return sonicPi;
};
