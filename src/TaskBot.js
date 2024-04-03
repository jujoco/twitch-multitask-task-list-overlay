/** @typedef {import('./UserList').UserList} UserList */

/**
 * @class TaskBot
 * @method addTask - Add a task to the list
 * @method editTask - Edit a task in the list
 * @method completeTask - Mark a task as complete
 * @method deleteTask - Delete a task from the list
 * @method checkTask - Check existing incomplete tasks in the list
 */
class TaskBot {
	/**
	 * @param {UserList} list
	 */
	constructor(list) {
		this.list = list;
	}

	addTask(username, taskDescription) {
		this.list.dispatch("ADD_USER_TASK", { username, taskDescription });
	}

	editTask(username, taskIndex, taskDescription) {
		this.list.dispatch("EDIT_USER_TASK", {
			username,
			taskIndex,
			taskDescription,
		});
	}

	completeTask(username, taskIndex) {
		this.list.dispatch("COMPLETE_USER_TASK", { username, taskIndex });
	}

	deleteTask(username, taskIndex) {
		this.list.dispatch("DELETE_USER_TASK", { username, taskIndex });
	}

	checkTask(username) {
		this.list.dispatch("CHECK_USER_TASK", { username });
	}
}
module.exports = TaskBot;
