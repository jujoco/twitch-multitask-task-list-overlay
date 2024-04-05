(() => {
	"use strict";
	const adminConfig = configs.admin;
	const userConfig = configs.user;
	const { languageCode: langCode, maxTasksPerUser } = configs.settings;

	/**
	 * @typedef {import('./bundle')}
	 * @type UserList
	 */
	const userList = window.userList;

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

	ComfyJS.onCommand = (username, command, message, flags, extra) => {
		command = `!${command.toLowerCase()}`;

		try {
			// ADMIN COMMANDS
			if (isMod(flags)) {
				if (adminConfig.list.adminClearAllTasksCommands.includes(command)) {
					userList.clearAllTasks();
					userList.commitChanges();
					respond(
						adminConfig.responseTo[langCode].adminClearAllTasksCommands,
						username,
						message
					);
					return renderTaskBot();
				}
				if (adminConfig.list.adminClearDoneTasksCommands.includes(command)) {
					userList.clearDoneTasks();
					userList.commitChanges();
					respond(
						adminConfig.responseTo[langCode].adminClearDoneTasksCommands,
						username,
						message
					);
					return renderTaskBot();
				}
				if (adminConfig.list.adminClearUserCommands.includes(command)) {
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
			if (userConfig.list.addTaskCommands.includes(command)) {
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
			if (userConfig.list.finishTaskCommands.includes(command)) {
				// COMPLETE TASK
				const index = parseInt(message, 10) - 1;
				userList.completeUserTask(username, index);
				userList.commitChanges();
				return renderTaskBot();
			}
			if (userConfig.list.deleteTaskCommands.includes(command)) {
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
			if (userConfig.list.checkCommands.includes(command)) {
				// CHECK TASKS
				respond(
					userConfig.responseTo[langCode].checkCommands,
					username,
					message
				);
				return renderTaskBot();
			}
			if (userConfig.list.helpCommands.includes(command)) {
				// HELP COMMAND
				respond(
					userConfig.responseTo[langCode].helpCommands,
					username,
					message
				);
				return renderTaskBot();
			}
			if (userConfig.list.additionalCommands[command]) {
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

	const channel = auth.channel;
	const oauth_token = auth.oauth.includes("oauth:")
		? auth.oauth
		: `oauth:${auth.oauth}`;

	ComfyJS.Init(channel, oauth_token);
})();
