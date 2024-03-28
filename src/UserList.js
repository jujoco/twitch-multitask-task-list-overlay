const User = require("./User");

/**
 * @class UserList
 * @property {User[]} users
 * @method addUser - Add a user to the list
 * @method getUser - Get the user at the specified index
 * @method deleteUser - Delete the user at the specified index
 * @method getUserCount - Get the number of users in the list
 * @method addUserTask - Add a task to the user at the specified index
 * @method updateUserTask - Update the task at the specified index
 * @method deleteUserTask - Delete the task at the specified index
 * @method getUserTaskCount - Get the number of tasks the user has
 */
class UserList {
	/**
	 * @constructor
	 */
	constructor() {
		this.users = [];
	}

	/**
	 * Add a user to the list
	 * @param {string} username - The username of the user
	 * @returns {void}
	 */
	addUser(username) {
		const newUser = new User(username);
		this.users.push(newUser);
	}

	/**
	 * Get user by username
	 * @param {string} username - The username of the user
	 * @returns {User} - The user at the specified index
	 */
	getUser(username) {
		return this.users.find((user) => user.username === username);
	}

	/**
	 * Delete a user by username
	 * @param {string} username - The username of the user
	 * @returns {void}
	 */
	deleteUser(username) {
		const index = this.users.findIndex((user) => user.username === username);
		this.users.splice(index, 1);
	}

	/**
	 * Get the number of users in the list
	 * @returns {number} - The number of users in the list
	 */
	getUserCount() {
		return this.users.length;
	}

	/**
	 * Add a task to the user at the specified index
	 * @param {string} username - The username of the user
	 * @param {string} task - The task to add
	 * @returns {void}
	 */
	addUserTask(username, task) {
		const user = this.getUser(username);
		if (user) {
			user.addTask(task);
		}
	}

	/**
	 * Update the task at the specified index
	 * @param {string} username - The username of the user
	 * @param {number} taskIndex - The index of the task to update
	 * @param {string} newTask - The new task value
	 * @returns {void}
	 */
	updateUserTask(username, taskIndex, newTask) {
		const user = this.getUser(username);
		if (user) {
			user.updateTask(taskIndex, newTask);
		}
	}

	/**
	 * Delete the task at the specified index
	 * @param {string} username - The username of the user
	 * @param {number} taskIndex - The index of the task to delete
	 * @returns {void}
	 */
	deleteUserTask(username, taskIndex) {
		const user = this.getUser(username);
		if (user) {
			user.deleteTask(taskIndex);
		}
	}

	/**
	 * Get the number of tasks the user has
	 * @param {string} username - The username of the user
	 * @returns {number} - The number of tasks the user has
	 */
	getUserTaskCount(username) {
		const user = this.getUser(username);
		if (user) {
			return user.getTaskCount();
		}
		return 0;
	}
}

module.exports = UserList;
