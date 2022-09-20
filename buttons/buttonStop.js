const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: {
		name: "buttonStop"
	},
	get playerCheck() {
		return { voice: true, dispatcher: true, channel: true };
	},
	async execute(interaction, client, dispatcher) {
		dispatcher.queue.length = 0;
		dispatcher.repeat = 'off';
		dispatcher.stopped = true;
		dispatcher.player.stopTrack();
		await dispatcher.message.delete();
	},
};