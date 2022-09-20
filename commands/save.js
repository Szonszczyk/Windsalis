const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('save')
		.setDescription('Zapisuje aktualnie graną playlistę do późniejszego odtworzenia przez "load"'),
	get playerCheck() {
		return { voice: false, dispatcher: true, channel: false };
	},

	async execute(interaction, client, dispatcher) {
		const db = client.databases.playlists;
		if (!db[interaction.member.id]) {
			db[interaction.member.id] = { tracks: [] };
		}
		db[interaction.member.id] = { tracks: [dispatcher.current].concat(dispatcher.queue) };
		const result = client.databases.SaveDb(db, 'playlists');
		result ? await interaction.reply('Pomyślnie zapisano playlistę!') : await interaction.reply('Nie udało się zapisać playlisty!');

		setTimeout(async function() {
			await interaction.deleteReply();
		}, 15000);
	},
};