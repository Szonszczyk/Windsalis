module.exports = {
	data: {
		name: 'buttonSkip',
	},
	get playerCheck() {
		return { voice: true, dispatcher: true, channel: true };
	},
	async execute(interaction, client, dispatcher) {
		dispatcher.player.stopTrack();
		dispatcher.paused = false;
	},
};