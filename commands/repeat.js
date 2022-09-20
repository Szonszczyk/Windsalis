const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('repeat')
		.setDescription('Ustawia tryb powtarzania dla aktualnie granej playlisty')
		.addStringOption(option =>
			option.setName('powtarzanie')
				.setDescription('Co powtarzać?')
				.setRequired(true)
				.addChoices(
					{ name: 'wszystko', value: 'all' },
					{ name: 'jeden', value: 'one' },
					{ name: 'wyłącz', value: 'off' },
				)),

	get playerCheck() {
		return { voice: true, dispatcher: true, channel: true };
	},
	async execute(interaction, client, dispatcher) {

		const typesPL = { 'all': 'Wszystko - skończony utwór ląduje na końcu kolejki', 'one': 'Jeden - aktualnie grany utwór jest grany w pętli', 'off': 'Wyłączone' };

		dispatcher.repeat = interaction.options.getString('powtarzanie');
		dispatcher.editPlayingMessage();
		await interaction.reply(`Powtarzanie ustawiono na \`${typesPL[dispatcher.repeat]}\``);

		setTimeout(async function() {
			await interaction.deleteReply();
		}, 60000);
	},
};