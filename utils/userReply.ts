import { log } from "./logger"
const userReply = {
	missingArg: (missingArg: any, missingArgType: any) => {
		return `<:cancel:928427809179852873> \`${missingArg}\` is a required argument ${missingArgType ? `of type \`${missingArgType}\` ` : ""}that is missing.`
	},
	cmdError: (err: any) => {
		const id = log.error(err, "", true)
		return `<:error:957359133336666172> A \`${err.name}\` occured. \n \`\`\`js\n${err}\n\`\`\`\n\n Error ID: \`${id}\``
	},
	incorrectArgType: (incorrectArg: any, incorrectArgCorrectType: any) => {
		return `<:cancel:928427809179852873> Argument \`${incorrectArg}\` must be a valid \`${incorrectArgCorrectType}\`.`
	},
	unauthorizedPermit: (neededPermit: any, permit: any) => {
		return `<:cancel:928427809179852873> You are not authorized to execute that operation. Needed permit: ${neededPermit}, Your permit: ${permit}`
	},
	success: (message: any) => {
		return `<:check:928427755488571392> ${message}`
	}
}

export default userReply