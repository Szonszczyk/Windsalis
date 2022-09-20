const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: {
		name: "buttonShuffle"
	},
	get playerCheck() {
        return { voice: true, dispatcher: true, channel: true };
    },
	async execute(interaction, client, dispatcher) {
		if(dispatcher.paused) {
			dispatcher.queue = [dispatcher.current].concat(dispatcher.queue).sort(() => Math.random() - 0.5);
			dispatcher.current = null;
			dispatcher.paused = false;
			dispatcher.player.stopTrack();
		} else {
			dispatcher.queue = dispatcher.queue.sort(() => Math.random() - 0.5);
			dispatcher.editPlayingMessage();
		}
	},
};