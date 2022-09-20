const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pauzuje lub odpauzowuje aktualnie graną muzykę'),
	get playerCheck() {
		return { voice: true, dispatcher: true, channel: true };
	},
	async execute(interaction, client, dispatcher) {
		const paused = dispatcher.resolvePause();
		if(paused)
			await interaction.reply('Muzyka spauzowana.');
		else
			await interaction.reply('Muzyka wznowiona!');
		setTimeout(async function() {
			await interaction.deleteReply();
		}, 10000);
	},	
};