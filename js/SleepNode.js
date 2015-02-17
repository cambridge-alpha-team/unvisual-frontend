function SleepNode(parent, childNumber) {
	var sleepNode = new ValueNode('sleep', parent, childNumber, 1, 0, 4, 0.125);
	
	return sleepNode;
}
inherits(SleepNode, Node);

