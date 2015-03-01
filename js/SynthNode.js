function SynthNode(parent, childNumber) {
	return new ChoiceNode('change sound', parent, ['dsaw', 'fm', 'prophet', 'pulse', 'tb303'], childNumber);
}

inherits(SynthNode, Node);

