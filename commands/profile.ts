import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import 

module.exports = {
    data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Profile system commands.")
    ,
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            if (interaction.options.getSubcommand() === "me") { //? display user profile
                generateProfile(interaction.user.id, interaction)
            }
            if (interaction.options.getSubcommand() === "help") { //? display docs for profile command
                const embed = new Discord.MessageEmbed()
                    .setTitle("Profile Command")
                    .addField("No Args (  )", "Displays your profile if it exists.")
                    .addField("Help (help)", "Displays this message.")
                    .addField("Search Users (search [name or id])", "Displays a user's profile if it exists.")
                    .addField("Setup Profile (setup)", "Sets up your profile.")
                    .addField("Set Profile Picture (setpfp)", "Sets your profile picture.")
                    .addField("Set Bio (setbio)", "Sets your bio.")
                    .setColor("#5856d6")
                interaction.reply({ embeds: [embed] })
            }

            if (interaction.options.getSubcommand() === "search") { //? search users in server
                const arg0 = interaction.options.getString("query")
                if (!arg0) return
                if (arg0.match(/[0-9]{17,19}/)) {
                    const user = await ProfileSchema.findOne({ userId: arg0 })
                    if (!user) return interaction.reply({ content: "User not found." })
                    generateProfile(arg0, interaction)
                } else {
                    const user = await ProfileSchema.find({ displayName: { $regex: `${arg0}`, $options: "i" } }).exec(function (err, results) {
                        if (err) return interaction.reply({ content: "An error occured." })
                        if (results.length === 0 || !results) return interaction.reply({ content: "User not found." })
                        if (results.length > 1) {
                            const embed = new Discord.MessageEmbed()
                                .setTitle("Multiple Users Found")
                            let resultsarray = []
                            for (const doc of results) {
                                resultsarray.push(doc.displayName)
                            }
                            embed.setDescription(`${resultsarray.join("\n")}\n\nPlease use the dropdown list to select a user, or use the search command again with a more specific query.`)
                            const embedList = new Discord.MessageSelectMenu()
                                .setCustomId(`profile-search-${interaction.user.id}`)
                                .setPlaceholder("Select a user")
                                .setOptions([]);

                            for (let i = 0; i < resultsarray.length; i++) {
                                embedList.options.push({
                                    label: `${resultsarray[i]}`,
                                    value: `${resultsarray[i]}`,
                                })
                            }
                            const row = new Discord.MessageActionRow()
                                .addComponents(embedList)
                            interaction.reply({ embeds: [embed], components: [row] })
                        } else {
                            generateProfile(results[0].userId, interaction)
                        }
                    })
                }
            }

            if (interaction.options.getSubcommand() === "setup") { //? setup user profile
                const user = await ProfileSchema.findOne({ userId: interaction.user.id })
                if (user) return interaction.reply({ content: "You already have a profile." })
                let joinDate = (interaction.member as GuildMember).joinedTimestamp
                if (joinDate != null) {
                    joinDate /= 1000
                    joinDate = Math.round(joinDate)
                }
                await ProfileSchema.findOneAndUpdate({
                    userId: interaction.user.id,
                }, {
                    joinDate,
                    displayPicture: interaction.user.avatarURL(),
                    displayName: (interaction.member as GuildMember).displayName,
                    userStats: {
                        hits: 0,
                        likes: 0,
                        comments: []
                    }
                }, {
                    upsert: true
                })
                interaction.reply({ content: "Profile setup complete." })
            }

            if (interaction.options.getSubcommand() === "setpfp") { //? set user profile picture
                const user = await ProfileSchema.findOne({ userId: interaction.user.id })
                if (!user) return interaction.reply({ content: "You don't have a profile." })
                if (!(interaction.options.getString("url")?.match(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/))) {
                    return interaction.reply({ content: "Invalid URL." })
                }
                await ProfileSchema.findOneAndUpdate({
                    userId: interaction.user.id,
                }, {
                    displayPicture: interaction.options.getString("url"),
                }, {
                    upsert: false
                })
                interaction.reply({ content: "Profile picture updated." })
            }

            if (interaction.options.getSubcommand() === "setbio") { //? set user bio
                const bio = interaction.options.getString("bio")
                const user = await ProfileSchema.findOne({ userId: interaction.user.id })
                if (!user) return interaction.reply({ content: "You don't have a profile." })
                const popupModal = new Modal()
                    .setCustomId(`profile-bio-modal`)
                    .setTitle("Set Profile Bio")
                    .addComponents(
                        new TextInputComponent()
                            .setLabel("Bio")
                            .setStyle("LONG")
                            .setPlaceholder("Bio text here...")
                            .setCustomId("bio-change")
                            .setRequired(true),
                    )
                showModal(popupModal, {
                    client: client,
                    interaction: interaction,
                })
            } else if (interaction.options.getSubcommand() === "sync") {
                const embed = new Discord.MessageEmbed()
                    .setTitle("Profile Sync")
                    .setDescription("Use the buttons to sync Discord profile information with our profile database.")
                const row = new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageButton()
                            .setStyle("PRIMARY")
                            .setLabel("Username")
                            .setCustomId(`sync-username-${interaction.user.id}`),
                        new Discord.MessageButton()
                            .setStyle("PRIMARY")
                            .setLabel("Nickname")
                            .setCustomId(`sync-displayname-${interaction.user.id}`),
                        new Discord.MessageButton()
                            .setStyle("PRIMARY")
                            .setLabel("PFP")
                            .setCustomId(`sync-pfp-${interaction.user.id}`),
                    )
                interaction.reply({ embeds: [embed], components: [row] })
            }
        } catch (error) {
            interaction.reply({ content: `Oops, something went wrong:\n\n${error}` })
        }
    }
}