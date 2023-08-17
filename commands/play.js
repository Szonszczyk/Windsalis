const { SlashCommandBuilder } = require('@discordjs/builders');

function checkURL(string) {
	try {
		new URL(string);
		return true;
	}
	catch (error) {
		return false;
	}
}

function getYoutubeVideoId(url) {
	const id = /[&|\?]v=([a-zA-Z0-9_-]+)/gi.exec(url);
	return (id && id.length > 0) ? id[1] : false;
}
function getYoutubeTimeId(url) {
	const id = /[&|\?]t=([0-9]+)/gi.exec(url);
	return (id && id.length > 0) ? id[1] : false;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Puszcza muzykę lub dodaje do kolejki utworów')
		.addStringOption(option =>
			option.setName('query')
				.setDescription('YouTube link lub wyszukanie które mam zagrać.')
				.setRequired(true),
		),
	get playerCheck() {
		return { voice: true, dispatcher: false, channel: false };
	},
  
	async execute(interaction, client) {
		await interaction.deferReply();
		const query = interaction.options.getString('query');
		const node = client.shoukaku.getIdealNode();

		if (checkURL(query)) {
			const result = await node.rest.resolve(query);
			if (!result?.tracks.length) return interaction.editReply('Nic nie znalazłam do puszczenia...');
			const playlist = result.loadType === 'playlist';
			const ytVideoId = getYoutubeVideoId(query);
			if (playlist && ytVideoId) {
				for (let i = 0; i < result.tracks.length; i++) {
					if (ytVideoId == result.tracks[i].info.identifier) {
						result.tracks = result.tracks.slice(i, result.tracks.length - 1);
					}
				}
			}
			const tracks = playlist ? result.tracks : [result.data];
			const dispatcher = await client.queue.handle(interaction.guild, interaction.member, interaction.channel, node, tracks);
			let offset = 0;
			if (getYoutubeTimeId(query) != false && !isNaN(Number(getYoutubeTimeId(query)))) offset = 1000 * getYoutubeTimeId(query);
			if (dispatcher === 'Busy') return interaction.editReply('Łączę się z kanałem głosowym, minutka!');
			await interaction
				.editReply(playlist ? `Dodałam \`${result.playlistInfo.name}\` do kolejki!` : `Dodałam \`${tracks[0].info.title}\` do kolejki!`)
				.catch(() => null);

			client.databases.addTracktoTracklist(tracks);
			if (offset != 0) dispatcher?.player.seekTo(offset);
			dispatcher?.play();
			client.queue.get(interaction.guildId)?.editPlayingMessage();
			setTimeout(async function() {
				await interaction.deleteReply();
			}, 30000);
			return;
		}
		else {
			const search = await node.rest.resolve(`ytsearch:${query}`);
			if (!search?.tracks.length) return interaction.editReply('Nic nie znalazłam, przepraszam! Zaraz poinformuję mojego właściciela i postaramy się to naprawić!');

			await interaction.editReply({ embeds: [client.menus.YoutubeVideosEmbed(search.tracks, query)], components: client.menus.buttonCreator(5, false) });

			const filter = i => ['0', '1', '2', '3', '4', 'cancel'].indexOf(i.customId) > -1 && i.user.id === interaction.member.id;
			const collector = interaction.channel.createMessageComponentCollector({ filter, time: 120000 });

			collector.on('collect', async i => {
				await i.update({ content: 'Już działam!', components: [] });
				if (Number(i.customId) > -1 && Number(i.customId) < 5) {
					const track = search.tracks[Number(i.customId)];
					const dispatcher = await client.queue.handle(interaction.guild, interaction.member, interaction.channel, node, [track]);
					if (dispatcher === 'Busy') return i.editReply('Łączę się z kanałem głosowym, minutka!');
					await interaction
						.editReply({ content: `Dodałam \`${track.info.title}\` do kolejki!`, embeds: [] })
						.catch(() => null);

					client.databases.addTracktoTracklist([track]);
					dispatcher?.play();
					client.queue.get(interaction.guildId)?.editPlayingMessage();
				}
				if (i.customId === 'cancel') {
					await i.editReply({ content: 'Anulowano wybór.', embeds: [] });
				}
				collector.stop();
			});
			collector.on('end', async () => {
				setTimeout(async function() {
					await interaction.deleteReply();
				}, 30000);

			});
		}
	},
};
