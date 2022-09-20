const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('automode')
		.setDescription('Odpala tryb automatyczny. Każdy utwór jest brany z bazy danych utworów które były grane przez bota'),

	get playerCheck() {
		return { voice: true, dispatcher: false, channel: false };
	},

	async execute(interaction, client) {
		await interaction.deferReply();
		const node = client.shoukaku.getNode();
		const dispatcher = await client.queue.handle(interaction.guild, interaction.member, interaction.channel, node, []);
		if (dispatcher === 'Busy')
			return interaction.editReply('Łączę się z kanałem głosowym, minutka!');
		await dispatcher.addTrackAutoMode();
		await dispatcher.addTrackAutoMode();
		dispatcher.automode = true;

		dispatcher?.play();
		dispatcher?.editPlayingMessage();
		interaction.editReply(`Tryb automatyczny został \`\`włączony\`\`!`);
		setTimeout(async function() {
			await interaction.deleteReply();
		}, 30000);
	},
};