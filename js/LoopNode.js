function LoopNode(name, parent, childNumber) {
	this.name = name;
	this.parent = parent || null;
	this.children = [];
	if(childNumber != null) {
		parent.children.splice(childNumber, 0, this);
	} else if(parent != null) {
		parent.children.push(this);
	}
	//these nodes are created to allow you to go into the loop
	new PlayNode(this,0);
	new SleepNode(this,1);
}
inherits(LoopNode, Node);

LoopNode.prototype.readName = function() {
	if(this.children[0] instanceof ValueNode || this.children[0] instanceof ChoiceNode) {
		return this.name + " " + this.children[0].choice;
	} else {
		return this.name;
	}
};

LoopNode.prototype.generateCode = function() {
	
	var depth = 0;
	var sonicPi = "live_loop :" + this.name + " do\n";
	depth++;
	for (var n = 0; n < depth; n++){
		sonicPi += "    ";
	}
	sonicPi += "with_bpm tempo do\n";
	depth++;
	for (var i = 0; i < this.children.length; i++) {
		for (var n = 0; n < depth; n++){
			sonicPi += "    ";
		}
		sonicPi += (this.children[i].generateCode() + "\n");
	}
	depth--;
	for (var n = 0; n < depth; n++){
		sonicPi += "    ";
	}
	sonicPi += "end\n";
	depth--;
	for (var n = 0; n < depth; n++){
		sonicPi += "    ";
	}
	sonicPi += "end";
	depth--;
	return sonicPi;
};
