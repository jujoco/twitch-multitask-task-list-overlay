import User from "./User.js";
import Task from "./Task.js";
/**
 * @class UserList
 * @property {User[]} users
 * @method getUser - Get the user at the specified index
 * @method getAllUsers - Get all users
 * @method createUser - Create a new user
 * @method addUserTasks - Add a tasks to the specified user
 * @method editUserTask - Edit the task at the specified index
 * @method completeUserTasks - Mark specified tasks as complete
 * @method deleteUserTasks - Delete tasks at specified indices
 * @method checkUserTasks - Get inc from a user
 * @method clearUserList - Clear user list
 * @method clearDoneTasks - Clear all done tasks
 * @method deleteUser - Delete the user
 */
export default class UserList {
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
			const newUser = new User(oldUser.username, {
				userColor: oldUser.userColor,
			});
			oldUser.tasks.map((task) => {
				const newTask = newUser.addTask(new Task(task.description));
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
	 * @returns {User | undefined} - The user
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
	 * Create new user
	 * @param {string} username - The username of the user
	 * @param {{userColor: string}} options - The username of the user
	 * @returns {User} - The newly created User object
	 */
	createUser(username, options) {
		if (this.getUser(username))
			throw new Error(`${username} already exists`);
		const user = new User(username, options);
		this.users.push(user);
		return user;
	}

	/**
	 * Add tasks to a user
	 * @param {string} username - The username of the user
	 * @param {string | string[]} taskDescriptions - The task to add
	 * @throws {Error} - If user does not exist
	 * @returns {string[]} - The description of the added task
	 */
	addUserTasks(username, taskDescriptions) {
		let user = this.getUser(username);
		if (!user) {
			throw new Error(`${username} does not exist`);
		}
		if (!Array.isArray(taskDescriptions)) {
			taskDescriptions = [taskDescriptions];
		}
		taskDescriptions.forEach((taskDesc) =>
			user.addTask(new Task(taskDesc))
		);

		this.#commitToLocalStorage();
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
		if (!user) {
			throw new Error(`${username} has no tasks`);
		}
		user.editTask(taskIndex, taskDescription);
		this.#commitToLocalStorage();
		return taskDescription;
	}

	/**
	 * Mark the user tasks as complete
	 * @param {string} username - The username of the user
	 * @param {number | number[]} indices - The index of the task to complete
	 * @throws {Error} - If user has no tasks
	 * @returns {string} - The description of the completed task
	 */
	completeUserTasks(username, indices) {
		const user = this.getUser(username);
		if (!user) {
			throw new Error(`${username} has no tasks`);
		}
		if (!Array.isArray(indices)) {
			indices = [indices];
		}
		const completedTaskDescriptions = indices.map(
			(i) => user.completeTask(i).description
		);
		this.#commitToLocalStorage();
		return completedTaskDescriptions;
	}

	/**
	 * Delete the user tasks
	 * @param {string} username - The username of the user
	 * @param {number | number[]} indices - The index of the task to delete
	 * @throws {Error} - If user has no tasks
	 * @returns {string[]} - The description of the deleted task
	 */
	deleteUserTasks(username, indices) {
		const user = this.getUser(username);
		if (!user) {
			throw new Error(`${username} has no tasks`);
		}
		if (!Array.isArray(indices)) {
			indices = [indices];
		}
		const deletedDesc = user
			.deleteTask(indices)
			.map((task) => task.description);
		this.#commitToLocalStorage();
		return deletedDesc;
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
