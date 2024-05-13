import { animateScroll } from "./animations/animateScroll.js";
import { fadeInOutText } from "./animations/fadeCommands.js";
import { loadStyles } from "./styleLoader.js";
import UserList from "./classes/UserList.js";

/** @typedef {import("./classes/User").default} User */

/**
 * @class App
 * @property {UserList} userList - The user list
 * @method render - Render the task list to the DOM
 * @method chatHandler - Handles chat commands and responses
 */
export default class App {
	#timerIntervalId = null;
	/**
	 * @constructor
	 * @param {UserList} userList - The user list
	 */
	constructor(storeName = "userList") {
		this.userList = new UserList(storeName);
		loadStyles(window.configs.styles);
	}

	/**
	 * Initial render the components to the DOM. Should only be called once.
	 * @returns {void}
	 */
	render() {
		this.renderTaskList();
		this.renderTaskHeader();
	}

	/**
	 * Render the task list to the DOM
	 * @returns {void}
	 */
	renderTaskList() {
		if (this.userList.users.length === 0) {
			return;
		}
		const fragment = document.createDocumentFragment();
		this.userList.getAllUsers().forEach((user) => {
			const cardEl = createUserCard(user);
			const list = cardEl.querySelector("ol");
			user.tasks.forEach((task) => {
				const listItem = document.createElement("li");
				listItem.classList.add("task");
				listItem.dataset.taskId = `${task.id}`;
				listItem.innerText = task.description;
				if (task.isComplete()) {
					listItem.classList.add("done");
				}
				list.appendChild(listItem);
			});
			fragment.appendChild(cardEl);
		});
		const primaryClone = fragment.cloneNode(true);
		const primaryContainer = document.querySelector(
			".task-container.primary"
		);
		primaryContainer.innerHTML = "";
		primaryContainer.appendChild(primaryClone);

		const secondaryClone = fragment.cloneNode(true);
		const secondaryContainer = document.querySelector(
			".task-container.secondary"
		);
		secondaryContainer.innerHTML = "";
		secondaryContainer.appendChild(secondaryClone);

		animateScroll();
	}

	/**
	 * Render the task header to the DOM
	 * @returns {void}
	 */
	renderTaskHeader() {
		this.renderTaskCount();
		const { headerDisplay, headerText } = window.configs.settings;
		if (headerDisplay.toLowerCase() === "timer") {
			this.renderTimer();
		} else if (headerDisplay.toLowerCase() === "commands") {
			this.renderCommandTips();
		} else if (headerDisplay.toLowerCase() === "text") {
			this.renderCustomText(headerText);
		}
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
	 * Render Pomodoro timer to the DOM
	 * @param {number} duration - The duration of the timer in minutes
	 * @returns {void}
	 */
	renderTimer(duration = 0) {
		this.#timerIntervalId && clearInterval(this.#timerIntervalId);
		const timerEl = document.querySelector(".timer");
		timerEl.classList.remove("hidden");
		const timerTitleEl = timerEl.querySelector(".timer-title");
		const timerElement = timerEl.querySelector(".timer-countdown");
		let timer = duration * 60;
		const updateTimer = () => {
			const minutes = Math.floor(timer / 60)
				.toString()
				.padStart(2, "0");
			const seconds = (timer % 60).toString().padStart(2, "0");
			timerElement.textContent = `${minutes}:${seconds}`;

			if (timer === 0) {
				clearInterval(this.#timerIntervalId);
				timerElement.textContent = "00:00";
				fadeInOutText(timerTitleEl, "Break");
			} else {
				fadeInOutText(timerTitleEl, "Focus");
				timer--;
			}
		};
		this.#timerIntervalId = setInterval(updateTimer, 1000);
	}

	/**
	 * Render command tips to the DOM
	 * @returns {void}
	 */
	renderCommandTips() {
		const tips = ["!add", "!edit", "!done", "!remove", "!check", "!help"];
		const commandTipEl = document.querySelector(".command-tips");
		commandTipEl.classList.remove("hidden");
		let tipIdx = 0;
		setInterval(() => {
			const commandCodeEl = commandTipEl.querySelector(".command-code");
			fadeInOutText(commandCodeEl, tips[tipIdx]);
			tipIdx = (tipIdx + 1) % tips.length;
		}, 6000);
	}

	/**
	 * Render custom text to the DOM
	 * @param {string} text - The custom text to display
	 * @returns {void}
	 */
	renderCustomText(text) {
		document.querySelector(".custom-header").classList.remove("hidden");
		document.querySelector(".custom-text").textContent = text;
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
			settings: { languageCode, maxTasksPerUser, headerDisplay },
		} = window.configs;

		let template = "";
		let responseDetail = "";

		try {
			// ADMIN COMMANDS
			if (isMod(flags)) {
				if (
					headerDisplay.toLowerCase() === "timer" &&
					adminConfig.commands.timer.includes(command) &&
					flags.broadcaster
				) {
					const duration = parseInt(message, 10);
					if (isNaN(duration) || duration <= 0) {
						throw new Error("Invalid timer duration");
					}
					this.renderTimer(duration);
					template = adminConfig.responseTo[languageCode].timer;
					responseDetail = duration;
					return respondMessage(template, username, responseDetail);
				} else if (adminConfig.commands.clearList.includes(command)) {
					this.userList.clearUserList();
					this.clearListFromDOM();
					template = adminConfig.responseTo[languageCode].clearList;
					return respondMessage(template, username, responseDetail);
				} else if (adminConfig.commands.clearDone.includes(command)) {
					const tasks = this.userList.clearDoneTasks();
					tasks.forEach(({ id }) => {
						this.deleteTaskFromDOM(id);
					});
					template = adminConfig.responseTo[languageCode].clearDone;
					return respondMessage(template, username, responseDetail);
				} else if (adminConfig.commands.clearUser.includes(command)) {
					const user = this.userList.deleteUser(message);
					this.deleteUserFromDOM(user);
					responseDetail = user.username;
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
					parseInt(maxTasksPerUser, 10)
				) {
					template =
						userConfig.responseTo[languageCode].maxTasksAdded;
				} else {
					const tasks = this.userList.addUserTasks(
						username,
						taskDescriptions
					);
					tasks.forEach((task) => {
						this.addTaskToDOM(user, task);
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
				this.editTaskFromDOM(task);
				responseDetail = taskNumber;
				template = userConfig.responseTo[languageCode].editTask;
			} else if (userConfig.commands.finishTask.includes(command)) {
				// COMPLETE/DONE TASK
				const indices = message.split(",").reduce((acc, i) => {
					if (parseTaskIndex(i) >= 0) acc.push(parseTaskIndex(i));
					return acc;
				}, []);
				const tasks = this.userList.completeUserTasks(
					username,
					indices
				);
				tasks.forEach(({ id }) => {
					this.completeTaskFromDOM(id);
				});
				responseDetail = message;
				template = userConfig.responseTo[languageCode].finishTask;
			} else if (userConfig.commands.deleteTask.includes(command)) {
				// DELETE/REMOVE TASK
				if (message.toLowerCase() === "all") {
					const user = this.userList.deleteUser(username);
					this.deleteUserFromDOM(user);
					template = userConfig.responseTo[languageCode].deleteAll;
				} else {
					const indices = message.split(",").reduce((acc, i) => {
						if (parseTaskIndex(i) >= 0) acc.push(parseTaskIndex(i));
						return acc;
					}, []);
					const tasks = this.userList.deleteUserTasks(
						username,
						indices
					);
					tasks.forEach(({ id }) => {
						this.deleteTaskFromDOM(id);
					});
					template = userConfig.responseTo[languageCode].deleteTask;
				}
				responseDetail = message;
			} else if (userConfig.commands.check.includes(command)) {
				// CHECK TASKS
				const taskMap = this.userList.checkUserTasks(username);
				const list = [];
				for (let [taskNumber, task] of taskMap) {
					list.push(`${taskNumber + 1}. ${task.description}`);
				}
				responseDetail = list.join(" | ");
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

	clearListFromDOM() {
		const primaryContainer = document.querySelector(
			".task-container.primary"
		);
		const secondaryContainer = document.querySelector(
			".task-container.secondary"
		);
		primaryContainer.innerHTML = "";
		secondaryContainer.innerHTML = "";
		this.renderTaskCount();
	}

	/**
	 * Add the task to the DOM
	 * @param {User} user
	 * @param {{description: string, id: string}} task
	 * @returns {void}
	 */
	addTaskToDOM(user, task) {
		const primaryContainer = document.querySelector(
			".task-container.primary"
		);
		const secondaryContainer = document.querySelector(
			".task-container.secondary"
		);
		const userCardEls = document.querySelectorAll(
			`[data-user="${user.username}"]`
		);
		if (userCardEls.length === 0) {
			const userCard = createUserCard(user);
			const clonedUserCard = userCard.cloneNode(true);
			primaryContainer.appendChild(userCard);
			secondaryContainer.appendChild(clonedUserCard);
		}
		const taskElement = document.createElement("li");
		taskElement.classList.add("task");
		taskElement.dataset.taskId = `${task.id}`;
		taskElement.innerText = task.description;
		const cloneTaskElement = taskElement.cloneNode(true);

		primaryContainer
			.querySelector(`[data-user="${user.username}"] .tasks`)
			.appendChild(taskElement);
		secondaryContainer
			.querySelector(`[data-user="${user.username}"] .tasks`)
			.appendChild(cloneTaskElement);

		this.renderTaskCount();
		animateScroll();
	}

	/**
	 * Edit the task description in the DOM
	 * @param {{description: string, id: string}} task
	 * @returns {void}
	 */
	editTaskFromDOM(task) {
		const taskElements = document.querySelectorAll(
			`[data-task-id="${task.id}"]`
		);
		for (const taskElement of taskElements) {
			taskElement.innerText = task.description;
		}
	}

	/**
	 * Complete the task in the DOM
	 * @param {string} taskId
	 * @returns {void}
	 */
	completeTaskFromDOM(taskId) {
		const taskElements = document.querySelectorAll(
			`[data-task-id="${taskId}"]`
		);
		for (const taskElement of taskElements) {
			taskElement.classList.add("done");
		}
		this.renderTaskCount();
	}

	/**
	 * Delete the task in the DOM
	 * @param {string} taskId
	 * @returns {void}
	 */
	deleteTaskFromDOM(taskId) {
		const taskElements = document.querySelectorAll(
			`[data-task-id="${taskId}"]`
		);
		for (const taskElement of taskElements) {
			if (taskElement.parentElement.children.length === 1) {
				// remove the user card if there is only one task
				taskElement.parentElement.parentElement.remove();
			} else {
				taskElement.remove();
			}
		}
		this.renderTaskCount();
	}

	/**
	 * Delete the user in the DOM
	 * @param {User} user
	 * @returns {void}
	 * @private
	 */
	deleteUserFromDOM(user) {
		// remove user card and reduce total tasks count
		const { username, tasks } = user;
		const userCardEls = document.querySelectorAll(
			`[data-user="${username}"]`
		);
		for (let card of userCardEls) {
			card.remove();
		}
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

/**
 * Create a user card element
 * @param {{username: string, userColor: string}}
 * @returns {HTMLDivElement}
 */
function createUserCard({ username, userColor }) {
	const cardEl = document.createElement("div");
	cardEl.classList.add("card");
	cardEl.dataset.user = username;
	const userNameDiv = document.createElement("div");
	userNameDiv.classList.add("username");
	userNameDiv.innerText = username;
	userNameDiv.style.color = window.configs.settings.showUsernameColor
		? userColor
		: "";
	cardEl.appendChild(userNameDiv);
	const list = document.createElement("ol");
	list.classList.add("tasks");
	cardEl.appendChild(list);
	return cardEl;
}
