/** @typedef {import('./Task').default} Task */
/**
 * @class User
 * @property {string} username - The username of the user
 * @property {string} userColor - The color of the username
 * @property {Task[]} tasks - The tasks of the user
 * @method validateUsername - Validate the username of the user
 * @method addTask - Add tasks to the user
 * @method editTask - Edit the task at the specified index
 * @method completeTask - Mark the task at index as complete
 * @method setFocusedTask - Mark the task at index as focused
 * @method deleteTask - Delete the task at the specified index
 * @method removeCompletedTasks - Remove all completed tasks
 * @method getTask - Get the task at the specified index
 * @method getTasks - Get all tasks of the user
 * @method validTaskIndex - Validates the task index
 */
export default class User {
	/**
	 * @constructor
	 * @param {string} username - The username of the user
	 * @param {{userColor: string}} options - The username of the user
	 */
	constructor(username, options) {
		this.username = this.validateUsername(username);
		this.userColor = options?.userColor || "";
		this.tasks = [];
	}

	/**
	 * Validate the username of the user
	 * @param {string} username - The username of the user
	 * @returns {string} The username of the user
	 * @throws {Error} If the username is invalid
	 */
	validateUsername(username) {
		if (typeof username !== "string") {
			throw new Error("Username must be of type string");
		}
		username = username.trim();
		if (username.length === 0) {
			throw new Error("Username invalid");
		}
		return username;
	}

	/**
	 * Add a task to the user
	 * @param {Task} task - The Task to add
	 * @returns {Task} The Task that was added
	 */
	addTask(task) {
		this.tasks.push(task);
		return task;
	}

	/**
	 * Edit the task at the specified index
	 * @param {number} index - The index of the task to get
	 * @param {string} description - The new task description
	 * @returns {Task | null} The task that was edited
	 */
	editTask(index, description) {
		let task = this.getTask(index);
		if (task) {
			task.setDescription(description);
			return task;
		}
		return null;
	}

	/**
	 * Mark the task at the specified index as complete
	 * @param {number} index - The index of the task to complete
	 * @returns {Task | null} The task that was completed
	 */
	completeTask(index) {
		let task = this.getTask(index);
		if (task) {
			task.setCompletionStatus(true);
			return task;
		}
		return null;
	}

	/**
	 * Mark the task at the specified index as focused
	 * @param {number} index - The index of the task to focus
	 * @returns {Task | null} The task that was focused
	 */
	setFocusedTask(index) {
		let task = this.getTask(index);
		if (task) {
			this.tasks.forEach((t) => {
				t.setFocusStatus(false);
			});
			task.setFocusStatus(true);
			return task;
		}
		return null;
	}

	/**
	 * Delete the task at the specified index
	 * @param {number | number[]} indices - The indices of the tasks to delete
	 * @returns {Task[]}	The task that was deleted
	 */
	deleteTask(indices) {
		const items = [].concat(indices).filter((i) => {
			return this.validTaskIndex(i);
		});
		const taskForDeletion = [];

		this.tasks = this.tasks.filter((task, i) => {
			if (items.includes(i)) {
				taskForDeletion.push(task);
				return false;
			} else {
				return true;
			}
		});

		return taskForDeletion;
	}

	/**
	 * Remove all completed tasks
	 * @returns {Task[]} The tasks that were removed
	 */
	removeCompletedTasks() {
		const removedTasks = [];
		/** @type Task[] */
		this.tasks = this.tasks.filter((task) => {
			if (task.isComplete()) {
				removedTasks.push(task);
				return false;
			}
			return true;
		});
		return removedTasks;
	}

	/**
	 * Get the task at the specified index
	 * @param {number} index - The index of the task to get
	 * @returns {Task | null} The task at the specified index
	 */
	getTask(index) {
		return this.validTaskIndex(index) ? this.tasks[index] : null;
	}

	/**
	 * Get the tasks of the user
	 * @returns {Task[]} The tasks of the user
	 */
	getTasks() {
		return this.tasks;
	}

	/**
	 * Validates the task index.
	 * @param {number} index - The index of the task.
	 * @returns {boolean}
	 */
	validTaskIndex(index) {
		if (
			typeof index !== "number" ||
			isNaN(index) ||
			index < 0 ||
			index >= this.tasks.length
		) {
			return false;
		}
		return true;
	}
}
