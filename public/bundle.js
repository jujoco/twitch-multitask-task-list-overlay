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
 */

/**
 * @class TaskBot
 * @method addTask - Add a task to the list
 * @method editTask - Edit a task in the list
 * @method completeTask - Mark a task as complete
 * @method deleteTask - Delete a task from the list
 * @method checkTask - Check existing incomplete tasks in the list
 */
class TaskBot {
	/**
	 * @param {UserList} list
	 */
	constructor(list) {
		this.list = list;
	}

	addTask(username, taskDescription) {
		this.list.dispatch("ADD_USER_TASK", { username, taskDescription });
	}

	editTask(username, taskIndex, taskDescription) {
		this.list.dispatch("EDIT_USER_TASK", {
			username,
			taskIndex,
			taskDescription,
		});
	}

	completeTask(username, taskIndex) {
		this.list.dispatch("COMPLETE_USER_TASK", { username, taskIndex });
	}

	deleteTask(username, taskIndex) {
		this.list.dispatch("DELETE_USER_TASK", { username, taskIndex });
	}

	checkTask(username) {
		this.list.dispatch("CHECK_USER_TASK", { username });
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
		this.validateTaskIndex(index);
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
		this.validateTaskIndex(index);
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
		this.validateTaskIndex(index);
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
 * @readonly
 * @enum {string}
 */
const ActionType = {
	ADD_USER_TASK: "ADD_USER_TASK",
	EDIT_USER_TASK: "EDIT_USER_TASK",
	COMPLETE_USER_TASK: "COMPLETE_USER_TASK",
	DELETE_USER_TASK: "DELETE_USER_TASK",
	CHECK_USER_TASKS: "CHECK_USER_TASKS",
};

/**
 * @class UserList
 * @property {User[]} users
 * @method loadFromLocalStorage - Load the user list from local storage
 * @method saveToLocalStorage - Save the user list to local storage
 * @method dispatch - Dispatch an action to the user list
 * @method getUser - Get the user at the specified index
 * @method deleteUser - Delete the user at the specified index
 * @method addUserTask - Add a task to the specified user
 * @method editUserTask - Edit the task at the specified index
 * @method completeUserTask - Mark specified task as complete
 * @method deleteUserTask - Delete specified task at index
 * @method checkUserTasks - Get inc from a user
 */
class UserList {
	/**
	 * @constructor
	 */
	constructor() {
		this.users = this.loadFromLocalStorage();
	}

	/**
	 * Load the user list from local storage
	 * @returns {User[]} - The user list
	 */
	loadFromLocalStorage() {
		const usersStore = localStorage.getItem("userList");
		const users = usersStore || "[]";
		return JSON.parse(users);
	}

	/**
	 * Save the user list to local storage
	 * @returns {void}
	 */
	saveToLocalStorage() {
		localStorage.setItem("userList", JSON.stringify(this.users));
	}

	/**
	 * Dispatch an action to the user list
	 * @typedef DispatchResponse
	 * @property {string[]} taskDescriptions - list of task descriptions
	 * @property {string | null} error - The error message
	 *
	 * @param {ActionType} type - The action type
	 * @param {{ username: string, taskIndex?: number, taskDescription?: string}} payload - The action payload
	 * @returns {DispatchResponse} - The response from the action
	 */
	dispatch(type, payload) {
		const { username, taskDescription = "", taskIndex = -1 } = payload;
		/** @type DispatchResponse */
		let response = {
			taskDescriptions: [],
			error: null,
		};

		try {
			switch (type) {
				case ActionType.ADD_USER_TASK:
					response.taskDescriptions.push(
						this.addUserTask(username, taskDescription)
					);
					break;
				case ActionType.EDIT_USER_TASK:
					response.taskDescriptions.push(
						this.editUserTask(username, taskIndex, taskDescription)
					);
					break;
				case ActionType.COMPLETE_USER_TASK:
					response.taskDescriptions.push(
						this.completeUserTask(username, taskIndex)
					);
					break;
				case ActionType.DELETE_USER_TASK:
					response.taskDescriptions.push(
						this.deleteUserTask(username, taskIndex)
					);
					break;
				case ActionType.CHECK_USER_TASKS:
					response.taskDescriptions = this.checkUserTasks(username);
					break;
				default:
					throw new Error("Invalid action type");
			}
		} catch (error) {
			response.error = error.message;
		}
		return response;
	}

	/**
	 * Get user by username
	 * @param {string} username - The username of the user
	 * @returns {User | undefined} - The user at the specified index
	 */
	getUser(username) {
		return this.users.find((user) => user.username === username);
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
		this.saveToLocalStorage();
		return deletedUser;
	}

	/**
	 * Add a task to the user at the specified index
	 * @param {string} username - The username of the user
	 * @param {string} taskDescription - The task to add
	 * @returns {string} - The description of the added task
	 */
	addUserTask(username, taskDescription) {
		const user = this.getUser(username) || new User(username);
		user.addTask(taskDescription);
		this.users.push(user);
		this.saveToLocalStorage();
		return taskDescription;
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
		this.saveToLocalStorage();
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
		this.saveToLocalStorage();
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
		this.saveToLocalStorage();
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
}

