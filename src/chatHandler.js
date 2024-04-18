/** @typedef {import('../src/classes/UserList').default} UserList */
/**
 * Handles chat commands and responses
 * @param {string} username
 * @param {string} command
 * @param {string} message
 * @param {Object} flags
 * @param {{userColor: string}} extra
 * @returns {string} - Response message
 */
export function chatHandler(username, command, message, flags, extra) {
	command = `!${command.toLowerCase()}`;
	const {
		admin: adminConfig,
		user: userConfig,
		settings: { languageCode, maxTasksPerUser },
	} = window.configs;

	/** @type UserList */
	const userList = window.userList;

	let template = "";
	let responseDetail = "";

	try {
		// ADMIN COMMANDS
		if (isMod(flags)) {
			if (adminConfig.commands.clearList.includes(command)) {
				userList.clearUserList();
				template = adminConfig.responseTo[languageCode].clearList;
				return respondMessage(template, username, responseDetail);
			}
			if (adminConfig.commands.clearDone.includes(command)) {
				userList.clearDoneTasks();
				template = adminConfig.responseTo[languageCode].clearDone;
				return respondMessage(template, username, responseDetail);
			}
			if (adminConfig.commands.clearUser.includes(command)) {
				userList.deleteUser(message);
				responseDetail = message;
				template = adminConfig.responseTo[languageCode].clearUser;
				return respondMessage(template, username, responseDetail);
			}
		}

		// USER COMMANDS
		if (userConfig.commands.addTask.includes(command)) {
			// ADD TASK
			if (message === "") {
				throw new Error("Task description is empty");
			}
			let user = userList.getUser(username);
			if (!user) {
				user = userList.createUser(username, {
					userColor: extra.userColor,
				});
			}
			const tasks = message.split(", ");
			if (user.getTasks().length + tasks.length > maxTasksPerUser) {
				template = userConfig.responseTo[languageCode].maxTasksAdded;
			} else {
				responseDetail = userList
					.addUserTasks(username, tasks)
					.join(", ");
				template = userConfig.responseTo[languageCode].addTask;
			}
		} else if (userConfig.commands.editTask.includes(command)) {
			// EDIT TASK
			const whiteSpaceIndex = message.search(/(?<=\d)\s/);
			if (whiteSpaceIndex === -1) {
				throw new Error("Task number or description format is invalid");
			}
			const taskDescription = message.slice(whiteSpaceIndex + 1);
			const taskNumber = message.slice(0, whiteSpaceIndex);

			userList.editUserTask(
				username,
				parseTaskIndex(taskNumber),
				taskDescription
			);
			responseDetail = taskNumber;
			template = userConfig.responseTo[languageCode].editTask;
		} else if (userConfig.commands.finishTask.includes(command)) {
			// COMPLETE TASK
			const index = parseTaskIndex(message);
			responseDetail = userList.completeUserTasks(username, index);
			template = userConfig.responseTo[languageCode].finishTask;
		} else if (userConfig.commands.deleteTask.includes(command)) {
			// DELETE TASK
			const index = parseTaskIndex(message);
			responseDetail = userList.deleteUserTasks(username, index);
			template = userConfig.responseTo[languageCode].deleteTask;
		} else if (userConfig.commands.check.includes(command)) {
			// CHECK TASKS
			responseDetail = userList.checkUserTasks(username).join(", ");
			if (responseDetail === "") {
				template = userConfig.responseTo[languageCode].noTaskFound;
			} else {
				template = userConfig.responseTo[languageCode].check;
			}
		} else if (userConfig.commands.help.includes(command)) {
			// HELP COMMAND
			template = userConfig.responseTo[languageCode].help;
		} else if (userConfig.commands.additional.includes(command)) {
			// ADDITIONAL COMMANDS
			template = userConfig.responseTo[languageCode].additional;
		} else {
			// INVALID COMMAND
			throw new Error("command not found");
		}

		return respondMessage(template, username, responseDetail);
	} catch (error) {
		return respondMessage(
			userConfig.responseTo[languageCode].invalidCommand,
			username,
			error.message
		);
	}
}

function respondMessage(template, username, message) {
	return template.replace("{user}", username).replace("{message}", message);
}

function isMod(flags) {
	return flags.broadcaster || flags.mod;
}

function parseTaskIndex(index) {
	return parseInt(index, 10) - 1;
}
