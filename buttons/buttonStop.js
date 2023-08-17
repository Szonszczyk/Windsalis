module.exports = {
	data: {
		name: 'buttonStop',
	},
	get playerCheck() {
		return { voice: true, dispatcher: true, channel: true };
	},
	async execute(interaction, client, dispatcher) {
		if(dispatcher.current) {
			dispatcher.queue.length = 0;
			dispatcher.repeat = 'off';
			dispatcher.stopped = true;
			dispatcher.player.stopTrack();
		}
		else {
			dispatcher.destroy("Stop while nothing is playing!");
		}
		await dispatcher.message.delete();
	},
};