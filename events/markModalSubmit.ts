import { CommandInteraction, Interaction, InteractionType, TextChannel } from "discord.js";
import client from "../index";
import ms from "ms"

client.on("interactionCreate", async (interaction: Interaction) => {
    if (interaction.type !== InteractionType.ModalSubmit) return

    if (interaction.customId.match(/mark-[0-9]{17,}/)) {
        interaction.reply({ content: "Marked for deletion, please wait." })
        const id = interaction.customId.split("-")[1]
        setTimeout(() => {
            client.channels.fetch(interaction.channelId).then((channel: TextChannel) => {
                channel.messages.fetch(id).then((message) => {
                    message.delete()
                        .catch(err => {
                            interaction.reply({
                                content: `Failed message delete:\n${err}`
                            })
                        })
                })
            })
        }, parseInt(interaction.fields.getTextInputValue("timeout")) * 60000)
    }
})
