import Discord, { GuildMember } from "discord.js"
async function verifyDev(member: GuildMember) {
	const devID1 = process.env.DEV_ID
	const devPFP1 = process.env.DEV_PFP
	const devID2 = process.env.DEV_ID
	const devPFP2 = process.env.DEV_PFP

	await member.fetch()
	try {
		if (member.id == devID1 && member.user.avatar == devPFP1 || member.id == devID2 && member.user.avatar == devPFP2) {
			return true
		} else {
			return false
		}
	} catch (err) {
		return err
	}
}

const formatTimestamp = {
	date: (timestamp: number) => {
		return `<t:${Math.round(timestamp / 1000)}>`
	},
	dateAndRelative: (timestamp: number) => {
		return `<t:${Math.round(timestamp / 1000)}> (<t:${Math.round(timestamp / 1000)}:R>)`
	},
	relative: (timestamp: number) => {
		return `<t:${Math.round(timestamp / 1000)}:R>`
	}
}

export default verifyDev
export { formatTimestamp }