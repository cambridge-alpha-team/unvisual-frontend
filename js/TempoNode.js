function TempoNode() {
	var tempoNode = new ValueNode('tempo', root, 0, 120, 60, 180);
	
	return tempoNode;
}
inherits(TempoNode, Node);

