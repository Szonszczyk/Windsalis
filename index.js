const { Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const WindClient = require('./modules/Windsalis.js');

const client = new WindClient({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

client.login(token);