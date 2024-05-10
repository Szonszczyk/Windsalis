const { Client, Collection, LimitedCollection } = require('discord.js');
const { token } = require('../config.json');
const WindLogger = require('./Logger.js');
const Queue = require('./Queue.js');
const EventHandler = require('./EventHandler.js');
const InteractionHandler = require('./InteractionHandler.js');
const ButtonHandler = require('./ButtonHandler.js');
const Menus = require('./Menus.js');
const Databases = require('./Databases.js');

const { Shoukaku, Connectors } = require('shoukaku');
const servers = require('../lavalink-server.json');
const shoukakuOptions = require('../shoukaku-options.js');

class Windsalis extends Client {
	constructor(options) {
		super(options);
		this.color = 7132823;

		this.logger = new WindLogger();
		this.shoukaku = new Shoukaku(new Connectors.DiscordJS(this), servers, shoukakuOptions);
		this.queue = new Queue(this);

		this.interactions = new InteractionHandler(this).build();
		this.buttons = new ButtonHandler(this).build();
		this.events = new EventHandler(this).build();

		this.menus = new Menus(this);
		this.databases = new Databases(this).build();

		this.shoukaku
            .on('ready', name => this.logger.log('[Shoukaku]ready', `Lavalink Node: ${name} is now ready`))
            .on('reconnecting', (name, left, timeout) => this.logger.warn('[Shoukaku]reconnecting', `Lavalink Node: ${name} is reconnecting. Tries Left: ${left} | Timeout: ${timeout}s`))
            .on('disconnect', (name, moved) => this.logger.warn('[Shoukaku]disconnect', `Lavalink Node: ${name} is disconnected. Moved: ${moved}`))
            .on('error', (name, error) => this.logger.error('[Shoukaku]error', `Lavalink Node: ${name} threw an error.\n${error}`))
            .on('debug', (name, message) => {
            const lowercase = message.toLowerCase();
            if (lowercase.includes('status update'))
                return;
            this.logger.debug('[ShoukakuHandler]debug', `Lavalink Node: ${name} | ${message}`);
        });
	}

	async login() {
		await super.login(token);
		return this.constructor.name;
	}

	exit() {
		if (this.quitting) return;
		this.quitting = true;
		this.destroy();
	}
}

module.exports = Windsalis;





