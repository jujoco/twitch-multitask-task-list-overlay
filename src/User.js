const Task = require("./Task");

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
module.exports = User;
