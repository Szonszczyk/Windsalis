module.exports = {
	data: {
		name: 'buttonSkip',
	},
	get playerCheck() {
		return { voice: true, dispatcher: true, channel: true };
	},
	async execute(interaction, client, dispatcher) {
		if(!dispatcher.current) {
			dispatcher.destroy("Skip while nothing is playing!");
		}
		else {
			dispatcher.player.stopTrack();
			dispatcher.paused = false;
		}
	},
};