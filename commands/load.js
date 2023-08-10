const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('load')
		.setDescription('Wczytuje wcześniej zapisaną playlistę'),
	get playerCheck() {
		return { voice: true, dispatcher: false, channel: false };
	},

	async execute(interaction, client) {
		await interaction.deferReply();
		const db = client.databases.playlists;
		if (!db[interaction.member.id]) {
			return interaction.editReply('Nie masz żadnej zapisanej playlisty!');
		}
		else {
			const node = client.shoukaku.getIdealNode();
			const dispatcher = await client.queue.handle(interaction.guild, interaction.member, interaction.channel, node, db[interaction.member.id].tracks);
			await interaction.editReply(`Dodałam \`${db[interaction.member.id].tracks.length}\` utworów do kolejki!`);

			dispatcher?.play();
			client.queue.get(interaction.guildId)?.editPlayingMessage();
		}

		setTimeout(async function() {
			await interaction.deleteReply();
		}, 15000);
	},
};