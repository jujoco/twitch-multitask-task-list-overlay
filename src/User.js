const Task = require("./Task");

/**
 * @class User
 * @property {string} username - The username of the user
 * @property {Task[]} tasks - The tasks of the user
 * @method addTask - Add a task to the user
 * @method getTask - Get the task at the specified index
 * @method getTasks - Get the tasks of the user
 * @method updateTask - Update the task at the specified index
 * @method completeTask - Mark the task at the specified index as complete
 * @method deleteTask - Delete the task at the specified index
 * @method getTaskCount - Get the number of tasks the user has
 * @method validateTaskIndex - Validates the task index
 */
class User {
	/**
	 * @constructor
	 * @param {string} username - The username of the user
	 */
	constructor(username) {
		this.username = username;
		this.tasks = [];
	}

	/**
	 * Add a task to the user
	 * @param {string} task - The task to add
	 * @returns {void}
	 */
	addTask(task) {
		const newTask = new Task(task);
		this.tasks.push(newTask);
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
	 * Update the task at the specified index
	 * @param {number} index - The index of the task to get
	 * @param {string} message - The new message for the task
	 * @throws {Error} If the index is out of bounds
	 * @returns {void}
	 */
	updateTask(index, message) {
		this.validateTaskIndex(index);
		let task = this.getTask(index);
		task.setDescription(message);
	}

	/**
	 * Mark the task at the specified index as complete
	 * @param {number} index - The index of the task to complete
	 * @throws {Error} If the index is out of bounds
	 * @returns {void}
	 */
	completeTask(index) {
		this.validateTaskIndex(index);
		let task = this.getTask(index);
		task.setCompletionStatus(true);
	}

	/**
	 * Delete the task at the specified index
	 * @param {number} index - The index of the task to delete
	 * @throws {Error} If the index is out of bounds
	 * @returns {void}
	 */
	deleteTask(index) {
		this.validateTaskIndex(index);
		let tasks = this.getTasks();
		tasks.splice(index, 1);
	}

	/**
	 * Get the count of tasks
	 * @returns {number} The number of tasks the user has
	 */
	getTaskCount() {
		return this.tasks.length;
	}

	/**
	 * Validates the task index.
	 * @param {number} index - The index of the task.
	 * @throws {Error} If the index is out of bounds.
	 */
	validateTaskIndex(index) {
		if (index < 0 || index >= this.getTaskCount()) {
			throw new Error("Task Index out of bounds");
		}
	}
}
module.exports = User;
