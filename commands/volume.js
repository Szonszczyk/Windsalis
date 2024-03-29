const { SlashCommandBuilder } = require('@discordjs/builders');

function inRange(x, min, max) {
	return (x - min) * (x - max) <= 0;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('volume')
		.setDescription('Zmiana głośności muzyki')
		.addIntegerOption(option =>
			option.setName('value')
				.setDescription('Głośność z przedziału [1-200] w procentach. Default: 60%')
				.setMinValue(1)
            	.setMaxValue(200)
				.setRequired(true),
		),
	get playerCheck() {
		return { voice: true, dispatcher: true, channel: true };
	},
	async execute(interaction, client, dispatcher) {
		let volume = interaction.options.getInteger('value');
		if (!inRange(volume, 1, 200)) volume = 60;
		dispatcher.player.setGlobalVolume(volume);
		dispatcher.editPlayingMessage();
		await interaction.reply(`Głośność ustawiona na \`${volume}%\``);
		setTimeout(async function() {
			await interaction.deleteReply();
		}, 10000);
	},
};

