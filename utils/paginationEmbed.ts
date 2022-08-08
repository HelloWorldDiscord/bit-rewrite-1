import Discord, {
    ActionRowBuilder,
    Message,
    EmbedBuilder,
    ButtonBuilder,
    Embed,
    ButtonStyle,
    ButtonComponent
  } from "discord.js"
  
  /**
   * Creates a pagination embed
   * @param {Interaction} interaction
   * @param {MessageEmbed[]} pages
   * @param {MessageButton[]} buttonList
   * @param {number} timeout
   * @param {number} defPage optional
   * @returns
   */
  const paginationEmbed = async (
    interaction: Discord.CommandInteraction,
    pages: Embed[],
    buttonList: ButtonBuilder[],
    timeout = 120000,
    defPage?: number
  ) => {
    let likeButton: ButtonBuilder
    let commentButton: ButtonBuilder
    if (!pages) throw new Error("Pages are not given.");
    if (!buttonList) throw new Error("Buttons are not given.");
    if (buttonList[0].data.style === ButtonStyle.Link || buttonList[1].data.style === ButtonStyle.Link)
      throw new Error(
        "Link buttons are not supported with this method."
      );
    if (buttonList.length !== 2) throw new Error("Need two buttons.");
  
    let page = 0
    if (defPage) page = defPage - 1

    const components: ActionRowBuilder<ButtonBuilder>[] = []
  
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttonList);
    components.push(row)
  
    if (interaction.deferred == false) {
      await interaction.deferReply();
    }
  
    const curPage = await interaction.editReply({
      embeds: [pages[page]],
      components: [row],
      // @ts-ignore
      fetchReply: true,
    });
  
    const filter = (i: any) =>
      i.customId === buttonList[0].customId ||
      i.customId === buttonList[1].customId;
  
      // @ts-ignore
    const collector = await curPage.createMessageComponentCollector({
      filter,
      time: timeout,
    });
    // .match(/previousbtn-[0-9]{17,}/) .match(/nextbtn-[0-9]{17,}/)
    collector.on("collect", async (i: any) => {
      switch (i.customId) {
        case buttonList[0].customId:
          if (!(buttonList[0].customId?.endsWith(`${i.user.id}`))) {
            try {
              return i.reply({ content: "You can't use this button.", ephemeral: true });
            } catch {
              return
            }
          }
          page = page > 0 ? --page : pages.length - 1;
          if (page === 2) {
            if (components.length > 1) components.pop()
            likeButton = new ButtonBuilder().setCustomId(`likeuser-${pages[0].fields[1].value}`).setStyle(ButtonStyle.Primary).setLabel("Like")
            const likeRow = new ActionRowBuilder<ButtonBuilder>().addComponents(likeButton)
            components.push(likeRow)
          } else if (page === 3) {
            if (components.length > 1) components.pop()
            commentButton = new ButtonBuilder().setCustomId(`commentuser-${pages[0].fields[1].value}`).setStyle(ButtonStyle.Primary).setLabel("Comment")
            const commentRow = new ActionRowBuilder<ButtonBuilder>().addComponents(commentButton)
            components.push(commentRow)
          } else {
            if (components.length > 1) {
              components.pop()
            }
          }
          break;
        case buttonList[1].customId:
          if (!(buttonList[1].customId?.endsWith(`${i.user.id}`))) {
            try {
              return i.reply({ content: "You can't use this button.", ephemeral: true });
            } catch {
              return
            }
          }
          page = page + 1 < pages.length ? ++page : 0;
          if (page === 2) {
            if (components.length > 1) components.pop()
            likeButton = new ButtonBuilder().setCustomId(`likeuser-${pages[0].fields[1].value}`).setStyle(ButtonStyle.Primary).setLabel("Like")
            const likeRow = new ActionRowBuilder<ButtonBuilder>().addComponents(likeButton)
            components.push(likeRow)
          } else if (page === 3) {
            if (components.length > 1) components.pop()
            commentButton = new ButtonBuilder().setCustomId(`commentuser-${pages[0].fields[1].value}`).setStyle(ButtonStyle.Primary).setLabel("Comment")
            const commentRow = new ActionRowBuilder<ButtonBuilder>().addComponents(commentButton)
            components.push(commentRow)
          } else {
            if (components.length > 1) {
              components.pop()
            }
          }
          break;
        default:
          break;
      }
      await i.deferUpdate();
      await i.editReply({
        embeds: [pages[page]],
        components: components,
      });
      collector.resetTimer();
    });
  
    collector.on("end", (_: any, reason: any) => {
      if (reason !== "messageDelete") {
        const disabledRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
          buttonList[0].setDisabled(true),
          buttonList[1].setDisabled(true)
        );
        // @ts-ignore
        curPage.edit({
          embeds: [pages[page]],
          components: [disabledRow],
        });
      }
    });
  
    return curPage;
  };
  export default paginationEmbed
  