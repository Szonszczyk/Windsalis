class Dispatcher {
	constructor({ client, guild, channel, player, message }) {
		this.client = client;
		this.guild = guild;
		this.channel = channel;
		this.player = player;
		this.message = message;
		this.queue = [];
		this.past = [];
		this.repeat = 'off';
		this.current = null;
		this.stopped = false;
		this.paused = false;
		this.automode = false;
		this.lastEditedMsgTime = new Date();


		let _notifiedOnce = false;
		const _errorHandler = data => {
			if (data instanceof Error || data instanceof Object) this.client.logger.error('[Dispatcher]_errorHandler', data);
			this.queue.length = 0;
			this.destroy();
		};

		this.player
			.on('start', () => {
				if (this.repeat === 'one') {
					if (_notifiedOnce) return;
					else _notifiedOnce = true;
				}
				else if (this.repeat === 'all' || this.repeat === 'off') {
					_notifiedOnce = false;
				}
				this.editPlayingMessage();
			})
			.on('end', () => {
				if (this.repeat === 'one') this.queue.unshift(this.current);
				if (this.repeat === 'all') this.queue.push(this.current);
				this.play();
			})
			.on('stuck', () => {
				if (this.repeat === 'one') this.queue.unshift(this.current);
				if (this.repeat === 'all') this.queue.push(this.current);
				this.play();
			})
			.on('closed', _errorHandler)
			.on('error', _errorHandler);
	}

	get exists() {
		return this.client.queue.has(this.guild.id);
	}

	play() {
		if (!this.exists || this.stopped) return this.destroy();
		if (this.current != null) this.past.push(this.current);
		this.current = null;
		if (!this.queue.length) return this.tryAutoMode();
		if (this.automode === true) this.addTrackAutoMode();
		this.current = this.queue.shift();
		this.player
			.setVolume(0.6)
			.playTrack({ track: this.current.track });
		this.editPlayingMessageinIntervals();
	}

	destroy(reason) {
		this.queue.length = 0;
		this.player.connection.disconnect();
		this.client.queue.delete(this.guild.id);
		this.client.logger.debug('[Dispatcher]destroy', `Destroyed the player & connection @ guild "${this.guild.id}"\nReason: ${reason || 'No Reason Provided'}`);
	}

	editPlayingMessage() {
		this.lastEditedMsgTime = new Date();
		this.message
			.edit({ embeds: this.client.menus.playingEmbed(this) })
			.catch(() => null);
	}

	editPlayingMessageinIntervals() {
		this.interval = setInterval(() => {
			if (new Date().getTime() - this.lastEditedMsgTime.getTime() >= 25000) {
				this.editPlayingMessage();
			}
			else {
				clearInterval(this.interval);
			}

		}, Math.floor(Math.random() * 10000) + 25000);
	}

	resolvePause() {
		if (!this.paused) {
			this.player.setPaused(true);
			this.paused = true;
		}
		else {
			this.player.setPaused(false);
			this.paused = false;
		}
		this.editPlayingMessage();
		return this.paused;
	}

	async tryAutoMode() {
		this.editPlayingMessage();
		await new Promise(resolve => setTimeout(resolve, 180000));
		if (this.current != null) return;
		this.automode = true;
		await this.addTrackAutoMode();
		await this.addTrackAutoMode();
		this.play();

	}

	async addTrackAutoMode() {
		let newTrack = {};
		const pastTracksUri = this.past.map(x => x.info.uri);

		do { newTrack = this.client.databases.tracklist.tracks.random(); } while (pastTracksUri.indexOf(newTrack) > -1);

		const node = this.client.shoukaku.getNode();
		const result = await node.rest.resolve(newTrack);
		this.client.logger.debug('[Dispatcher]addTrackAutoMode', `Automode add "${result.tracks[0].info.title}" to Queue`);
		this.queue.push(result.tracks[0]);
	}
}
module.exports = Dispatcher;
