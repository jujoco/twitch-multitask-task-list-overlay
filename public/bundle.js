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
		if (typeof description !== "string" || description === "") {
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
			throw new Error("Completion status must be a boolean");
		}
		this.completionStatus = status;
	}
}

/**
 * @class User
 * @property {string} username - The username of the user
 * @property {Task[]} tasks - The tasks of the user
 * @method validateUsername - Add a task to the user
 * @method addTask - Add a task to the user
 * @method editTask - Edit the task at the specified index
 * @method completeTask - Mark the task at index as complete
 * @method deleteTask - Delete the task at the specified index
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
		if (typeof username !== "string" || username === "") {
			throw new Error("Invalid username format");
		}
		return username;
	}

	/**
	 * Add a task to the user
	 * @param {string} description - The task to add
	 * @returns {Task}
	 */
	addTask(description) {
		description = description.trim();
		const task = new Task(description);
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
	 * @throws {Error} If the index is out of bounds
	 * @returns {Task}	The task that was removed
	 */
	deleteTask(index) {
		let tasks = this.getTasks();
		const taskRemoved = tasks.splice(index, 1)[0];
		return taskRemoved;
	}

	/**
	 * Get the task at the specified index
	 * @param {number} index - The index of the task to get
	 * @throws {Error} If the index is out of bounds
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
 * @method loadUserListFromLocalStorage - Load the user list from local storage
 * @method commitChanges - Save the user list to local storage
 * @method getUser - Get the user at the specified index
 * @method getAllUsers - Get all users
 * @method deleteUser - Delete the user at the specified index
 * @method addUserTasks - Add a task to the specified user
 * @method editUserTask - Edit the task at the specified index
 * @method completeUserTask - Mark specified task as complete
 * @method deleteUserTask - Delete specified task at index
 * @method checkUserTasks - Get inc from a user
 * @method clearAllTasks - Clear all tasks
 * @method clearDoneTasks - Clear all done tasks
 * @method clearUserTasks - Clear all tasks of a user
 */
class UserList {
	constructor() {
		this.users = this.loadUserListFromLocalStorage();
	}

	/**
	 * Load the user list from local storage
	 * @returns {User[]} - The user list
	 */
	loadUserListFromLocalStorage() {
		const usersStore = localStorage.getItem("userList");
		if (!usersStore) {
			localStorage.setItem("userList", "[]");
			return [];
		}
		const data = JSON.parse(usersStore);
		const store = data.map((user) => {
			const newUser = new User(user.username);
			newUser.tasks = user.tasks.map((prevTask) => {
				const newTask = new Task(prevTask.description);
				newTask.completionStatus = prevTask.completionStatus;
				return newTask;
			});
			return newUser;
		});
		return store;
	}

	/**
	 * Commit users changes to local storage
	 * @returns {void}
	 */
	commitChanges() {
		localStorage.setItem("userList", JSON.stringify(this.users));
	}

	/**
	 * Get user by username
	 * @param {string} username - The username of the user
	 * @returns {User} - The user at the specified index
	 */
	getUser(username) {
		let user = this.users.find((user) => user.username === username);
		if (!user) {
			user = new User(username);
			this.users.push(user);
		}
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
	 * Delete a user by username
	 * @param {string} username - The username of the user
	 * @throws {Error} - If the user is not found
	 * @returns {User} - The deleted user
	 */
	deleteUser(username) {
		const index = this.users.findIndex((user) => user.username === username);
		if (index === -1) {
			throw new Error("User not found");
		}
		const deletedUser = this.users.splice(index, 1)[0];

		return deletedUser;
	}

	/**
	 * Add a task to the user at the specified index
	 * @param {string} username - The username of the user
	 * @param {string[]} taskDescriptions - The task to add
	 * @returns {string[]} - The description of the added task
	 */
	addUserTasks(username, taskDescriptions) {
		const user = this.getUser(username);
		taskDescriptions.forEach((description) => {
			user.addTask(description);
		});
		return taskDescriptions;
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
		user.editTask(taskIndex, taskDescription);
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
	 * Clear all tasks
	 * @returns {void}
	 */
	clearAllTasks() {
		this.users.forEach((user) => {
			user.clearTasks();
		});
	}

	/**
	 * Clear all done tasks
	 * @returns {void}
	 */
	clearDoneTasks() {
		this.users.forEach((user) => {
			user.clearDoneTasks();
		});
	}

	/**
	 * Clear all tasks of a user
	 * @param {string} username - The username of the user
	 * @returns {void}
	 */
	clearUserTasks(username) {
		const user = this.getUser(username);
		user.clearTasks();
	}
}

let scrolling = false;
let primaryAnimation, secondaryAnimation;

function renderTaskBot() {
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
		list.classList.add("user-task-list");
		user.tasks.forEach((task) => {
			const listItem = document.createElement("li");
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

	const totalTasksElement = document.querySelector(".task-count");
	totalTasksElement.innerText = `${completedTasksCount} / ${totalTasksCount}`;

	const taskContainers = document.querySelectorAll(".task-container");
	taskContainers.forEach((taskContainer) => {
		taskContainer.innerHTML = "";
		taskContainer.appendChild(fragment);
	});

	animateScroll();
}

function animateScroll() {
	// task wrapper height
	let taskWrapper = document.querySelector(".task-wrapper");
	let taskWrapperHeight = taskWrapper.clientHeight;

	// task container height
	let taskContainerPrimary = document.querySelector(".task-container.primary");
	let taskContainerHeight = taskContainerPrimary.scrollHeight;

	// if primary task container height is greater than task wrapper height, animate scroll
	if (taskContainerHeight > taskWrapperHeight && !scrolling) {
		scrolling = true;

		let taskContainerSecondary = document.querySelector(
			".task-container.secondary"
		);
		taskContainerSecondary.style.display = "flex";

		let scrollSpeed = configs.settings.scrollSpeed;
		scrollSpeed = parseInt(scrollSpeed * 10, 10);

		let duration = (taskContainerHeight / scrollSpeed) * 1000;

		let options = {
			duration: duration,
			iterations: 1,
			easing: "linear",
		};

		let primaryKeyFrames = [
			{ transform: "translateY(0)" },
			{ transform: `translateY(-${taskContainerHeight}px)` },
		];

		let secondaryKeyFrames = [
			{ transform: `translateY(${taskContainerHeight}px)` },
			{ transform: "translateY(0)" },
		];

		// create animation object and play it
		primaryAnimation = document
			.querySelector(".primary")
			?.animate(primaryKeyFrames, options);

		secondaryAnimation = document
			.querySelector(".secondary")
			?.animate(secondaryKeyFrames, options);

		primaryAnimation?.play();
		secondaryAnimation?.play();

		addAnimationListeners();
	} else if (!scrolling) {
		// hide secondary element if task container height is less than task wrapper height
		let secondaryElement = document.querySelector(".secondary");
		secondaryElement.style.display = "none";
	}
}

function addAnimationListeners() {
	if (primaryAnimation) {
		primaryAnimation.addEventListener("finish", animationFinished);
		primaryAnimation.addEventListener("cancel", animationFinished);
	}
}

function animationFinished() {
	scrolling = false;
	renderTaskBot();
	animateScroll();
}

function cancelAnimation() {}

function loadCustomFont() {
	const headerFontFamilyValue = getComputedStyle(
		document.documentElement
	).getPropertyValue("--header-font-family");
	loadGoogleFont(headerFontFamilyValue);

	const bodyFontFamily = getComputedStyle(
		document.documentElement
	).getPropertyValue("--body-font-family");
	loadGoogleFont(bodyFontFamily);
}

function loadGoogleFont(font) {
	WebFont.load({
		google: {
			families: [font],
		},
	});
}

const userList = new UserList();
window.onload = function () {
	loadCustomFont();
	renderTaskBot();
};
