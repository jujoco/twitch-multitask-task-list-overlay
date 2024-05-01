import { animateScroll } from "./animations/animateScroll.js";
import { fadeInOutHelpCommands } from "./animations/fadeCommands.js";
import { loadStyles } from "./styleLoader.js";
import UserList from "./classes/UserList.js";

export default class App {
	constructor() {
		loadStyles();
		this.userList = new UserList();
		this.tasksCompleted = 0;
		this.totalTasks = 0;
	}

	/**
	 * Render the task list to the DOM
	 * @returns {void}
	 */
	render() {
		this.renderTaskList();
		this.renderTaskCount();
		animateScroll();
		fadeInOutHelpCommands();
	}

	/**
	 * Render the task list to the DOM
	 * @returns {void}
	 */
	renderTaskList() {
		const fragment = document.createDocumentFragment();

		this.userList.getAllUsers().forEach((user) => {
			const cardDiv = document.createElement("div");
			cardDiv.classList.add("card");
			cardDiv.dataset.user = user.username;
			const userNameDiv = document.createElement("div");
			userNameDiv.classList.add("username");
			userNameDiv.innerText = user.username;
			userNameDiv.style.color = window.configs.settings.showUsernameColor
				? user.userColor
				: "";
			cardDiv.appendChild(userNameDiv);
			const list = document.createElement("ol");
			list.classList.add("tasks");
			user.tasks.forEach((task, i) => {
				const listItem = document.createElement("li");
				listItem.classList.add("task");
				listItem.dataset.taskId = `${user.username}-${task.id}`;
				listItem.innerText = task.description;
				if (task.isComplete()) {
					listItem.classList.add("done");
				}
				list.appendChild(listItem);
			});
			cardDiv.appendChild(list);
			fragment.appendChild(cardDiv);
		});

		const clonedFragment = fragment.cloneNode(true);
		const primaryContainer = document.querySelector(
			".task-container.primary"
		);
		primaryContainer.innerHTML = "";
		primaryContainer.appendChild(fragment);

		const secondaryContainer = document.querySelector(
			".task-container.secondary"
		);
		secondaryContainer.innerHTML = "";
		secondaryContainer.appendChild(clonedFragment);
	}

	/**
	 * Render the task count to the DOM
	 * @returns {void}
	 */
	renderTaskCount() {
		let completedTasksCount = this.userList.tasksCompleted;
		let totalTasksCount = this.userList.totalTasks;
		const totalTasksElement = document.querySelector(".task-count");
		totalTasksElement.innerText = `${completedTasksCount}/${totalTasksCount}`;
	}

	/**
	 * Handles chat commands and responses
	 * @param {string} username
	 * @param {string} command
	 * @param {string} message
	 * @param {{broadcaster: boolean, mod: boolean}} flags
	 * @param {{userColor: string, messageId: string}} extra
	 * @returns {{success: boolean, message: string}} - Response message
	 */
	chatHandler(username, command, message, flags, extra) {
		command = `!${command.toLowerCase()}`;
		const {
			admin: adminConfig,
			user: userConfig,
			settings: { languageCode, maxTasksPerUser },
		} = window.configs;

		let template = "";
		let responseDetail = "";

		try {
			// ADMIN COMMANDS
			if (isMod(flags)) {
				if (adminConfig.commands.clearList.includes(command)) {
					this.userList.clearUserList();
					template = adminConfig.responseTo[languageCode].clearList;
					return respondMessage(template, username, responseDetail);
				}
				if (adminConfig.commands.clearDone.includes(command)) {
					this.userList.clearDoneTasks();
					template = adminConfig.responseTo[languageCode].clearDone;
					return respondMessage(template, username, responseDetail);
				}
				if (adminConfig.commands.clearUser.includes(command)) {
					this.userList.deleteUser(message);
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
				let user =
					this.userList.getUser(username) ||
					this.userList.createUser(username, {
						userColor: extra.userColor,
					});

				const taskDescriptions = message.split(", ");
				if (
					user.getTasks().length + taskDescriptions.length >
					maxTasksPerUser
				) {
					template =
						userConfig.responseTo[languageCode].maxTasksAdded;
				} else {
					const tasks = this.userList.addUserTasks(
						username,
						taskDescriptions
					);
					tasks.forEach((task) => {
						this.addTaskToDOM(username, task);
					});
					responseDetail = message;
					template = userConfig.responseTo[languageCode].addTask;
				}
			} else if (userConfig.commands.editTask.includes(command)) {
				// EDIT TASK
				const whiteSpaceIdx = message.search(/(?<=\d)\s/); // number followed by space
				if (whiteSpaceIdx === -1) {
					throw new Error(
						"Task number or description format is invalid"
					);
				}
				const taskNumber = message.slice(0, whiteSpaceIdx);
				const newDescription = message.slice(whiteSpaceIdx + 1);
				const task = this.userList.editUserTask(
					username,
					parseTaskIndex(taskNumber),
					newDescription
				);
				this.updateTaskFromDOM(username, task);
				responseDetail = taskNumber;
				template = userConfig.responseTo[languageCode].editTask;
			} else if (userConfig.commands.finishTask.includes(command)) {
				// COMPLETE/DONE TASK
				let indices = message.split(", ").map((i) => parseTaskIndex(i));
				const tasks = this.userList.completeUserTasks(
					username,
					indices
				);
				tasks.forEach(({ id }) => {
					this.completeTaskFromDOM(username, id);
				});
				responseDetail = message;
				template = userConfig.responseTo[languageCode].finishTask;
			} else if (userConfig.commands.deleteTask.includes(command)) {
				// DELETE/REMOVE TASK
				const indices = message
					.split(", ")
					.map((i) => parseTaskIndex(i));
				const tasks = this.userList.deleteUserTasks(username, indices);
				tasks.forEach(({ id }) => {
					this.deleteTaskFromDOM(username, id);
				});
				responseDetail = tasks
					.map((task) => task.description)
					.join(", ");
				template = userConfig.responseTo[languageCode].deleteTask;
			} else if (userConfig.commands.check.includes(command)) {
				// CHECK TASKS
				responseDetail = this.userList
					.checkUserTasks(username)
					.join(", ");
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
				error.message,
				true
			);
		}
	}

	/**
	 * Add the task to the DOM
	 * @param {string} username
	 * @param {{description: string, id: string}} task
	 * @returns {void}
	 */
	addTaskToDOM(username, task) {
		const userElement = document.querySelector(`data-user="${username}"`);
		const taskElement = document.createElement("li");
		taskElement.classList.add("task");
		taskElement.dataset.taskId = `${username}-${task.id}`;
		taskElement.innerText = task.description;
		userElement.querySelector(".tasks").appendChild(taskElement);
		this.totalTasks++;
		this.renderTaskCount();
	}

	/**
	 * Edit the task in the DOM
	 * @param {string} username
	 * @param {{description: string, id: string}} task
	 * @returns {void}
	 */
	updateTaskFromDOM(username, task) {
		const taskElement = document.querySelector(
			`data-task-id="${username}-${task.id}"`
		);
		taskElement.innerText = task.description;
	}

	/**
	 * Complete the task in the DOM
	 * @param {string} username
	 * @param {string} taskId
	 * @returns {void}
	 */
	completeTaskFromDOM(username, taskId) {
		const taskElement = document.querySelector(
			`data-task-id="${username}-${taskId}"`
		);
		taskElement.classList.add("done");
		this.tasksCompleted++;
		this.renderTaskCount();
	}

	/**
	 * Delete the task in the DOM
	 * @param {string} username
	 * @param {string} taskId
	 * @returns {void}
	 */
	deleteTaskFromDOM(username, taskId) {
		const taskElement = document.querySelector(
			`data-task-id="${username}-${taskId}"`
		);
		taskElement.remove();
		this.totalTasks--;
		this.tasksCompleted--;
		this.renderTaskCount();
	}
}

/**
 * Responds with a formatted message
 * @param {string} template - The response template
 * @param {string} username - The username of the user
 * @param {string} message - The message to replace in the template
 * @param {boolean} error - If the response is an error
 * @returns {{message: string, error: boolean}}
 */
function respondMessage(template, username, message, error = false) {
	const response = {
		message: template
			.replace("{user}", username)
			.replace("{message}", message),
		error,
	};
	return response;
}

/**
 * Check if the user is a mod or broadcaster
 * @param {{broadcaster: boolean, mod: boolean}} flags
 * @returns {boolean}
 */
function isMod(flags) {
	return flags.broadcaster || flags.mod;
}

/**
 * Parse the task index
 * @param {string} index
 * @returns {number}
 */
function parseTaskIndex(index) {
	return parseInt(index, 10) - 1;
}
