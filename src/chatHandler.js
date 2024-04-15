import ComfyJS from "comfy.js";
import { renderTaskListToDOM } from "./app.js";

const adminConfig = configs;
const userConfig = configs.user;
const { languageCode: langCode, maxTasksPerUser } = configs.settings;
const { twitch_channel, twitch_oauth, twitch_username } = configs.auth;

export function mountChatHandler() {
	ComfyJS.Init(twitch_username, twitch_oauth, [twitch_channel]);

	ComfyJS.onCommand = (username, command, message, flags, extra) => {
		command = `!${command.toLowerCase()}`;

		try {
			// ADMIN COMMANDS
			if (isMod(flags)) {
				if (adminConfig.commands.adminClearList.includes(command)) {
					userList.clearUserList();
					respond(
						adminConfig.responseTo[langCode].adminClearList,
						username
					);
					return renderTaskListToDOM();
				}
				if (
					adminConfig.commands.adminClearDoneTasks.includes(command)
				) {
					userList.clearDoneTasks();
					respond(
						adminConfig.responseTo[langCode].adminClearDoneTasks,
						username
					);
					return renderTaskListToDOM();
				}
				if (adminConfig.commands.adminClearUser.includes(command)) {
					userList.deleteUser(message);
					respond(
						adminConfig.responseTo[langCode].adminClearUser,
						username,
						message
					);
					return renderTaskListToDOM();
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
						nameColor: extra.color,
					});
				}
				const tasks = message.split(", ");
				if (user.getTasks.length + tasks.length > maxTasksPerUser) {
					respond(
						userConfig.responseTo[langCode].maxTasksAdded,
						username
					);
				} else {
					userList.addUserTasks(username, tasks);
					respond(
						userConfig.responseTo[langCode].addTask,
						username,
						message
					);
				}
			} else if (userConfig.commands.editTask.includes(command)) {
				// EDIT TASK
				const whiteSpaceIndex = message.search(/(?<=\d)\s/);
				const taskDescription = message.slice(whiteSpaceIndex + 1);
				const taskNumber = parseTaskIndex(
					message.slice(0, whiteSpaceIndex)
				);
				userList.editUserTask(username, taskNumber, taskDescription);
				respond(
					userConfig.responseTo[langCode].editTask,
					username,
					taskDescription
				);
			} else if (userConfig.commands.finishTask.includes(command)) {
				// COMPLETE TASK
				const index = parseTaskIndex(message);
				const taskComp = userList.completeUserTasks(username, index);
				respond(
					userConfig.responseTo[langCode].finishTask,
					username,
					taskComp
				);
			} else if (userConfig.commands.deleteTask.includes(command)) {
				// DELETE TASK
				const index = parseTaskIndex(message);
				const taskDel = userList.deleteUserTasks(username, index);
				respond(
					userConfig.responseTo[langCode].deleteTask,
					username,
					taskDel
				);
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
			console.error(
				error.message,
				`\ndata: username: ${username} - command: ${command} - message: ${message}`
			);
		}
	};
}

function respond(template, username = "", message = "") {
	ComfyJS.Say(
		template.replace("{user}", username).replace("{message}", message)
	);
}

function isMod(flags) {
	return flags.broadcaster || flags.mod;
}

function parseTaskIndex(index) {
	return parseInt(index, 10) - 1;
}
