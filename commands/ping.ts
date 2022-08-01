import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, Message, EmbedBuilder } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Pings the websocket."),

  async execute(interaction: CommandInteraction, client: Client) {
    const message = (await interaction.reply({
      content: "Ping?",
      fetchReply: true,
    })) as unknown as Message;
    const hostLatency = message.createdTimestamp - interaction.createdTimestamp;
    const apiLatency = Math.round(client.ws.ping);
    const pingEmbed = new EmbedBuilder()
      .setTitle("Pong!")
      .setDescription(
        `Round trip took ${(
          hostLatency + apiLatency
        ).toLocaleString()}ms.\nHost latency is ${hostLatency.toLocaleString()}ms and API latency is ${apiLatency.toLocaleString()}ms.`
      )
      .setColor("Blurple");
    return interaction.editReply({
      embeds: [pingEmbed],
    });
  },
};
