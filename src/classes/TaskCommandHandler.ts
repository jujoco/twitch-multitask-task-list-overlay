import { type ChatResponse, isMod, respondMessage } from '../commandUtils.js';
import type { CommandExtra, CommandFlags } from '../twitch/types.js';
import type Task from './Task.js';
import type User from './User.js';
import type UserList from './UserList.js';

export interface TaskListView {
	clearListFromDOM(): void;
	addTaskToDOM(user: User, task: Task): void;
	editTaskFromDOM(task: Task): void;
	completeTaskFromDOM(taskId: string): void;
	focusTaskFromDOM(username: string, taskId: string): void;
	deleteTaskFromDOM(taskId: string): void;
	deleteUserFromDOM(user: User): void;
}

export default class TaskCommandHandler {
	#userList: UserList;
	#view: TaskListView;
	#languageCode: string;
	#maxTasksPerUser: number;

	constructor(userList: UserList, view: TaskListView) {
		this.#userList = userList;
		this.#view = view;
		this.#languageCode = _settings.languageCode;
		this.#maxTasksPerUser = _settings.maxTasksPerUser;
	}

	handle(
		username: string,
		command: string,
		message: string,
		flags: CommandFlags,
		extra: CommandExtra,
	): ChatResponse {
		command = `!${command.toLowerCase()}`;
		let template = '';
		let responseDetail = '';

		try {
			if (isMod(flags)) {
				if (_adminConfig.commands.clearList.includes(command)) {
					this.#userList.clearUserList();
					this.#view.clearListFromDOM();
					template = _adminConfig.responseTo[this.#languageCode].clearList;
					return respondMessage(template, username, responseDetail);
				} else if (_adminConfig.commands.clearDone.includes(command)) {
					const tasks = this.#userList.clearDoneTasks();
					tasks.forEach(({ id }) => {
						this.#view.deleteTaskFromDOM(id);
					});
					template = _adminConfig.responseTo[this.#languageCode].clearDone;
					return respondMessage(template, username, responseDetail);
				} else if (_adminConfig.commands.clearUser.includes(command)) {
					const user = this.#userList.deleteUser(message);
					this.#view.deleteUserFromDOM(user);
					responseDetail = user.username;
					template = _adminConfig.responseTo[this.#languageCode].clearUser;
					return respondMessage(template, username, responseDetail);
				}
			}

			if (_userConfig.commands.addTask.includes(command)) {
				if (message === '') {
					throw new Error('Task description is empty');
				}
				const user =
					this.#userList.getUser(username) ||
					this.#userList.createUser(username, {
						userColor: extra.userColor,
					});

				const taskDescriptions = message.split(', ');
				if (
					user.getTasks().length + taskDescriptions.length >
					parseInt(this.#maxTasksPerUser.toString(), 10)
				) {
					template = _userConfig.responseTo[this.#languageCode].maxTasksAdded;
				} else {
					const tasks = this.#userList.addUserTasks(username, taskDescriptions);
					tasks.forEach((task) => {
						this.#view.addTaskToDOM(user, task);
					});
					responseDetail = taskDescriptions
						.map((task) => `📝 "${task}"`)
						.join(', ')
						.replace(/,([^,]*)$/, ' &$1');
					template = _userConfig.responseTo[this.#languageCode].addTask;
				}
			} else if (_userConfig.commands.editTask.includes(command)) {
				const whiteSpaceIdx = message.search(/(?<=\d)\s/);
				if (whiteSpaceIdx === -1) {
					throw new Error('Task number or description format is invalid');
				}
				const taskNumber = message.slice(0, whiteSpaceIdx);
				const newDescription = message.slice(whiteSpaceIdx + 1);
				const task = this.#userList.editUserTask(
					username,
					parseTaskIndex(taskNumber),
					newDescription,
				);
				this.#view.editTaskFromDOM(task);
				responseDetail = taskNumber;
				template = _userConfig.responseTo[this.#languageCode].editTask;
			} else if (_userConfig.commands.focusTask.includes(command)) {
				const taskIndex = parseTaskIndex(message);
				const task = this.#userList.focusUserTask(username, taskIndex);
				this.#view.focusTaskFromDOM(username, task.id);
				responseDetail = (taskIndex + 1).toString();
				template = _userConfig.responseTo[this.#languageCode].focusTask;
			} else if (_userConfig.commands.finishTask.includes(command)) {
				const indices = message.split(',').reduce<number[]>((acc, i) => {
					if (parseTaskIndex(i) >= 0) acc.push(parseTaskIndex(i));
					return acc;
				}, []);
				const tasks = this.#userList.completeUserTasks(username, indices);
				tasks.forEach(({ id }) => {
					this.#view.completeTaskFromDOM(id);
				});
				if (tasks.length === 0) {
					template = _userConfig.responseTo[this.#languageCode].noTaskFound;
				} else {
					responseDetail = tasks
						.map((task) => `✅ "${task.description}"`)
						.join(', ')
						.replace(/,([^,]*)$/, ' &$1');
					template = _userConfig.responseTo[this.#languageCode].finishTask;
				}
			} else if (_userConfig.commands.deleteTask.includes(command)) {
				responseDetail = message;
				if (message.toLowerCase() === 'all') {
					const user = this.#userList.deleteUser(username);
					this.#view.deleteUserFromDOM(user);
					template = _userConfig.responseTo[this.#languageCode].deleteAll;
				} else {
					const indices = message.split(',').reduce<number[]>((acc, i) => {
						if (parseTaskIndex(i) >= 0) acc.push(parseTaskIndex(i));
						return acc;
					}, []);
					const tasks = this.#userList.deleteUserTasks(username, indices);
					tasks.forEach(({ id }) => {
						this.#view.deleteTaskFromDOM(id);
					});
					if (tasks.length === 0) {
						template = _userConfig.responseTo[this.#languageCode].noTaskFound;
					} else {
						template = _userConfig.responseTo[this.#languageCode].deleteTask;
					}
				}
			} else if (_userConfig.commands.check.includes(command)) {
				const taskMap = this.#userList.checkUserTasks(username);
				const list: string[] = [];
				for (const [taskNumber, task] of taskMap) {
					list.push(`📝 ${taskNumber + 1}. ${task.description}`);
				}
				responseDetail = list.join(' ');
				if (responseDetail === '') {
					template = _userConfig.responseTo[this.#languageCode].noTaskFound;
				} else {
					template = _userConfig.responseTo[this.#languageCode].check;
				}
			} else if (_userConfig.commands.help.includes(command)) {
				template = _userConfig.responseTo[this.#languageCode].help;
			} else if (_userConfig.commands.additional.includes(command)) {
				template = _userConfig.responseTo[this.#languageCode].additional;
			} else {
				throw new Error('command not found');
			}

			return respondMessage(template, username, responseDetail);
		} catch (error) {
			return respondMessage(
				_userConfig.responseTo[this.#languageCode].invalidCommand,
				username,
				error instanceof Error ? error.message : String(error),
				true,
			);
		}
	}
}

function parseTaskIndex(index: string): number {
	return parseInt(index, 10) - 1;
}
