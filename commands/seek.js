const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('seek')
		.setDescription('Przewinięcie aktualnie granego utworu do przodu lub do tyłu')
		.addIntegerOption(option =>
			option.setName('value')
				.setDescription('Czas w sekundach o ile mam przewinąć utwór')
				.setRequired(true),
		),
	get playerCheck() {
		return { voice: true, dispatcher: true, channel: true };
	},
	async execute(interaction, client, dispatcher) {
		const value = interaction.options.getInteger('value');
		await dispatcher.player.seekTo(dispatcher.player.position + Math.round(value * 1000));
		dispatcher.editPlayingMessage();
		await interaction.reply(`Przewinięto utwór do \`${client.menus.ReturnTrackTime(dispatcher.player.position)}\``);
		setTimeout(async function() {
			await interaction.deleteReply();
		}, 10000);
	},
};

