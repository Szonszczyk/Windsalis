const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Pomija aktualnie grany utwór')
		.addIntegerOption(option =>
			option.setName('value')
				.setDescription('Ilość utworów do pominięcia')
				.setRequired(false),
		),
	get playerCheck() {
		return { voice: true, dispatcher: true, channel: true };
	},
	async execute(interaction, client, dispatcher) {
		if(!dispatcher.current) {
			dispatcher.destroy("Skip while nothing is playing!");
		}
		else {
			const skips = interaction.options.getInteger('value');
			if (skips) {
				for (let i = 1; i < skips; i++) dispatcher.queue.shift();
				await interaction.reply(`Pominięto aktualnie grany utwór i \`\`${skips - 1}\`\` z kolejki!`);
			}
			else {
				await interaction.reply('Pominięto utwór!');
				dispatcher.automode ? client.databases.removeTrackfromTracklist(dispatcher.current) : '';
			}
			dispatcher.paused = false;
			dispatcher.player.stopTrack();
			if (dispatcher.queue.length >= 1 && dispatcher.automode) await dispatcher.addTrackAutoMode(2);
		}
		setTimeout(async function() {
			await interaction.deleteReply();
		}, 10000);
	},
};