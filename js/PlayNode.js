function PlayNode(parent, childNumber) {
	var playNode = new ActionNode('play', parent, childNumber);
	new ValueNode('note', playNode, 0, 60, 40, 100);
	new ValueNode('amp', playNode, 1, 1, 0, 1);
	new ValueNode('release', playNode, 2, 1, 0, 5);
	
	return playNode;
}