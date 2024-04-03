const User = require("./User");

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

module.exports = { UserList, ActionType };
