const { GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const WindClient = require('./modules/Windsalis.js');

const client = new WindClient({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildVoiceStates] });

client.login(token);