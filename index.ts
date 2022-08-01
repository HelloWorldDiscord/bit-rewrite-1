import { Collection } from "@discordjs/collection";
import fs from "fs"
import path from "path"

// Require the necessary discord.js classes
const { Client, GatewayIntentBits } = require('discord.js');


// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection()
const commandsPath = path.join(__dirname, 'commands')
const eventsPath = path.join(__dirname, 'events')

const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith("ts"))

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file)
  const command = require(filePath)

  client.commands.set(command.data?.name, command)
}
// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

// Login to Discord with your client's token
client.login(process.env['TOKEN']);