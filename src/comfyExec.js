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
			if (userList.getUser(username).tasks.length >= maxTasksPerUser) {
				respond(userConfig.responseTo[langCode].maxTasksReached, username);
			}
			const tasks = message.split(", ");
			userList.addUserTask(username, tasks);
			respond(userConfig.responseTo[langCode].addTask, username, message);
			return renderTaskBot();
		}
		if (userConfig.commands.editTask.includes(command)) {
			// EDIT TASK
			const [strIndex, newTask] = message.split(", ");
			const index = parseIndex(strIndex);
			userList.editUserTask(username, index, newTask);
			respond(userConfig.responseTo[langCode].editTask, username, newTask);
			return renderTaskBot();
		}
		if (userConfig.commands.finishTask.includes(command)) {
			// COMPLETE TASK
			const index = parseIndex(message);
			const taskComp = userList.completeUserTask(username, index);
			respond(userConfig.responseTo[langCode].finishTask, username, taskComp);
			return renderTaskBot();
		}
		if (userConfig.commands.deleteTask.includes(command)) {
			// DELETE TASK
			const index = parseIndex(message);
			const taskDel = userList.deleteUserTask(username, index);
			respond(userConfig.responseTo[langCode].deleteTask, username, taskDel);
			return renderTaskBot();
		}
		if (userConfig.commands.check.includes(command)) {
			// CHECK TASKS
			const tasks = userList.checkUserTasks(username).join(", ");
			respond(userConfig.responseTo[langCode].check, username, tasks);
			return renderTaskBot();
		}
		if (userConfig.commands.help.includes(command)) {
			// HELP COMMAND
			respond(userConfig.responseTo[langCode].help);
			return renderTaskBot();
		}
		if (userConfig.commands.additional[command]) {
			// ADDITIONAL COMMANDS
			respond(userConfig.responseTo[langCode].additional);
			return renderTaskBot();
		}
	} catch (error) {
		console.log(error, username, message);
		respond(error.message, user, message);
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
