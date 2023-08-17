const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('shuffle')
		.setDescription('Miesza kolejkę utworów. (Spauzowane -> wraz z aktualnym utworem, Grające -> tylko kolejkę)'),
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
				await interaction.reply('Losuję nowe utwory!');
			} else {
				dispatcher.queue = [];
				await dispatcher.addTrackAutoMode(2);
				dispatcher.editPlayingMessage();
				await interaction.reply('Wymieniłam 2 utwory z kolejki!');
			}
		} else {
			if (dispatcher.paused) {
				dispatcher.queue = [dispatcher.current].concat(dispatcher.queue).sort(() => Math.random() - 0.5);
				dispatcher.current = null;
				dispatcher.paused = false;
				dispatcher.player.stopTrack();
				await interaction.reply('Cała kolejka wymieszana, odpauzowuję!');
			} else {
				dispatcher.queue = dispatcher.queue.sort(() => Math.random() - 0.5);
				dispatcher.editPlayingMessage();
				await interaction.reply('Kolejka wymieszana!');
			}
		}
		setTimeout(async function() {
			await interaction.deleteReply();
		}, 10000);
	},
};