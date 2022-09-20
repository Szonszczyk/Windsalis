module.exports = {
    name: 'guildCreate',
    once: false,
    execute(client) {
        client.logger.log("[events]guildCreate", `New guild => ${guild.name} with ${guild.memberCount} members`);
    },
};