module.exports = {
	data: {
		name: 'buttonPause',
	},
	get playerCheck() {
		return { voice: true, dispatcher: true, channel: true };
	},
	async execute(interaction, client, dispatcher) {
		dispatcher.resolvePause();
	},
};