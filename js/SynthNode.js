function SynthNode(parent, childNumber) {
	return new ChoiceNode('synth', parent, ['dsaw', 'fm', 'prophet', 'pulse', 'tb303'], childNumber);
}

inherits(SynthNode, Node);

