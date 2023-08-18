const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

function pad(num, ctplaces) {
	let s = num.toString ();
	while (s.length < ctplaces) { s = '0' + s; }
	return (s);
}

class Menus {

	constructor(client) {
		this.client = client;
	}

	msToTime(liczba) {
		if (liczba < 0) return 'mniej niż 0 sekund';
		if (liczba == 0) return 'równe 0 sekund';
		const dni = Math.floor(liczba / 86400000);
		liczba = liczba % 86400000;
		const godziny = Math.floor(liczba / 3600000);
		liczba = liczba % 3600000;
		const minuty = Math.floor(liczba / 60000);
		liczba = liczba % 60000;
		const sekundy = Math.floor(liczba / 1000);
		const dniPL = { 1:'dzień' };
		const godzPL = { 1:'godzina', 2:'godziny', 3:'godziny', 4:'godziny', 22:'godziny', 23:'godziny', 24:'godziny', 32:'godziny', 33:'godziny', 34:'godziny', 42:'godziny', 43:'godziny', 44:'godziny', 52:'godziny', 53:'godziny', 54:'godziny' };
		const minPL = { 1:'minuta', 2:'minuty', 3:'minuty', 4:'minuty', 22:'minuty', 23:'minuty', 24:'minuty', 32:'minuty', 33:'minuty', 34:'minuty', 42:'minuty', 43:'minuty', 44:'minuty', 52:'minuty', 53:'minuty', 54:'minuty' };
		const sekPL = { 1:'sekunda', 2:'sekundy', 3:'sekundy', 4:'sekundy', 22:'sekundy', 23:'sekundy', 24:'sekundy', 32:'sekundy', 33:'sekundy', 34:'sekundy', 42:'sekundy', 43:'sekundy', 44:'sekundy', 52:'sekundy', 53:'sekundy', 54:'sekundy' };
		let text = '';
		if (dni > 0) text += `${dni} ${dniPL[dni] ? dniPL[dni] : 'dni'} `;
		if (godziny > 0) text += `${godziny} ${godzPL[godziny] ? godzPL[godziny] : 'godzin'} `;
		if (minuty > 0) text += `${minuty} ${minPL[minuty] ? minPL[minuty] : 'minut'} `;
		if (sekundy > 0) text += `${sekundy} ${sekPL[sekundy] ? sekPL[sekundy] : 'sekund'} `;
		return text;
	}

	ReturnTrackTime(liczba) {
		if (liczba > 3600000000) return '  ∞  ';
		if (liczba < 0 || isNaN(liczba)) return '00:00';
		if (liczba > 3600000) return ' >1h ';
		liczba = liczba % 3600000;
		const minuty = Math.floor(liczba / 60000);
		liczba = liczba % 60000;
		const sekundy = Math.floor(liczba / 1000);
		return `${pad(minuty, 2)}:${pad(sekundy, 2)}`;
	}

	createDefaultEmbed() {
		const embed = new EmbedBuilder()
			.setColor(7132823)
			// .setAuthor({name: 'Windsalis', iconURL: 'https://i.ibb.co/GPngkVX/Rainsalis-serwer-avek-v2.png'})
			.setFooter({ text: '🎵 WindsalisFM' })
			.setTimestamp();
		return embed;
	}

	YoutubeVideosEmbed(playlist, text) {
		const embed = this.createDefaultEmbed();
		embed.setTitle('Wybór utworu');
		embed.setDescription(`Wyszukiwana fraza: "${text}"\nWybierz utwór za pomocą przycisku:`);
		const reaction = { 0:'1⃣', 1:'2⃣', 2:'3⃣', 3:'4⃣', 4:'5⃣' };
		for (let i = 0; i < (playlist.length > 5 ? 5 : playlist.length); i++) {
			embed.addFields({
				name: `${reaction[i]} ${playlist[i].info.title}`,
				value: `[_${playlist[i].info.author}_](${playlist[i].info.uri})\nDługość: ${ playlist[i].info.length < 216000000 ? `${this.msToTime(playlist[i].info.length)}` : 'Stream (∞)'}\n   ‌ `,
			});
		}
		return embed;
	}

	buttonCreator(howMany, arrows) {
		const row1 = new ActionRowBuilder();
		const row2 = new ActionRowBuilder();
		if (arrows) {
			row2.addComponents(
				new ButtonBuilder()
					.setCustomId('prev')
					.setLabel('prev')
					.setStyle(ButtonStyle.Primary)
					.setEmoji('◀'),
			);
		}
		for (let i = 0; i < howMany; i++) {
			row1.addComponents(
				new ButtonBuilder()
					.setCustomId(i.toString())
					.setLabel((i + 1).toString())
					.setStyle(ButtonStyle.Primary),
			);
		}
		if (arrows) {
			row2.addComponents(
				new ButtonBuilder()
					.setCustomId('next')
					.setLabel('next')
					.setStyle(ButtonStyle.Primary)
					.setEmoji('▶'),
			);
		}

		row2.addComponents(
			new ButtonBuilder()
				.setCustomId('cancel')
				.setStyle(ButtonStyle.Danger)
				.setEmoji('✖️'),
		);
		return [row1, row2];
	}

	playingButtonCreator() {
		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('buttonSkip')
					.setLabel('Pomiń')
					.setEmoji('⏩')
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId('buttonStop')
					.setLabel('Stop')
					.setEmoji('⏹')
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId('buttonPause')
					.setLabel('Pauza')
					.setEmoji('⏸')
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId('buttonShuffle')
					.setLabel('Wymieszaj')
					.setEmoji('🔄')
					.setStyle(ButtonStyle.Secondary),
			);
		return [ row ];
	}

	playingEmbed(dispatcher) {
		const words = { '-2':'⏮️', '-1':'⏪', 0:'▶️', 1:'⏩', 2:'⏭️' };
		const tracksPL = { 1:'utwór', 2:'utwory', 3:'utwory', 4:'utwory' };
		const q = dispatcher.queue;
		let time = dispatcher.current ? dispatcher.current.info.length : 0;
		if (q.length) q.forEach(track => time += track.info.length);
		let pastTracksLength = 0;
		dispatcher.past.map(x => x.info.length).forEach(x => pastTracksLength += x);

		const pp = dispatcher.player.position;

		const embed = new EmbedBuilder()
			.setColor(7132823)
			.setTimestamp()
			.setAuthor({ name: 'Windsalis🎵', iconURL: 'https://i.ibb.co/GPngkVX/Rainsalis-serwer-avek-v2.png' })
			.setDescription(`Głośność: 🔊\`\`${dispatcher.player.volume}%\`\`${dispatcher.automode ? '\nTryb automatyczny ``włączony``!\n   ‌ ' : ''}${dispatcher.repeat === 'all' ? '\nOdtwarzam 🔁``playlistę`` w pętli!\n   ‌ ' : ''}${dispatcher.repeat === 'one' ? '\nOdtwarzam 🔂``utwór`` w pętli!\n   ‌ ' : ''}`);
		if (dispatcher.automode) {
			embed.setFooter({
				text:`${ dispatcher.paused === true ? '⏸ Odtwarzanie wstrzymane!' : `🎶 Gram jeden z ${this.client.databases.tracklist.tracks.length} utworów! (/skip by usunąć)`}\n▶️ Muzyka gra przez ${this.msToTime(new Date().getTime() - new Date(dispatcher.message.createdAt).getTime())}!`,
			});
		}
		else {
			embed.setFooter({
				text: `${ dispatcher.paused === true ? '⏸ Odtwarzanie wstrzymane!' : `🎶 Kolejka liczy: ${q.length + (dispatcher.current ? 1 : 0)} ${tracksPL[q.length + (dispatcher.current ? 1 : 0)] ? tracksPL[q.length + (dispatcher.current ? 1 : 0)] : 'utworów'}!\n${q.length > 0 ? ` ${ time < 216000000 ? `▶️ Czas trwania: ${this.msToTime(time)}` : '▶️ Czas trwania: ∞' }` : '▶️ Czas trwania: Krótko'}` }`,
			});
		}
		if (dispatcher.current) {
			embed.setImage(`https://img.youtube.com/vi/${dispatcher.current.info.identifier}/maxresdefault.jpg`)
				.addFields({
					name: `${words[0]} ${dispatcher.current.info.title}`,
					value: `[_${dispatcher.current.info.author}_](${dispatcher.current.info.uri})
${ dispatcher.current.info.length > 216000000 ? 'Stream!' : `${this.ReturnTrackTime(pp)} / ${this.ReturnTrackTime(dispatcher.current.info.length)} [ ${Math.round((pp / dispatcher.current.info.length) * 100)}% ]
Następny utwór <t:${Math.floor((new Date().getTime() + dispatcher.current.info.length - pp)/1000)}:R>\n   ‌ `} `,
				});
		}
		else {
			embed.addFields({
				name: 'Nic nie ma w kolejce!',
				value: `<t:${new Date().getTime()/1000 + 180}:R> tryb automatyczny zostanie włączony. Nie może być cicho na kanale!\n   ‌ `, 
			});
		}
		for (let i = 0; i < (q.length > 2 ? 2 : q.length); i++) {
			embed.addFields({ name: `${words[i + 1]} ${q[i].info.title}`,
				value: `${this.ReturnTrackTime(q[i].info.length)} - [_${q[i].info.author}_](${q[i].info.uri})\n   ‌ `,
			});
		}
		return [ embed ];
	}
}

module.exports = Menus;