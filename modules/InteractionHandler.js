const fs = require('node:fs');
const path = require('node:path');
const { EmbedBuilder, Collection } = require('discord.js');
const EventEmitter = require('events');

class InteractionHandler extends EventEmitter {
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
		const commandsPath = path.join(__dirname, '../commands');
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = require(filePath);
			this.commands.set(command.data.name, command);
			this.client.logger.debug('[InteractionHandler]build', `Loaded ${file} command!`);
		}
		this.built = true;
		return this;
	}

	async exec(interaction) {
		try {
			if (!interaction.isChatInputCommand()) return;

			this.client.logger.info('[InteractionHandler]exec', `Interaction used: ${interaction.commandName} | ${interaction.guildId} by ${interaction.member.id}!`);

			const command = this.commands.get(interaction.commandName);
			if (!command) return;

			this.client.logger.log('[InteractionHandler]exec', `Resolving interaction: ${interaction.commandName} | ${interaction.guildId} by ${interaction.member.id}!`);
			if (command.playerCheck?.voice && !interaction.member.voice.channelId) return interaction.reply('Musisz być na kanale głosowym by użyć tej komendy!');
			const dispatcher = this.client.queue.get(interaction.guildId);
			if (command.playerCheck?.dispatcher && !dispatcher) return interaction.reply('Nic tu nie gra. Daj mi spokój.');
			if (command.playerCheck?.channel && dispatcher.player.connection.channelId !== interaction.member.voice.channelId) return interaction.reply('Nie jesteśmy na tym samym kanale głosowym!');
			await command.execute(interaction, this.client, dispatcher);
		}
		catch (error) {
			this.client.logger.error('[InteractionHandler]exec', `Resolving interaction failed: ${interaction.commandName} | ${interaction.guildId} by ${interaction.member.id}!\nERROR: ${error}`);
			const embed = new EmbedBuilder()
				.setColor(0xff99CC)
				.setTitle('ERROR! Pomusz ;_;')
				.setDescription(`\`\`\`js\n ${error.toString()}\`\`\``)
				.setTimestamp()
				.setFooter({ text: this.client.user.username, iconURL: this.client.user.displayAvatarURL() });
			if (interaction.replied || interaction.deferred) {
				await interaction
					.editReply({ embeds: [ embed ] })
					.catch(error => this.emit('error', error));
			}
			else {
				await interaction
					.reply({ embeds: [ embed ] })
					.catch(error => this.emit('error', error));
			}
			this.emit('error', error);
		}
	}
}

module.exports = InteractionHandler;
