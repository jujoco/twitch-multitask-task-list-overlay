/**
 * @class Task
 * @property {string} description - The description of the task.
 * @property {boolean} completionStatus - Indicates whether the task is complete or not.
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
		this.description = description;
		this.completionStatus = false;
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
		if (typeof description !== "string") {
			throw new Error("Description must be a string");
		}
		this.description = description;
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
			throw new Error("Status must be a boolean");
		}
		this.completionStatus = status;
	}
}
module.exports = Task;
