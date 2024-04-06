const User = require("./User");

/**
 * @class UserList
 * @property {User[]} users
 * @method loadUserListFromLocalStorage - Load the user list from local storage
 * @method commitToLocalStorage - Save the user list to local storage
 * @method #createUser - Create a new user
 * @method getUser - Get the user at the specified index
 * @method getAllUsers - Get all users
 * @method deleteUser - Delete the user at the specified index
 * @method addUserTask - Add a task to the specified user
 * @method editUserTask - Edit the task at the specified index
 * @method completeUserTask - Mark specified task as complete
 * @method deleteUserTask - Delete specified task at index
 * @method checkUserTasks - Get inc from a user
 * @method clearUserList - Clear user list
 * @method clearDoneTasks - Clear all done tasks
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
		let userList = localStorage.getItem("userList");
		if (userList === null) {
			localStorage.setItem("userList", "[]");
			userList = [];
			return userList;
		}
		userList = JSON.parse(userList);
		const users = userList.map((oldUser) => {
			const newUser = this.#createUser(
				oldUser.username,
				oldUser.tasks.map((task) => task.description)
			);
			newUser.tasks.forEach((task, index) => {
				task.completionStatus = oldUser.tasks[index].completionStatus;
			});
			return newUser;
		});

		return users;
	}

	/**
	 * Commit userList changes to local storage
	 * @returns {void}
	 */
	commitToLocalStorage() {
		localStorage.setItem("userList", JSON.stringify(this.users));
	}

	/**
	 * Create a new user
	 * @param {string} username - The username of the user
	 * @param {string[]} [taskDescriptions] - The task descriptions of the user
	 * @returns {User} - The created user
	 * @throws {Error} - If the username already exists
	 */
	#createUser(username, taskDescriptions = []) {
		if (this.getUser(username)) {
			throw new Error("Username already exists");
		}
		const newUser = new User(username);
		if (taskDescriptions.length > 0) {
			newUser.addTask(taskDescriptions);
		}
		this.users.push(newUser);
		this.commitToLocalStorage();
		return newUser;
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
		this.commitToLocalStorage();
		return deletedUser;
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
			user = this.#createUser(username, taskDescriptions);
		} else {
			user.addTask(taskDescriptions);
		}
		this.commitToLocalStorage();
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
		this.commitToLocalStorage();
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
		this.commitToLocalStorage();
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
		this.commitToLocalStorage();
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
		this.commitToLocalStorage();
	}

	/**
	 * Clear all done tasks
	 * @returns {void}
	 */
	clearDoneTasks() {
		this.users.forEach((user) => {
			user.clearDoneTasks();
		});
		this.commitToLocalStorage();
	}
}
module.exports = UserList;
