import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, Message, EmbedBuilder } from "discord.js";
import client from "../index"

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Pings the websocket."),

  async execute(interaction: CommandInteraction) {
    console.log("Runs")
    const msg = await interaction.reply({
      content: "Ping?",
      fetchReply: true,
    })
    const hostLatency = msg.createdTimestamp - interaction.createdTimestamp;
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
