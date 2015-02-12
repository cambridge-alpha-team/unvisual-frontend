function SynthNode(parent, childNumber) {
	var synthNode = new ApplyNode('synth', parent, childNumber);
	new ChoiceNode('synth name', synthNode, ['dsaw', 'fm', 'prophet']);
	
	return synthNode;
}