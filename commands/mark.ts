import { SlashCommandBuilder, ChatInputCommandInteraction, ApplicationCommandOptionType, ContextMenuCommandBuilder, ApplicationCommandType, ContextMenuCommandInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ModalSubmitActionRowComponent, ActionRowBuilder, ModalActionRowComponentBuilder } from "discord.js";

module.exports = {
    data: new ContextMenuCommandBuilder()
    .setName("mark")
    .setType(ApplicationCommandType.Message),
    async execute(interaction: ContextMenuCommandInteraction) {
        const modal = new ModalBuilder()
        .setCustomId(`mark-${interaction.targetId}`)
        .setTitle("Message Deletion")
        
        const timeout = new TextInputBuilder()
        .setCustomId("timeout")
        .setLabel("In minutes, how long until this message should be deleted?")
        .setRequired(true)
        .setStyle(TextInputStyle.Short)

        const row = new ActionRowBuilder<ModalActionRowComponentBuilder>()
        .setComponents(timeout)

        modal.addComponents(row)

        await interaction.showModal(modal)
    }
}