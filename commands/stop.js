const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Kończy grać aktualnie grany utwór, usuwa kolejkę i wychodzi z kanału'),
	get playerCheck() {
		return { voice: true, dispatcher: true, channel: true };
	},
	async execute(interaction, client, dispatcher) {
		await interaction.deferReply();
		dispatcher.queue.length = 0;
		dispatcher.repeat = 'off';
		dispatcher.stopped = true;
		dispatcher.player.stopTrack();
		await dispatcher.message.delete();
		setTimeout(async function() {
			await interaction.editReply('Wyłączyłam muzykę!');
		}, 500);
		setTimeout(async function() {
			await interaction.deleteReply();
		}, 10000);
	},
};