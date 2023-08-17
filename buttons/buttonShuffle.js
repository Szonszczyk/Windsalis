module.exports = {
	data: {
		name: 'buttonShuffle',
	},
	get playerCheck() {
		return { voice: true, dispatcher: true, channel: true };
	},
	async execute(interaction, client, dispatcher) {
		if(dispatcher.automode) {
			if (dispatcher.paused) {
				dispatcher.current = null;
				dispatcher.queue = [];
				dispatcher.paused = false;
				await dispatcher.addTrackAutoMode(3);
				dispatcher.player.stopTrack();
			} else {
				dispatcher.queue = [];
				await dispatcher.addTrackAutoMode(2);
				dispatcher.editPlayingMessage();
			}
		} else {
			if (dispatcher.paused) {
				dispatcher.queue = [dispatcher.current].concat(dispatcher.queue).sort(() => Math.random() - 0.5);
				dispatcher.current = null;
				dispatcher.paused = false;
				dispatcher.player.stopTrack();
			} else {
				dispatcher.queue = dispatcher.queue.sort(() => Math.random() - 0.5);
				dispatcher.editPlayingMessage();
			}
		}
	},
};