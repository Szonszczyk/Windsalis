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
			if (data instanceof Error || data instanceof Object) this.client.logger.error('[Dispatcher]_errorHandler', data.toString());
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
			.on('closed', () => {
				// error to user
				this.destroy("Player closed");
			})
			.on('end', () => {
				if (this.repeat === 'one') this.queue.unshift(this.current);
				if (this.repeat === 'all') this.queue.push(this.current);
				this.play();
			})
			.on('stuck', () => {
				this.client.logger.debug('[Dispatcher]onStuck', `Track playback stuck, force emitting end`);
				this.player.emit('end');
			})
			.on('error', _errorHandler);
	}

	get exists() {
		return this.client.queue.has(this.guild.id);
	}

	async play() {
		if (!this.exists || this.stopped) return this.destroy();
		if (this.current != null) this.past.push(this.current);
		this.current = null;
		if (!this.queue.length) return this.tryAutoMode();
		if (this.automode === true) await this.addTrackAutoMode(1);
		do {
			this.current = this.queue.shift();
		} while (this.current && this.current.info.length < 5500 && this.current);
		if (this.current) {
			await this.player.setGlobalVolume(60);
			await this.player.playTrack({ track: this.current.encoded });
			this.editPlayingMessageinIntervals();
		} else {
			this.tryAutoMode();
		}
		
	}

	async destroy(reason) {
		this.queue.length = 0;
		this.stopped = true;
		this.player = null;
		await this.client.shoukaku.leaveVoiceChannel(this.guild.id);
		this.client.logger.debug('[Dispatcher]destroy', `Destroyed the player & connection @ guild "${this.guild.id}"\nReason: ${reason || 'No Reason Provided'}`);
		this.client.queue.delete(this.guild.id);
	}

	editPlayingMessage() {
		this.lastEditedMsgTime = new Date();
		this.message
			.edit({ embeds: this.client.menus.playingEmbed(this) })
			.catch(() => null);
	}

	editPlayingMessageinIntervals() {
		this.interval = setInterval(() => {
			if (this.player === null) {
				clearInterval(this.interval);
				return;
			}
			if (new Date().getTime() - this.lastEditedMsgTime.getTime() >= 25000) {
				this.editPlayingMessage();
			}
			else {
				clearInterval(this.interval);
			}

		}, Math.floor(Math.random() * 10000) + 25000);
	}

	resolvePause() {
		this.player.setPaused(!this.player.paused);
		this.paused = !this.paused;
		this.editPlayingMessage();
		return this.paused;
	}

	async tryAutoMode() {
		this.editPlayingMessage();
		await new Promise(resolve => setTimeout(resolve, 180000));
		if (this.current != null) return;
		this.automode = true;
		await this.addTrackAutoMode(2);
		this.play();
	}

	async addTrackAutoMode(quant) {
		for (let i = 0; i < quant; i++) {
			let newTrack = {};
			const pastTracksUri = this.past.map(x => x.info.uri);
			do { newTrack = this.client.databases.tracklist.tracks.random(); } while (pastTracksUri.indexOf(newTrack) > -1);
			const node = this.client.shoukaku.options.nodeResolver(this.client.shoukaku.nodes);
			const result = await node.rest.resolve(newTrack);
			this.client.logger.debug('[Dispatcher]addTrackAutoMode', `Automode add "${result.data.info.title}" to Queue`);
			this.queue.push(result.data);
		}
	}
}
module.exports = Dispatcher;
