const fs = require('node:fs');
const path = require('node:path');
const { Collection } = require('discord.js');
const EventEmitter = require('events');

class ButtonHandler extends EventEmitter {
	constructor(client) {
		super();
		this.client = client;
		this.commands = new Collection();
		this.built = false;
		this.on('error', error => client.logger.error(error));
		this.client.on('interactionCreate', interaction => this.exec(interaction));
	}

	build() {
		if (this.built) return this;
		this.commands = new Collection();
		const commandsPath = path.join(__dirname, '../buttons');
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = require(filePath);
			this.commands.set(command.data.name, command);
			this.client.logger.debug('[ButtonHandler]build', `Loaded ${file} command!`);
		}
		this.built = true;
		return this;
	}

	async exec(interaction) {
		try {
			if (!interaction.isButton()) return;

			this.client.logger.info('[ButtonHandler]exec', `Interaction used: ${interaction.customId} | ${interaction.guildId} by ${interaction.member.id}!`);

			const command = this.commands.get(interaction.customId);
			if (!command) return;

			interaction.deferUpdate();

			this.client.logger.log('[ButtonHandler]exec', `Resolving interaction: ${interaction.customId} | ${interaction.guildId} by ${interaction.member.id}!`);
			if (command.playerCheck?.voice && !interaction.member.voice.channelId) return;
			const dispatcher = this.client.queue.get(interaction.guildId);
			if (command.playerCheck?.dispatcher && !dispatcher) return;
			if (command.playerCheck?.channel && dispatcher.voiceChannelId !== interaction.member.voice.channelId) return;
			await command.execute(interaction, this.client, dispatcher);
		}
		catch (error) {
			this.client.logger.error('[ButtonHandler]exec', `Resolving interaction failed: ${interaction.customId} | ${interaction.guildId} by ${interaction.member.id}!\nERROR: ${error}`);
			this.emit('error', error);
		}
	}
}

module.exports = ButtonHandler;
