const adminConfig = configs.admin;
const userConfig = configs.user;
const langCode = configs.settings.languageCode;
const maxTasksPerUser = configs.settings.maxTasksPerUser;
const twitchUserName = auth.username;
const twitchChannel = auth.channel;
const oauth_token = auth.oauth.includes("oauth:")
	? auth.oauth
	: `oauth:${auth.oauth}`;

ComfyJS.Init(twitchUserName, oauth_token, twitchChannel);

ComfyJS.onCommand = (username, command, message, flags, extra) => {
	command = `!${command.toLowerCase()}`;

	try {
		// ADMIN COMMANDS
		if (isMod(flags)) {
			if (adminConfig.commands.adminClearUserList.includes(command)) {
				userList.clearUserList();
				respond(
					adminConfig.responseTo[langCode].adminClearUserList,
					username,
					message
				);
				return renderTaskListToDOM();
			}
			if (adminConfig.commands.adminClearDoneTasks.includes(command)) {
				userList.clearDoneTasks();
				respond(
					adminConfig.responseTo[langCode].adminClearDoneTasks,
					username,
					message
				);
				return renderTaskListToDOM();
			}
		}

		// USER COMMANDS
		if (userConfig.commands.addTask.includes(command)) {
			// ADD TASK
			if (userList.getUser(username)?.tasks.length >= maxTasksPerUser) {
				respond(userConfig.responseTo[langCode].maxTasksAdded, username);
			} else {
				const tasks = message.split(", ");
				userList.addUserTask(username, tasks);
				respond(userConfig.responseTo[langCode].addTask, username, message);
			}
		} else if (userConfig.commands.editTask.includes(command)) {
			// EDIT TASK
			const regex = /(?<=\d)\s/;
			const whiteSpaceIndex = message.search(regex);
			const taskDescription = message.slice(whiteSpaceIndex + 1);
			const taskNumber = parseIndex(message.slice(0, whiteSpaceIndex));
			userList.editUserTask(username, taskNumber, taskDescription);
			respond(
				userConfig.responseTo[langCode].editTask,
				username,
				taskDescription
			);
		} else if (userConfig.commands.finishTask.includes(command)) {
			// COMPLETE TASK
			const index = parseIndex(message);
			const taskComp = userList.completeUserTask(username, index);
			respond(userConfig.responseTo[langCode].finishTask, username, taskComp);
		} else if (userConfig.commands.deleteTask.includes(command)) {
			// DELETE TASK
			const index = parseIndex(message);
			const taskDel = userList.deleteUserTask(username, index);
			respond(userConfig.responseTo[langCode].deleteTask, username, taskDel);
		} else if (userConfig.commands.check.includes(command)) {
			// CHECK TASKS
			const tasks = userList.checkUserTasks(username).join(", ");
			respond(userConfig.responseTo[langCode].check, username, tasks);
		} else if (userConfig.commands.help.includes(command)) {
			// HELP COMMAND
			respond(userConfig.responseTo[langCode].help);
		} else if (userConfig.commands.additional.includes(command)) {
			// ADDITIONAL COMMANDS
			respond(userConfig.responseTo[langCode].additional);
		} else {
			throw new Error("Invalid command");
		}
		return renderTaskListToDOM();
	} catch (error) {
		console.error(error, username, message);
		respond(userConfig.responseTo[langCode].invalidCommand, username);
	}
};

function respond(template, username = "", message = "") {
	ComfyJS.Say(
		template.replace("{user}", username).replace("{message}", message)
	);
}

function isMod(flags) {
	return flags.broadcaster || flags.mod;
}

function parseIndex(index) {
	return parseInt(index, 10) - 1;
}
