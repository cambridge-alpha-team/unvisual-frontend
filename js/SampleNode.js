function SampleNode(parent, childNumber) {
	var sampleNode = new ActionNode('sample', parent, childNumber);
	new ValueNode('amp', sampleNode, 1, 1, 0, 1);
	new ChoiceNode('sample name', sampleNode, ['bass_hit_c', 'loop_industrial', 'guit_harmonics']);
	
	return sampleNode;
}