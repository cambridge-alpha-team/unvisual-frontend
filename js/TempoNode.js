function TempoNode() {
	var tempoNode = new Node('tempo', root);
	new ValueNode('bpm', tempoNode, 0, 60, 30, 300);
	
	return tempoNode;
}