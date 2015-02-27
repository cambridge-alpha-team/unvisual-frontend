function SampleNode(parent, childNumber) {
	return new ChoiceNode('sample', parent, ['ambi_drone', 'ambi_lunar_land', 'bass_hit_c', 'bass_thick_c', 'bass_voxy_c', 'bd_boom',  'bd_pure', 'bd_sone', 'drum_cymbal_open', 'drum_cymbal_pedal', 'drum_cymbal_soft', 'elec_chime', 'guit_e_fifths', 'guit_e_slide', 'guit_harmonics', 'loop_amen', 'loop_amen_full', 'loop_amen_breakbeat', 'loop_compus', 'loop_garzul', 'loop_industrial', 'loop_mika', 'misc_burp', 'perc_bell'], childNumber);
}
inherits(SampleNode, Node);