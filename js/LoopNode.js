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

LoopNode.prototype.readName = function() {
	if(this.children[0] instanceof ValueNode || this.children[0] instanceof ChoiceNode) {
		return this.name + " " + this.children[0].choice;
	} else {
		return this.name;
	}
};

LoopNode.prototype.remove = function() {
	
};

LoopNode.prototype.addPlay = function() {
	
};

LoopNode.prototype.addSleep = function() {
	
};

LoopNode.prototype.addSample = function() {
	
};

LoopNode.prototype.addSynth = function() {
	
};

LoopNode.prototype.addFX = function() {
	
};