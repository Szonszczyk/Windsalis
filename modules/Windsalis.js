const ShoukakuHandler = require('./ShoukakuHandler.js');
const { Client, Collection, GatewayIntentBits, LimitedCollection } = require('discord.js');
const { token } = require('../config.json');
const WindLogger = require('./Logger.js');
const Queue = require('./Queue.js');
const EventHandler = require('./EventHandler.js');
const InteractionHandler = require('./InteractionHandler.js');
const ButtonHandler = require('./ButtonHandler.js');
const Menus = require('./Menus.js');
const Databases = require('./Databases.js');

class Windsalis extends Client {
    constructor(options) {
        // create cache
        options.makeCache = manager => {
            switch(manager.name) {
                // Disable Cache
                case 'GuildEmojiManager': 
                case 'GuildBanManager': 
                case 'GuildInviteManager':
                case 'GuildStickerManager':
                case 'StageInstanceManager':
                case 'PresenceManager':
                case 'ThreadManager': return new LimitedCollection({ maxSize: 0 });
                // TLRU cache, Lifetime 30 minutes
                case 'MessageManager': return new LimitedCollection({ maxSize: 1 });
                // Default cache
                default: return new Collection();
            }
        };
        super(options);
        this.color = 7132823;

        this.logger = new WindLogger()
        this.shoukaku = new ShoukakuHandler(this);
        this.queue = new Queue(this);

        this.interactions = new InteractionHandler(this).build();
        this.buttons = new ButtonHandler(this).build();
        this.events = new EventHandler(this).build();

        this.menus = new Menus(this);
        this.databases = new Databases(this).build();
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
