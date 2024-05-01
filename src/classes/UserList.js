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
	#localStoreName;
	/**
	 * @constructor
	 * @param {string} #localStoreName - The name of the local storage
	 * @property {User[]} users - The list of users
	 */
	constructor(localStoreName = "userList") {
		this.#localStoreName = localStoreName;
		this.tasksCompleted = 0;
		this.totalTasks = 0;
		if (window.configs.settings.testMode) {
			this.#localStoreName = "testUserList";
		}
		this.users = this.#loadUserListFromLocalStorage();
	}

	/**
	 * Load the user list from local storage
	 * @private
	 * @returns {User[]} The user list
	 */
	#loadUserListFromLocalStorage() {
		let userList = localStorage.getItem(this.#localStoreName);
		if (userList) {
			userList = JSON.parse(userList);
			return userList.map((oldUser) => {
				const user = new User(oldUser.username, {
					userColor: oldUser.userColor,
				});
				oldUser.tasks.map((task) => {
					const newTask = user.addTask(
						new Task(task.description, task.id)
					);
					this.totalTasks++;
					if (task.completionStatus) {
						newTask.setCompletionStatus(task.completionStatus);
						this.tasksCompleted++;
					}
				});
				return user;
			});
		} else {
			userList = [];
			if (window.configs.settings.testMode) {
				userList = loadTestUsers();
			}
			localStorage.setItem(
				this.#localStoreName,
				JSON.stringify(userList)
			);
			return userList;
		}
	}

	/**
	 * Commit userList changes to local storage
	 * @private
	 * @returns {void}
	 */
	#commitToLocalStorage() {
		localStorage.setItem(this.#localStoreName, JSON.stringify(this.users));
	}

	/**
	 * Get user by username
	 * @param {string} username - The username of the user
	 * @returns {User | undefined} The user
	 */
	getUser(username) {
		const user = this.users.find((user) => user.username === username);
		return user;
	}

	/**
	 * Get all users
	 * @returns {User[]} All users
	 */
	getAllUsers() {
		return this.users;
	}

	/**
	 * Create new user
	 * @param {string} username - The username of the user
	 * @param {{userColor: string}} options - The username of the user
	 * @throws {Error} If the user already exists
	 * @returns {User} The newly created User object
	 */
	createUser(username, options) {
		if (this.getUser(username)) {
			throw new Error(`${username} already exists`);
		}
		const user = new User(username, options);
		this.users.push(user);
		return user;
	}

	/**
	 * Add tasks to a user
	 * @param {string} username - The username of the user
	 * @param {string | string[]} taskDescriptions - The task to add
	 * @throws {Error} If user does not exist
	 * @returns {Task[]} The description of the added task
	 */
	addUserTasks(username, taskDescriptions) {
		const user = this.getUser(username);
		if (!user) {
			throw new Error(`${username} does not exist`);
		}
		const descriptions = [].concat(taskDescriptions);
		const tasks = descriptions.map((taskDesc) =>
			user.addTask(new Task(taskDesc))
		);

		this.#commitToLocalStorage();
		return tasks;
	}

	/**
	 * Edit the task at the specified index
	 * @param {string} username - The username of the user
	 * @param {number} taskIndex - The index of the task to edit
	 * @param {string} taskDescription - The new task value
	 * @throws {Error} If user has no tasks
	 * @returns {Task} The edited task
	 */
	editUserTask(username, taskIndex, taskDescription) {
		const user = this.getUser(username);
		if (!user) {
			throw new Error(`${username} has no tasks`);
		}
		const task = user.editTask(taskIndex, taskDescription);
		this.#commitToLocalStorage();
		return task;
	}

	/**
	 * Mark the user tasks as complete
	 * @param {string} username - The username of the user
	 * @param {number | number[]} indices - The index of the task to complete
	 * @throws {Error} If user has no tasks
	 * @returns {Task[]} The description of the completed task
	 */
	completeUserTasks(username, indices) {
		const user = this.getUser(username);
		if (!user) {
			throw new Error(`${username} has no tasks`);
		}
		const items = [].concat(indices);
		const tasks = items.map((i) => user.completeTask(i));
		this.#commitToLocalStorage();
		return tasks;
	}

	/**
	 * Delete the user tasks
	 * @param {string} username - The username of the user
	 * @param {number | number[]} indices - The index of the task to delete
	 * @throws {Error} If user has no tasks
	 * @returns {Task[]} The deleted task description
	 */
	deleteUserTasks(username, indices) {
		const user = this.getUser(username);
		if (!user) {
			throw new Error(`${username} has no tasks`);
		}
		const items = [].concat(indices);
		const tasks = user.deleteTask(items);
		this.#commitToLocalStorage();
		return tasks;
	}

	/**
	 * Get incomplete tasks from a user
	 * @param {string} username - The username of the user
	 * @throws {Error} If the user has no tasks
	 * @returns {string[]} The incomplete tasks of the user
	 */
	checkUserTasks(username) {
		const user = this.getUser(username);
		if (!user) {
			throw new Error(`${username} has no tasks`);
		}
		return user
			.getTasks()
			.filter((task) => !task.isComplete())
			.map((task) => task.description);
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
	 * @throws {Error} If the user is not found
	 * @returns {User} The deleted user
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

/**
 * Returns a list of test users
 * @returns {User[]} The test user list
 */
function loadTestUsers() {
	const testUserList = [];
	const colorOptions = [
		"red",
		"coral",
		"springGreen",
		"lightSeaGreen",
		"slateBlue",
		"hotpink",
		"violet",
		"orange",
		"darkTurquoise",
		"dodgerblue",
		"blueviolet",
	];
	for (let i = 1; i <= 10; i++) {
		const userName = `Username${i}`;
		const userColor = colorOptions[i - 1];
		const user = new User(userName, { userColor });
		user.addTask(
			new Task(`Task 1 for testing propose`, `${generateTimeStamp()}`)
		).setCompletionStatus(true);
		user.addTask(
			new Task(`Task 2 for testing propose`, `${generateTimeStamp()}`)
		).setCompletionStatus(true);
		user.addTask(
			new Task(
				`Task 3 with a longer description for testing with length`,
				`${generateTimeStamp()}`
			)
		);
		testUserList.push(user);
	}

	function generateTimeStamp() {
		const randomNum = Math.floor(Math.random() * 10000000000);
		return `${randomNum}`;
	}

	return testUserList;
}
