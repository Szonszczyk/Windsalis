module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        client.logger.log("[events]ClientOnReady", `Ready! Serving ${client.guilds.cache.size} guild(s) with ${client.users.cache.size} user(s)`);
    },
};