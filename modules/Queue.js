const Dispatcher = require('./Dispatcher.js');

class Queue extends Map {
	constructor(client, iterable) {
		super(iterable);
		this.client = client;
	}

	async handle(guild, member, channel, tracks) {
		const existing = this.get(guild.id);
		if (!existing) {
			if (this.client.shoukaku.players.has(guild.id)) return 'Busy';
			const player = await this.client.shoukaku.joinVoiceChannel({
				guildId: guild.id,
				channelId: member.voice.channelId,
				shardId: guild.shardId,
			});
			const message = await channel.send({ embeds: [ this.client.menus.createDefaultEmbed() ], components: this.client.menus.playingButtonCreator() });
			this.client.logger.debug('[Queue]handle', `New connection @ guild "${guild.id}"`);
			const dispatcher = new Dispatcher({
				client: this.client,
				guild,
				channel,
				player,
				message,
				voiceChannelId: member.voice.channelId,
			});
			for (const track of tracks) {
				dispatcher.queue.push(track);
			}
			this.set(guild.id, dispatcher);
			this.client.logger.debug('[Queue]handle', `New player dispatcher @ guild "${guild.id}"`);
			return dispatcher;
		}
		if (existing.automode === true) {
			existing.automode = false;
			existing.queue = [];
			existing.player.stopTrack();
		}
		for (const track of tracks) {
			existing.queue.push(track);
		}
		if (!existing.current) existing.play();

		return null;
	}
}
module.exports = Queue;
