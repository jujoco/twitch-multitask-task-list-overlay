/**
 * @class Task
 * @property {string} description - The description of the task.
 * @property {boolean} completionStatus - Indicates whether the task is complete or not.
 * @method validateDescription - Validate the description of the task.
 * @method getDescription - Get the description of the task.
 * @method setDescription - Set the description of the task.
 * @method isComplete - Get the completion status of the task.
 * @method setCompletionStatus - Set the status of the task.
 */
class Task {
	/**
	 * @constructor
	 * @param {string} description - The description of the task.
	 */
	constructor(description) {
		this.description = this.validateDescription(description);
		this.completionStatus = false;
	}

	/**
	 * Validate the description of the task.
	 * @param {string} description - The description of the task.
	 * @returns {string} The description of the task.
	 * @throws {Error} If the description is invalid.
	 */
	validateDescription(description) {
		if (typeof description !== "string") {
			throw new Error(`Task description must be of type string`);
		}
		description = description.trim();
		if (description.length === 0) {
			throw new Error("Task description invalid");
		}
		return description;
	}

	/**
	 * Get the description of the task.
	 * @returns {string} Description of the task.
	 */
	getDescription() {
		return this.description;
	}

	/**
	 * Set the description of the task.
	 * @param {string} description - The new description of the task.
	 * @return void
	 */
	setDescription(description) {
		this.description = this.validateDescription(description);
	}

	/**
	 * Get the status of the task.
	 * @returns {boolean} The status of the task.
	 */
	isComplete() {
		return this.completionStatus;
	}

	/**
	 * Set the status of the task.
	 * @param {boolean} status - The new status of the task.
	 */
	setCompletionStatus(status) {
		if (typeof status !== "boolean") {
			throw new Error("Completion status must be of type boolean");
		}
		this.completionStatus = status;
	}
}

/**
 * @class User
 * @property {string} username - The username of the user
 * @property {Task[]} tasks - The tasks of the user
 * @method validateUsername - Validate the username of the user
 * @method addTask - Add tasks to the user
 * @method editTask - Edit the task at the specified index
 * @method completeTask - Mark the task at index as complete
 * @method deleteTask - Delete the task at the specified index
 * @method clearDoneTasks - Clear all completed tasks
 * @method getTask - Get the task at the specified index
 * @method getTasks - Get all tasks of the user
 * @method validateTaskIndex - Validates the task index
 */
class User {
	/**
	 * @constructor
	 * @param {string} username - The username of the user
	 */
	constructor(username) {
		this.username = this.validateUsername(username);
		this.tasks = [];
	}

	/**
	 * Validate the username of the user
	 * @param {string} username - The username of the user
	 * @returns {string} - The username of the user
	 * @throws {Error} - If the username is invalid
	 */
	validateUsername(username) {
		if (typeof username !== "string") {
			throw new Error("Username must be of type string");
		}
		username = username.trim();
		if (username.length === 0) {
			throw new Error("Username invalid");
		}
		return username;
	}

	/**
	 * Add tasks to the user
	 * @param {string} taskDescription - The task description to add
	 * @returns {Task} - The newly created Task object
	 */
	addTask(descriptions) {
		let task = new Task(descriptions);
		this.tasks.push(task);
		return task;
	}

	/**
	 * Edit the task at the specified index
	 * @param {number} index - The index of the task to get
	 * @param {string} description - The new task description
	 * @throws {Error} If the index is out of bounds
	 * @returns {Task} - The task that was edited
	 */
	editTask(index, description) {
		let task = this.getTask(index);
		task.setDescription(description);
		return task;
	}

	/**
	 * Mark the task at the specified index as complete
	 * @param {number} index - The index of the task to complete
	 * @throws {Error} If the index is out of bounds
	 * @returns {Task} - The task that was completed
	 */
	completeTask(index) {
		let task = this.getTask(index);
		task.setCompletionStatus(true);
		return task;
	}

	/**
	 * Delete the task at the specified index
	 * @param {number} index - The index of the task to delete
	 * @returns {Task}	The task that was removed
	 */
	deleteTask(index) {
		this.validateTaskIndex(index);
		return this.tasks.splice(index, 1)[0];
	}

	/**
	 * Clear all completed tasks
	 * @returns {Task[]} - The tasks that were cleared
	 */
	clearDoneTasks() {
		this.tasks = this.tasks.filter((task) => !task.isComplete());
		return this.tasks;
	}

	/**
	 * Get the task at the specified index
	 * @param {number} index - The index of the task to get
	 * @returns {Task} - The task at the specified index
	 */
	getTask(index) {
		this.validateTaskIndex(index);
		return this.tasks[index];
	}

	/**
	 * Get the tasks of the user
	 * @returns {Task[]} - The tasks of the user
	 */
	getTasks() {
		return this.tasks;
	}

	/**
	 * Validates the task index.
	 * @param {number} index - The index of the task.
	 * @throws {Error} If the index is out of bounds.
	 * @returns {boolean}
	 */
	validateTaskIndex(index) {
		if (typeof index !== "number" || isNaN(index)) {
			throw new Error("Task index must be a number");
		}
		if (index < 0 || index >= this.tasks.length) {
			throw new Error("Task index out of bounds");
		}
		return true;
	}
}

/**
 * @class UserList
 * @property {User[]} users
 * @method #loadUserListFromLocalStorage - Load the user list from local storage
 * @method #commitToLocalStorage - Save the user list to local storage
 * @method getUser - Get the user at the specified index
 * @method getAllUsers - Get all users
 * @method addUserTask - Add a task to the specified user
 * @method editUserTask - Edit the task at the specified index
 * @method completeUserTask - Mark specified task as complete
 * @method deleteUserTask - Delete specified task at index
 * @method checkUserTasks - Get inc from a user
 * @method clearUserList - Clear user list
 * @method clearDoneTasks - Clear all done tasks
 * @method deleteUser - Delete the user
 */
class UserList {
	constructor() {
		this.users = this.#loadUserListFromLocalStorage();
	}

	/**
	 * Load the user list from local storage
	 * @private
	 * @returns {User[]} - The user list
	 */
	#loadUserListFromLocalStorage() {
		let userList = localStorage.getItem("userList");
		if (!userList) {
			userList = [];
			localStorage.setItem("userList", JSON.stringify(userList));
			return userList;
		}
		userList = JSON.parse(userList);
		const users = userList.map((oldUser) => {
			const newUser = new User(oldUser.username);
			oldUser.tasks.map((task) => {
				const newTask = newUser.addTask(task.description);
				newTask.setCompletionStatus(task.completionStatus);
			});
			return newUser;
		});

		return users;
	}

	/**
	 * Commit userList changes to local storage
	 * @private
	 * @returns {void}
	 */
	#commitToLocalStorage() {
		localStorage.setItem("userList", JSON.stringify(this.users));
	}

	/**
	 * Get user by username
	 * @param {string} username - The username of the user
	 * @returns {User | undefined} - The user at the specified index
	 */
	getUser(username) {
		const user = this.users.find((user) => user.username === username);
		return user;
	}

	/**
	 * Get all users
	 * @returns {User[]} - All users
	 */
	getAllUsers() {
		return this.users;
	}

	/**
	 * Add a task to the user at the specified index
	 * @param {string} username - The username of the user
	 * @param {string | string[]} taskDescriptions - The task to add
	 * @returns {string} - The description of the added task
	 */
	addUserTask(username, taskDescriptions) {
		if (!Array.isArray(taskDescriptions)) {
			taskDescriptions = [taskDescriptions];
		}
		let user = this.getUser(username);
		if (!user) {
			user = new User(username);
			this.users.push(user);
		}
		taskDescriptions.forEach((description) => user.addTask(description));

		this.#commitToLocalStorage();
		return taskDescriptions.join(", ");
	}

	/**
	 * Edit the task at the specified index
	 * @param {string} username - The username of the user
	 * @param {number} taskIndex - The index of the task to edit
	 * @param {string} taskDescription - The new task value
	 * @throws {Error} - If user has no tasks
	 * @returns {string} - The new task description
	 */
	editUserTask(username, taskIndex, taskDescription) {
		const user = this.getUser(username);
		if (!user) {
			throw new Error(`${username} has no tasks`);
		}
		user.editTask(taskIndex, taskDescription);
		this.#commitToLocalStorage();
		return taskDescription;
	}

	/**
	 * Mark the task at the specified index as complete
	 * @param {string} username - The username of the user
	 * @param {number} taskIndex - The index of the task to complete
	 * @throws {Error} - If user has no tasks
	 * @returns {string} - The description of the completed task
	 */
	completeUserTask(username, taskIndex) {
		const user = this.getUser(username);
		if (!user) {
			throw new Error(`${username} has no tasks`);
		}
		const task = user.completeTask(taskIndex);
		this.#commitToLocalStorage();
		return task.getDescription();
	}

	/**
	 * Delete the task at the specified index
	 * @param {string} username - The username of the user
	 * @param {number} taskIndex - The index of the task to delete
	 * @throws {Error} - If user has no tasks
	 * @returns {string} - The description of the deleted task
	 */
	deleteUserTask(username, taskIndex) {
		const user = this.getUser(username);
		if (!user) {
			throw new Error(`${username} has no tasks`);
		}
		const task = user.deleteTask(taskIndex);
		this.#commitToLocalStorage();
		return task.getDescription();
	}

	/**
	 * Get incomplete tasks from a user
	 * @param {string} username - The username of the user
	 * @throws {Error} - If the user has no tasks
	 * @returns {string[]} - The incomplete tasks of the user
	 */
	checkUserTasks(username) {
		const user = this.getUser(username);
		if (!user) {
			throw new Error(`${username} has no tasks`);
		}
		return user
			.getTasks()
			.filter((task) => !task.isComplete())
			.map((task) => task.getDescription());
	}

	/**
	 * Clear UserList
	 * @returns {void}
	 */
	clearUserList() {
		this.users = [];
		this.#commitToLocalStorage();
	}

	/**
	 * Clear all done tasks
	 * @returns {void}
	 */
	clearDoneTasks() {
		this.users.forEach((user) => {
			user.clearDoneTasks();
		});
		this.#commitToLocalStorage();
	}

	/**
	 * Delete a user by username
	 * @param {string} username - The username of the user
	 * @throws {Error} - If the user is not found
	 * @returns {User} - The deleted user
	 */
	deleteUser(username) {
		const userIndex = this.users.findIndex(
			(user) => user.username === username
		);
		if (userIndex === -1) {
			throw new Error(`${username} not found`);
		}
		const user = this.users[userIndex];
		this.users.splice(userIndex, 1);
		this.#commitToLocalStorage();
		return user;
	}
}
const adminConfig = configs.admin;
const userConfig = configs.user;
const langCode = configs.settings.languageCode;
const maxTasksPerUser = configs.settings.maxTasksPerUser;
const twitchChannel = configs.auth.channel;
const twitchUserName = configs.auth.username;
const oauth_token = configs.auth.oauth;

ComfyJS.Init(twitchUserName, oauth_token, twitchChannel);

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
			if (adminConfig.commands.adminClearDoneTasks.includes(command)) {
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
			if (userList.getUser(username)?.tasks.length >= maxTasksPerUser) {
				respond(
					userConfig.responseTo[langCode].maxTasksAdded,
					username
				);
			} else {
				const tasks = message.split(", ");
				userList.addUserTask(username, tasks);
				respond(
					userConfig.responseTo[langCode].addTask,
					username,
					message
				);
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
			respond(
				userConfig.responseTo[langCode].finishTask,
				username,
				taskComp
			);
		} else if (userConfig.commands.deleteTask.includes(command)) {
			// DELETE TASK
			const index = parseIndex(message);
			const taskDel = userList.deleteUserTask(username, index);
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
		console.error(error, username, message);
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
/** @type {UserList} */
let userList;
/** @type {Animation} */
let primaryAnimation;
/** @type {Animation} */
let secondaryAnimation;

window.addEventListener("load", () => {
	userList = new UserList();
	if (configs.settings.testMode) {
		loadTestUsers();
	}
	renderDOM();
});

function loadTestUsers() {
	userList.clearUserList();
	for (let i = 1; i <= 10; i++) {
		userList.addUserTask(`Username${i}`, [
			"Task description 1",
			"Task description 2",
			"Task with very long description 3",
		]);
	}
}

function renderDOM() {
	renderTaskListToDOM();
}

function renderTaskListToDOM() {
	const users = userList.getAllUsers();
	const fragment = document.createDocumentFragment();
	let totalTasksCount = 0;
	let completedTasksCount = 0;

	users.forEach((user) => {
		const cardDiv = document.createElement("div");
		cardDiv.classList.add("card");
		const userNameDiv = document.createElement("div");
		userNameDiv.classList.add("username");
		userNameDiv.innerText = user.username;
		cardDiv.appendChild(userNameDiv);
		const list = document.createElement("ol");
		list.classList.add("tasks");
		user.tasks.forEach((task) => {
			const listItem = document.createElement("li");
			listItem.classList.add("task");
			listItem.innerText = task.description;
			if (task.completionStatus) {
				listItem.classList.add("done");
				completedTasksCount++;
			}
			totalTasksCount++;
			list.appendChild(listItem);
		});
		cardDiv.appendChild(list);
		fragment.appendChild(cardDiv);
	});

	updateTaskCount(completedTasksCount, totalTasksCount);

	const clonedFragment = fragment.cloneNode(true);

	const primaryContainer = document.querySelector(".task-container.primary");
	primaryContainer.innerHTML = "";
	primaryContainer.appendChild(fragment);

	const secondaryContainer = document.querySelector(
		".task-container.secondary"
	);
	secondaryContainer.innerHTML = "";
	secondaryContainer.appendChild(clonedFragment);

	animateScroll();
}

function updateTaskCount(completed, total) {
	const totalTasksElement = document.querySelector(".task-count");
	totalTasksElement.innerText = `${completed}/${total}`;
}

function animateScroll() {
	const wrapper = document.querySelector(".task-wrapper");
	const wrapperHeight = wrapper.clientHeight;

	const containerPrimary = document.querySelector(".task-container.primary");
	const containerHeight = containerPrimary.scrollHeight;

	const containerSecondary = document.querySelector(
		".task-container.secondary"
	);

	// hide 2nd container & cancel animation OR
	// show it & play animation
	if (containerHeight < wrapperHeight) {
		containerSecondary.style.display = "none";
		cancelAnimation();
	} else {
		containerSecondary.style.display = "flex";

		const scrollSpeed = parseInt(configs.settings.scrollSpeed, 10);

		let duration = (containerHeight / scrollSpeed) * 1000;
		let options = {
			duration: duration,
			iterations: 1,
			easing: "linear",
		};

		const gapSize = getComputedStyle(document.documentElement)
			.getPropertyValue("--card-gap-between")
			.slice(0, -2);
		let adjustedHight = containerHeight + parseInt(gapSize, 10);
		let primaryKeyFrames = [
			{ transform: "translateY(0)" },
			{ transform: `translateY(-${adjustedHight}px)` },
		];
		let secondaryKeyFrames = [
			{ transform: "translateY(0)" },
			{ transform: `translateY(-${adjustedHight}px)` },
		];

		// store and apply animations
		primaryAnimation = containerPrimary.animate(primaryKeyFrames, options);
		secondaryAnimation = containerSecondary.animate(
			secondaryKeyFrames,
			options
		);

		addAnimationListeners();
	}
}

function cancelAnimation() {
	if (primaryAnimation) {
		primaryAnimation.cancel();
	}
	if (secondaryAnimation) {
		secondaryAnimation.cancel();
	}
}

function addAnimationListeners() {
	if (primaryAnimation) {
		primaryAnimation.addEventListener("finish", animationFinished);
		primaryAnimation.addEventListener("cancel", animationFinished);
	}
}

function animationFinished() {
	animateScroll();
}
(() => {
	"use strict";

	const styles = configs.styles;

	window.addEventListener("load", () => {
		loadCustomStyles();
	});

	function loadCustomStyles() {
		const root = document.querySelector(":root");
		for (let [key, val] of Object.entries(styles)) {
			if (key.includes("FontFamily")) {
				loadGoogleFont(val);
			}
			root.style.setProperty(convertToCSSVar(key), val);
		}
	}

	/**
	 * @param {string} font - Font family name.
	 * @returns {void}
	 */
	function loadGoogleFont(font) {
		WebFont.load({
			google: {
				families: [`${font}:100,400,700`],
			},
		});
	}

	/**
	 * @param {string} name - The name of the CSS variable.
	 * @returns {string}
	 */
	function convertToCSSVar(name) {
		let cssVar = name.replace(/([A-Z])/g, "-$1").toLowerCase();
		return `--${cssVar}`;
	}
})();
