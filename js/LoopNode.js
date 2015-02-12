function LoopNode(name, parent, childNumber) {
	var loopNode = new Node(name, parent, childNumber);
	//these nodes are created to allow you to go into the loop
	new PlayNode(loopNode,0);
	new SleepNode(loopNode,1);
	
	return loopNode;
}

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