function SynthNode(parent, childNumber) {
	return new ChoiceNode('synth', parent, ['dsaw', 'fm', 'prophet'], childNumber);
}

inherits(SynthNode, Node);

