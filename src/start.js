const { GatewayIntentBits, Client, Collection } = require('discord.js');
const { readdirSync } = require('fs');
const { join } = require('path');
const logger = require("./utils/npmlog");
const config = require('./conf.json');

require('dotenv').config({ path: `${process.cwd()}/.env` });

const client = new Client(
	{
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.MessageContent,
			GatewayIntentBits.GuildMembers,
		],
	},
);

logger.level = process.argv[2] === "verbose" ? "verbose" : "info"
const token = process.env.TOKEN;
client.commands = new Collection();
client.conf = config;
client.logger = logger;

const eventsFile = readdirSync(`${__dirname}/event`).filter(
	(file) => (file.endsWith('.js')),
);
const commandFile = readdirSync(`${__dirname}/commands`).filter(
	(file) => (file.endsWith('.js')),
);

client.once('ready', () => {
	logger.info("ready","bot logged in and is ready");
});

for (const file of commandFile) {
	const command = require(`${__dirname}/commands/${file}`);
	try {
		command.client = client;
		logger.info("commands", "loading %j", command.name)
		client.commands.set(command.name, command);
	} catch (e) {
		logger.warn("commands", "error loading %j with an error: %j", command.name, e);
	}
}
for (const file of eventsFile) {
	const events = require(join(`${__dirname}/event`, file));
	try {
		events.client = client;
		logger.info("events", "loading %j", events.name)
		client.on(events.name, (...args) => events.exc(...args));
	} catch (e) {
		logger.warn("events", "error loading %j with an error: %j", events.name, e)
	}
}


client.login(token);
