function SampleNode(parent, childNumber) {
	return new ChoiceNode('sample', parent, ['bass_hit_c', 'loop_industrial', 'guit_harmonics'], childNumber);
}
inherits(SampleNode, Node);

