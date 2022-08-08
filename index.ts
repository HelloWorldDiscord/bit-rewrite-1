import { Collection } from "@discordjs/collection";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, GuildMember, Interaction, InteractionType, Message, Presence, TextChannel } from "discord.js";
import fs from "fs"
import ms from "ms";
import path from "path"
require("dotenv").config()
import moment from "moment"
import { log } from "./utils/logger";
import emoji from "./utils/emoji.json"
import axios from "axios"

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
	log.success('Ready!');
});

client.on("guildMemberAdd", async (member: GuildMember) => {
	if (member.guild.id !== "924767148738486332") return;
	const row = new ActionRowBuilder()
		.addComponents(
			new ButtonBuilder()
				.setCustomId('creation-date')
				.setLabel(`Created ${moment(member.user.createdTimestamp).fromNow()}`)
				.setStyle(member.user.createdTimestamp > Date.now() - 1209600000 ? ButtonStyle.Danger : ButtonStyle.Success)
				.setDisabled(true),
			new ButtonBuilder()
				.setCustomId("username")
				.setLabel(`Username: ${member.user.tag}`)
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(true),
		);
	const channel = client.channels.cache.get("928779076225871903")
	channel.send({ content: `${member.id}`, components: [row] })
})

client.on("messageCreate", async (message: Message) => {
	if (message.partial) await message.fetch()
	if (!message.guild) return
	if (message.author.bot) {
		if(message.author.id !== "947558235311849492" && message.author.id !== "951621166181810227") {
			return;
		}
	}
	if (message.channel.id === "947890855463755777") {
		if (message.channel.isThread()) return;
		const date = new Date()
		message.startThread({
			name: `${date.getDate()}.${date.getMonth() + 1} | ${message.author.tag} project discussion`,
			reason: `Auto create thread on posting project`
		})
	} else if (message.channel.id == "971060166361493514") {
		if (message.channel.isThread()) return;
		const date = new Date()
		message.startThread({
			name: `${date.getDate()}.${date.getMonth() + 1} | ${message.author.tag} recruitment discussion`,
			reason: `Auto create thread on posting recruitment message`
		})
	} else if (message.channel.id == "924785003030798377") {
		if (message.embeds.length !== 0) {
			if (message.embeds[0].title?.includes("Join Raid Trigger!")) {
				axios.post("https://api.pushcut.io/p3sNM0J6g23sMrzXbdonR/notifications/Hello%20World!%20Raid%20Alert")
					.then(() => {
						message.react(emoji.important)
						message.reply(`${emoji.check} net-tech- notified sucessfully via mobile push notification.`)
					})
					.catch(() => { })
			}
		}
	}
	const langRegexandResponse = {
		"[\u0600-\u06FF]+": "يرجى التحدث باللغة الإنجليزية فقط في هذا الخادم.", //Arabic
		"(\u0196|\u0214|\u0220|\u0223|\u0228|\u0246|\u0252)+": "Bitte sprechen Sie auf diesem Server nur Englisch.", //German
		"(\u0192|\u0194|\u0196|\u0198|\u0199|[\u0200-\u0204]|\u0206|\u0207|\u0210|\u0212|\u0140|\u0217|\u0219|\u0220|\u0224|\u0226|\u0228|\u0230|\u0231|[\u0232-\u0236]|\u0238|\u0239|\u0244|\u0244|\u0156|\u0249|\u0251|\u0252)+": "Si prega di parlare solo inglese in questo server. || Veuillez ne parler que l'anglais sur ce serveur.", //Italian and French
		"(\u0161|\u0191|\u0193|\u0201|\u0205|\u0209|\u0211|\u0218|\u0220|\u0225|\u0233|\u0237|\u0241|\u0243|\u0250|\u0252)+": "Por favor, solo hable inglés en este servidor.", //Spanish
		"[\u4e00-\u9faf\u3400-\u4dbf]+": "请在此服务器中只说英语。", //Chinese
		"[\u0400-\u04FF]+": "Пожалуйста, говорите на этом сервере только по-английски. || Molimo Vas da govorite samo na engleskom na ovom serveru.", //Russian and Serbian
		"[\u0370-\u03FF]+": "Μιλήστε μόνο αγγλικά σε αυτόν τον διακομιστή.", //Greek
		"[\u1F00-\u1FFF]+": "Μιλήστε μόνο αγγλικά σε αυτόν τον διακομιστή.", //Greek Extended
		"[\u05BE-\u05F4]+": "אנא דבר רק אנגלית בשרת זה.", //Hebrew
		"(?![ツ])[\u30A0-\u30FF]+": "このサーバーでは英語のみを話してください。", //Japanese
	}

	//Check if >= 80% of the message matches any of the regexes, if so respond in the correct language, use for loop to check all regexes
	for (const [regex, response] of Object.entries(langRegexandResponse)) {
		const re = new RegExp(regex, "gmiu")
		const matches = message.content.match(re)
		if (matches) {
			message.reply(`> ${response}`)
			return
		}
	}

})

client.on("guildMemberRemove", async (member: GuildMember) => {
	if (member.guild.id !== "924767148738486332") return;

	const row = new ActionRowBuilder<ButtonBuilder>()
		.addComponents(
			new ButtonBuilder()
				.setCustomId('creation-date')
				.setLabel(`Created ${moment(member.user.createdTimestamp).fromNow()}`)
				.setStyle(member.user.createdTimestamp > Date.now() - 1209600000 ? ButtonStyle.Danger : ButtonStyle.Success)
				.setDisabled(true),
			new ButtonBuilder()
				.setCustomId("join-date")
				.setLabel(`Joined ${moment(member.joinedTimestamp).fromNow()}`)
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(true),
			new ButtonBuilder()
				.setCustomId("username")
				.setLabel(`Username: ${member.user.tag}`)
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(true),
		);
	
	const channel = client.channels.cache.get("928809456601550908")
	channel.send({ content: `${member.id}`, components: [row] })
})

client.on('interactionCreate', async (interaction: Interaction) => {

	if (interaction.type === InteractionType.ModalSubmit) {

		if (interaction.customId.match(/mark-[0-9]{17,}/)) {
			let deletionTime = parseInt(interaction.fields.getTextInputValue("timeout"))
			deletionTime > 0 ? deletionTime = deletionTime * 60000 : deletionTime = 0
			if (deletionTime <= 0) return interaction.reply({ content: "Value must be greater than 0.", ephemeral: true })
			const delAt = Date.now() + deletionTime
			interaction.reply({ content: `Marked for deletion <t:${Math.round(delAt / 1000)}:R>, please wait.`, ephemeral: true })
			const id = interaction.customId.split("-")[1]
			setTimeout(function () {
				client.channels.fetch(interaction.channelId).then((channel: TextChannel) => {
					channel.messages.fetch(id).then((message) => {
						message.delete()
							.catch(err => {
								try {interaction.editReply({
									content: `Failed message delete:\n${err}`
								})
							} catch (err) {}
							})
					})
				})
			}, deletionTime)
		}
	}

	if (interaction.isChatInputCommand() || interaction.isMessageContextMenuCommand()) {
		const command = client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});



// Login to Discord with your client's token
client.login(process.env.TOKEN);

export default client

