import Discord, { ButtonBuilder, ButtonStyle, ColorResolvable, EmbedBuilder, GuildMember, Interaction, Snowflake, User } from "discord.js";
import mongoose from "mongoose"
import ProfileSchema from "../schemas/ProfileSchema";
const badges = require("../assets/badges.json")
import paginationEmbed from "./paginationEmbed"

const generateProfile = async (userId: string, interaction: any, modifier?: number, iUserOverride?: Snowflake) => {
    //? modifier will prevent profile views from being incremented due to recrusive calls
    try {
        let modPageStart = 0
        const user = await ProfileSchema.findOne({ userId: userId })
        if (!user) {
            return interaction.reply({ embeds: [new EmbedBuilder().setTitle("No Profile Found").setColor(0xFF0000).setDescription("Oops! We could not retrieve your profile.\n\nPlease ensure you have set up a profile on your current account. If you are still encountering issues, contact a member of Root.")] })
        }

        let embedColor;
        let userBadges = (user.badges as string[]);
        if (user.ownerElement === true) {
            embedColor = "#5856d6"
        } else if (user.staffElement === true) {
            if (user.staffPosition === "mod") {
                embedColor = "#ffcc00"
            } else if (user.staffPosition === "smod") {
                embedColor = "#ff3b30"
            } else {
                embedColor = "#ffffff"
            }
        } else if (userBadges.includes("proficient")) {
            embedColor = "#af52de"
        } else if (userBadges.includes("active")) {
            embedColor = "#e91e63"
        } else if (userBadges.includes("regular")) {
            embedColor = "#2ecc71"
        } else if (userBadges.includes("earlymember")) {
            embedColor = "#dc4e76"
        } else if (userBadges.includes("trusted")) {
            embedColor = "#7289da"
        } else if (userBadges.includes("booster")) {
            embedColor = "#f47fff"
        } else if (userBadges.includes("eventwinner")) {
            embedColor = "#90dad4"
        } else {
            embedColor = "#3498db"
        }

        const pg1 = new EmbedBuilder()
            .setTitle(`${user.displayName}`)
            .setThumbnail(`${user.displayPicture}`)
            .setDescription(`${user.bio}`)
            .addFields([
                {
                    name: "Joined at",
                    value: `<t:${user.joinDate}>`
                },
                {
                    name: "User ID",
                    value: `${user.userId as string}`
                }
            ])
            .setColor(embedColor as any)
        if (userBadges.length !== 0) {
            let badgeEmojis = []
            if (user.ownerElement === true) badgeEmojis.unshift(`${badges['root']}`)
            if (user.staffElement === true) badgeEmojis.unshift(`${badges['staff']}`)
            if (user.staffPosition === "smod") badgeEmojis.unshift(`${badges['smod']}`)
            if (user.staffPosition === "mod") badgeEmojis.unshift(`${badges['mod']}`)
            let specialbadgesarray = ['root', 'staff', 'mod', 'smod']
            for (let i = 0; i < userBadges.length; i++) {
                let targetBadge = userBadges[i]
                if (specialbadgesarray.includes(`${targetBadge}`)) continue
                badgeEmojis.push(`${badges[targetBadge]}`)
            }

            pg1.addFields([{
                name: "Badges", value: `${badgeEmojis.join(" ")}`
            } 
        ])
        }
        let badgearray = []
        const pg2 = new EmbedBuilder()
            .setTitle(`${user.displayName}'s Badges`)
        if (user.staffElement === true) {
            badgearray.push(`${badges['staff']} This user is a member of **Hello World! Staff.**`)
            if (user.staffPosition === "mod") {
                badgearray.push(`${badges['mod']} This user is currently a **server moderator.**`)
            } else if (user.staffPosition === "smod") {
                badgearray.push(`${badges['smod']} This user is currently a **senior server moderator.**`)
            }
        }
        if (user.ownerElement === true) {
            badgearray.push(`${badges['root']}This user is currently a **server owner.**`)
        }
        for (let i = 0; i < userBadges.length; i++) {
            let badgeDesc;
            switch (`${userBadges[i]}`) {
                case "proficient":
                    badgeDesc = `${badges['proficient']} This user has exemplified proficiency in the community and their career with at least one language.`
                    badgearray.push(badgeDesc)
                    break;
                case "active":
                    badgeDesc = `${badges['active']} This user has attained level 50 in the server.`
                    badgearray.push(badgeDesc)
                    break;
                case "regular":
                    badgeDesc = `${badges['regular']} This user has attained level 25 in the server.`
                    badgearray.push(badgeDesc)
                    break;
                case "earlymember":
                    badgeDesc = `${badges['earlymember']} This user was part of a limited group of users who joined in the server's Alpha phase.`
                    badgearray.push(badgeDesc)
                    break;
                case "trusted":
                    badgeDesc = `${badges['trusted']} This user is a trusted user, as deemed by server ownership.`
                    badgearray.push(badgeDesc)
                    break;
                case "booster":
                    badgeDesc = `${badges['booster']} This user is currently boosting the server. Thank you!`
                    badgearray.push(badgeDesc)
                    break;
                case "eventwinner":
                    badgeDesc = `${badges['eventwinner']} This user has won an event hosted by Hello World! or any other affiliate servers.`
                    badgearray.push(badgeDesc)
                    break;
                case "bughunter":
                    badgeDesc = `${badges['bughunter']} This user has been a part of the bug hunt during Bit/Bit Canary Alpha/Beta stages.`
                    badgearray.push(badgeDesc)
                    break;
                case "devteam":
                    badgeDesc = `${badges['devteam']} This user is a part of the development team for Bit or Bit Canary.`
                    badgearray.push(badgeDesc)
                    break;
                default:
                    badgeDesc = "This badge description has currently not been set by the developers."
                    badgearray.push(badgeDesc)
            }
        }
        if (badgearray.length > 0) {
            let badgetxt = "badges"
            if (badgearray.length === 1) badgetxt = "badge"
            pg2.setDescription(`This user currently has **${badgearray.length}** ${badgetxt}:\n\n${badgearray.join("\n")}`)
        } else {
            pg2.setDescription("This user has no badges.")
        }
        pg2.setColor(embedColor as any)

        const pg3 = new EmbedBuilder()
            .setTitle("User Statistics")
            .addFields([
                {
                    name: "User Profile Likes:",
                    value: `${user.userStats?.likes}`,
                    inline: true
                },
                {
                    name: "User Comments:",
                    value: `${(user.userStats?.comments as string[])?.length}`,
                    inline: true
                },
                {
                    name: "User Badges",
                    value: `${userBadges.length}`
                }
            ])
            //.addField("User Profile Likes:", `${user.userStats.likes}`, true)
            //.addField("User Comments:", `${user.userStats.comments.length}`, true)
            //.addField("User Badges", `${userBadges.length}`)
            .setColor(embedColor as any);

        let top5comments = []
        let commentsLength = (user.userStats?.comments as string[])?.length
        if (commentsLength > 5) {
            commentsLength = 5
        }
        for (let i = 0; i < commentsLength; i++) {
            top5comments.push(`${(user.userStats?.comments as string[])[i]}`)
        }
        const pg4 = new EmbedBuilder()
            .setTitle("User Comments")
            .setDescription(`${top5comments.join("\n")}`)
            .setColor(embedColor as any)
        let pages = [
            pg1,
            pg2,
            pg3,
            pg4
        ]
        let interactionUser = interaction.user.id ?? iUserOverride
        let buttonList = [
            new ButtonBuilder().setCustomId(`previousbtn-${interactionUser}`).setLabel("Back").setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId(`nextbtn-${interactionUser}`).setLabel("Next").setStyle(ButtonStyle.Primary)
        ]

        if (modifier) {
            if (modifier === 1) {
                modPageStart = 4
            }
        }
        paginationEmbed(interaction, pages, buttonList, 360000, modPageStart)
    } catch (err) {
        console.log(err)
    }
}

export default generateProfile