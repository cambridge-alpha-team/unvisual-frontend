function SleepNode(parent, childNumber) {
	var sleepNode = new ActionNode('sleep', parent, childNumber);
	new ValueNode('beats', sleepNode, 0, 1, 0, 4);
	
	return sleepNode;
}