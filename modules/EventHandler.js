const fs = require('node:fs');
const path = require('node:path');

class EventHandler {
    constructor(client) {
        this.client = client;
        this.built = false;
        client.on('shardReconnecting', (id) => client.logger.debug(`[EventHandler]shardReconnecting`, `Shard ${id} Reconnecting`));
        client.on('shardResumed', (id, rep) => client.logger.debug(`[EventHandler]shardResumed`, `Shard ${id} Resume | ${rep} events replayed`));
        client.on('shardReady', (id) => client.logger.debug(`[EventHandler]shardReady`, `Shard ${id} Ready`));
    }

    build() {
        if (this.built) return this;
        const eventsPath = path.join(__dirname, '../events');
        const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

        for (const file of eventFiles) {
            const filePath = path.join(eventsPath, file);
            const event = require(filePath);
            this.client.logger.debug(`[EventHandler]build`, `Loaded ${file} event!`);
            if (event.once) {
                this.client.once(event.name, (...args) => event.execute(...args));
            } else {
                this.client.on(event.name, (...args) => event.execute(...args));
            }
        }
        
        this.built = true;
        return this;
    }
}

module.exports = EventHandler;
