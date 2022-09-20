module.exports = {
	name: 'guildCreate',
	once: false,
	execute(client, guild) {
		client.logger.log('[events]guildCreate', `New guild => ${guild.name} with ${guild.memberCount} members`);
	},
};