import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import userReply from "../utils/userReply";

module.exports = {
    data: new SlashCommandBuilder()
    .setName("modname")
    .setDescription("Moderates a user nickname.")
    .addStringOption(option =>
        option.setName("target")
        .setDescription("ID of the user who's nickname you want to moderate.")
        .setRequired(true)
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        const member = await interaction.guild?.members.fetch(interaction.options.getString("target") as string)

		if (!member) {
			interaction.reply({
                content: userReply.missingArg("member", "Discord GuildMember")
            })
			return;
		}

		const randomName = (Math.random() + 1).toString(36).substring(7);
		await member.setNickname(`Moderated Nickname ${randomName}`).catch((err) => {
			interaction.reply({
                content: userReply.cmdError(err)
            })
			return;
		})

		interaction.reply(userReply.success(`Nickname changed to \`Moderated Nickname ${randomName}\``))

    }
}