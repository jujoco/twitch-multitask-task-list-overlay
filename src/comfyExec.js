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
			if (adminConfig.commands.adminClearAllTasksCommands.includes(command)) {
				userList.clearAllTasks();
				userList.commitChanges();
				respond(
					adminConfig.responseTo[langCode].adminClearAllTasksCommands,
					username,
					message
				);
				return renderTaskBot();
			}
			if (adminConfig.commands.adminClearDoneTasksCommands.includes(command)) {
				userList.clearDoneTasks();
				userList.commitChanges();
				respond(
					adminConfig.responseTo[langCode].adminClearDoneTasksCommands,
					username,
					message
				);
				return renderTaskBot();
			}
			if (adminConfig.commands.adminClearUserCommands.includes(command)) {
				userList.clearUserTasks(username);
				userList.commitChanges();
				respond(
					adminConfig.responseTo[langCode].adminClearUserCommands,
					username,
					message
				);
				return renderTaskBot();
			}
		}

		// USER COMMANDS
		if (userConfig.commands.addTaskCommands.includes(command)) {
			// ADD TASK
			if (userList.getUser(username).tasks.length >= maxTasksPerUser) {
				respond(userConfig.responseTo[langCode].maxTasksReached, username);
			}
			const tasks = message.split(", ");
			userList.addUserTasks(username, tasks);
			userList.commitChanges();
			respond(
				userConfig.responseTo[langCode].addTaskCommands,
				username,
				message
			);
			return renderTaskBot();
		}
		if (userConfig.commands.finishTaskCommands.includes(command)) {
			// COMPLETE TASK
			const index = parseInt(message, 10) - 1;
			userList.completeUserTask(username, index);
			userList.commitChanges();
			return renderTaskBot();
		}
		if (userConfig.commands.deleteTaskCommands.includes(command)) {
			// DELETE TASK
			userList.deleteUserTask(username, message);
			userList.commitChanges();
			respond(
				userConfig.responseTo[langCode].deleteTaskCommands,
				username,
				message
			);
			return renderTaskBot();
		}
		if (userConfig.commands.checkCommands.includes(command)) {
			// CHECK TASKS
			respond(userConfig.responseTo[langCode].checkCommands, username, message);
			return renderTaskBot();
		}
		if (userConfig.commands.helpCommands.includes(command)) {
			// HELP COMMAND
			respond(userConfig.responseTo[langCode].helpCommands, username, message);
			return renderTaskBot();
		}
		if (userConfig.commands.additionalCommands[command]) {
			// ADDITIONAL COMMANDS
			respond(
				userConfig.responseTo[langCode].additionalCommands,
				username,
				message
			);
			return renderTaskBot();
		}
	} catch (error) {
		console.log(error, username, message);
		respond(error.message, user, message);
	}
};

function respond(
	template = "{user} - {taskDescription}",
	username = "",
	message = ""
) {
	ComfyJS.Say(
		template.replace("{user}", username).replace("{taskDescription}", message)
	);
}

function isMod(flags) {
	return flags.broadcaster || flags.mod;
}
