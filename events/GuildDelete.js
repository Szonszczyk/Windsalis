module.exports = {
    name: 'guildDelete',
    once: false,
    execute(client) {
        client.logger.log("[events]guildDelete", `Removed guild => ${guild.name} with ${guild.memberCount} members`);
    },
};