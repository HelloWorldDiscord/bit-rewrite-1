import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
//@ts-ignore
import followRedirect from "follow-redirect-url"

module.exports = {
    data: new SlashCommandBuilder()
    .setName("follow-url")
    .setDescription("Follows a URL for redirects.")
    .addStringOption(option =>
        option.setName("url")
        .setDescription("The URL to follow.")
        .setRequired(true)
        ),
    async execute(interaction: ChatInputCommandInteraction) {

		followRedirect.startFollowing(interaction.options.getString("url")).then((urls: any) => {
			let a = "**Redirects**\n"
			for (let url of urls) {
				a += `${url.status} | <${url.url}>\n`
			}
			interaction.reply({ content: `${a}` })
		}).catch((err: any) => {
			console.log(err)
		})
    }
}