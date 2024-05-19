/**
 * @class Task
 * @property {string} description - The description of the task.
 * @property {number} id - The id of the task.
 * @property {boolean} completionStatus - Indicates whether the task is complete or not.
 * @method validateDescription - Validate the description of the task.
 * @method setDescription - Set the description of the task.
 * @method isComplete - Get the completion status of the task.
 * @method setCompletionStatus - Set the status of the task.
 * @returns {Task}
 */
export default class Task {
	/**
	 * @constructor
	 * @param {string} description - The description of the task.
	 */
	constructor(description) {
		this.description = this.validateDescription(description);
		this.id = this.#assignId();
		this.completionStatus = false;
	}

	/**
	 * Validate the description of the task.
	 * @param {string} description - The description of the task.
	 * @returns {string} The description of the task.
	 * @throws {Error} If the description is invalid.
	 */
	validateDescription(description) {
		if (typeof description !== "string") {
			throw new Error(`Task description must be of type string`);
		}
		description = description.trim();
		if (description.length === 0) {
			throw new Error("Task description invalid");
		}
		return description;
	}

	/**
	 * Assign the current date as id to the task.
	 * @returns {string}
	 */
	#assignId() {
		const now = new Date();
		const day = String(now.getDate()).padStart(2, "0");
		const hour = String(now.getHours()).padStart(2, "0");
		const minute = String(now.getMinutes()).padStart(2, "0");
		const second = String(now.getSeconds()).padStart(2, "0");
		const millisecond = String(now.getMilliseconds()).padStart(3, "0");
		const salt = Math.floor(Math.random() * 10000);
		// format: DDHHMMSSMS + 4 digit salt
		return `${day}${hour}${minute}${second}${millisecond}${salt}`;
	}

	/**
	 * Set the description of the task.
	 * @param {string} description - The new description of the task.
	 * @return void
	 */
	setDescription(description) {
		this.description = this.validateDescription(description);
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
			throw new Error("Completion status must be of type boolean");
		}
		this.completionStatus = status;
	}
}
