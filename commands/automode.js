const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('automode')
		.setDescription('Odpala tryb automatyczny. Każdy utwór jest brany z bazy danych utworów które były grane przez bota'),

	get playerCheck() {
		return { voice: true, dispatcher: false, channel: false };
	},

	async execute(interaction, client, dispatcher) {
		await interaction.deferReply();
		if (dispatcher) {
			if (dispatcher.automode) {
				interaction.editReply('Nie tykaj ;_; Tryb automatyczny już tu działa!');
			} else {
				dispatcher.queue.length = 0;
				dispatcher.paused = false;
				await dispatcher.addTrackAutoMode(2);
				dispatcher.automode = true;
				dispatcher.player.stopTrack();
				interaction.editReply('Tryb zwykły został zastąpiony automatycznym!');
			}
		} else {
			const node = client.shoukaku.getIdealNode();
			const dispatcher = await client.queue.handle(interaction.guild, interaction.member, interaction.channel, node, []);
			if (dispatcher === 'Busy') return interaction.editReply('Łączę się z kanałem głosowym, minutka!');
			await dispatcher.addTrackAutoMode(2);
			dispatcher.automode = true;
			dispatcher?.play();
			interaction.editReply('Tryb automatyczny został ``włączony``!');
		}
		setTimeout(async function() {
			await interaction.deleteReply();
		}, 30000);
	},
};