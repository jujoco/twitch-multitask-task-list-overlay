const Task = require("./Task");
const User = require("./User");

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

module.exports = UserList;
