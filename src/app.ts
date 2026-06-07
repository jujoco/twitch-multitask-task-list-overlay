import { animateScroll } from './animations/animateScroll.js';
import { fadeInOutText } from './animations/fadeCommands.js';
import type Task from './classes/Task.js';
import type User from './classes/User.js';
import UserList from './classes/UserList.js';
import { loadStyles } from './styleLoader.js';
import { timerAudioEl } from './Timer.js';
import type { CommandExtra, CommandFlags } from './twitch/types.js';

interface ChatResponse {
	error: boolean;
	message: string;
}

export default class App {
	userList: UserList;
	#timerIntervalId: number | null = null;
	#languageCode: string;
	#maxTasksPerUser: number;
	#headerFeature: string;
	#headerCustomText: string;

	constructor(storeName: string) {
		this.userList = new UserList(storeName);
		loadStyles(_styles);
		this.#languageCode = _settings.languageCode;
		this.#maxTasksPerUser = _settings.maxTasksPerUser;
		this.#headerFeature = _settings.headerFeature;
		this.#headerCustomText = _settings.headerCustomText;
	}

	render(): void {
		this.renderTaskList();
		this.renderTaskHeader();
	}

	renderTaskList(): void {
		if (this.userList.users.length === 0) {
			return;
		}
		const fragment = document.createDocumentFragment();
		this.userList.getAllUsers().forEach((user) => {
			const cardEl = createUserCard(user);
			const list = cardEl.querySelector('ol');
			user.tasks.forEach((task) => {
				const listItem = document.createElement('li');
				listItem.classList.add('task');
				listItem.dataset.taskId = `${task.id}`;
				listItem.innerText = task.description;
				if (task.isComplete()) {
					listItem.classList.add('done');
				}
				if (task.isFocused()) {
					listItem.classList.add('focus');
				}
				list?.appendChild(listItem);
			});
			fragment.appendChild(cardEl);
		});
		const primaryClone = fragment.cloneNode(true);
		const primaryContainer = document.querySelector('.task-container.primary');
		if (primaryContainer) {
			primaryContainer.innerHTML = '';
			primaryContainer.appendChild(primaryClone);
		}

		const secondaryClone = fragment.cloneNode(true);
		const secondaryContainer = document.querySelector('.task-container.secondary');
		if (secondaryContainer) {
			secondaryContainer.innerHTML = '';
			secondaryContainer.appendChild(secondaryClone);
		}

		animateScroll();
	}

	renderTaskHeader(): void {
		this.renderTaskCount();
		if (this.#headerFeature.toLowerCase() === 'timer') {
			this.renderTimer();
		} else if (this.#headerFeature.toLowerCase() === 'commands') {
			this.renderCommandTips();
		} else if (this.#headerFeature.toLowerCase() === 'text') {
			this.renderCustomText(this.#headerCustomText);
		}
	}

	renderTaskCount(): void {
		const completedTasksCount = this.userList.tasksCompleted;
		const totalTasksCount = this.userList.totalTasks;
		const totalTasksElement = document.querySelector<HTMLElement>('.task-count');
		if (totalTasksElement) {
			totalTasksElement.innerText = `${completedTasksCount}/${totalTasksCount}`;
		}
	}

	renderTimer(): void {
		const timerEl = document.querySelector('.timer');
		timerEl?.classList.remove('hidden');
	}

	startTimer(FocusDuration = 0, breakDuration = 10): void {
		if (this.#timerIntervalId) clearInterval(this.#timerIntervalId);
		const timerEl = document.querySelector('.timer');
		if (!timerEl) return;
		const timerTitleEl = timerEl.querySelector<HTMLElement>('.timer-title');
		const timerElement = timerEl.querySelector('.timer-countdown');
		if (!timerTitleEl || !timerElement) return;
		let timer = FocusDuration * 60;
		fadeInOutText(timerTitleEl, 'Focus');
		let firstPass = true;
		const updateTimer = () => {
			const minutes = Math.floor(timer / 60)
				.toString()
				.padStart(2, '0');
			const seconds = (timer % 60).toString().padStart(2, '0');
			timerElement.textContent = `${minutes}:${seconds}`;
			if (timer === 0) {
				if (this.#timerIntervalId) clearInterval(this.#timerIntervalId);
				fadeInOutText(timerTitleEl, 'Break');
				timerElement.textContent = '00:00';
				timerAudioEl.play();
				timer = breakDuration * 60;
				if (firstPass) {
					this.#timerIntervalId = setInterval(updateTimer, 1000);
					firstPass = false;
				}
			} else {
				timer--;
			}
		};
		this.#timerIntervalId = setInterval(updateTimer, 1000);
	}

	renderCommandTips(): void {
		const tips = ['!task', '!edit', '!done', '!delete', '!check', '!help'];
		const commandTipEl = document.querySelector('.command-tips');
		if (!commandTipEl) return;
		commandTipEl.classList.remove('hidden');
		let tipIdx = 0;
		setInterval(() => {
			const commandCodeEl = commandTipEl.querySelector<HTMLElement>('.command-code');
			if (commandCodeEl) {
				fadeInOutText(commandCodeEl, tips[tipIdx]);
			}
			tipIdx = (tipIdx + 1) % tips.length;
		}, 6000);
	}

	renderCustomText(text: string): void {
		document.querySelector('.custom-header')?.classList.remove('hidden');
		const customText = document.querySelector('.custom-text');
		if (customText) {
			customText.textContent = text;
		}
	}

	chatHandler(
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
			// ADMIN COMMANDS
			if (isMod(flags)) {
				if (
					this.#headerFeature.toLowerCase() === 'timer' &&
					_adminConfig.commands.timer.includes(command)
				) {
					const [focusTime, breakTime] = message.split('/');
					const focusDuration = parseInt(focusTime, 10);
					const breakDuration = parseInt(breakTime, 10) || 10;
					if (
						Number.isNaN(focusDuration) ||
						focusDuration < 0 ||
						Number.isNaN(breakDuration) ||
						breakDuration < 0
					) {
						throw new Error('Invalid timer duration');
					}
					this.startTimer(focusDuration, breakDuration);
					template = `${_adminConfig.responseTo[this.#languageCode].timer} ⏲️`;
					responseDetail = focusTime;
					return respondMessage(template, username, responseDetail);
				} else if (_adminConfig.commands.clearList.includes(command)) {
					this.userList.clearUserList();
					this.clearListFromDOM();
					template = _adminConfig.responseTo[this.#languageCode].clearList;
					return respondMessage(template, username, responseDetail);
				} else if (_adminConfig.commands.clearDone.includes(command)) {
					const tasks = this.userList.clearDoneTasks();
					tasks.forEach(({ id }) => {
						this.deleteTaskFromDOM(id);
					});
					template = _adminConfig.responseTo[this.#languageCode].clearDone;
					return respondMessage(template, username, responseDetail);
				} else if (_adminConfig.commands.clearUser.includes(command)) {
					const user = this.userList.deleteUser(message);
					this.deleteUserFromDOM(user);
					responseDetail = user.username;
					template = _adminConfig.responseTo[this.#languageCode].clearUser;
					return respondMessage(template, username, responseDetail);
				}
			}

			// USER COMMANDS
			if (_userConfig.commands.addTask.includes(command)) {
				// ADD TASK
				if (message === '') {
					throw new Error('Task description is empty');
				}
				const user =
					this.userList.getUser(username) ||
					this.userList.createUser(username, {
						userColor: extra.userColor,
					});

				const taskDescriptions = message.split(', ');
				if (
					user.getTasks().length + taskDescriptions.length >
					parseInt(this.#maxTasksPerUser.toString(), 10)
				) {
					template = _userConfig.responseTo[this.#languageCode].maxTasksAdded;
				} else {
					const tasks = this.userList.addUserTasks(username, taskDescriptions);
					tasks.forEach((task) => {
						this.addTaskToDOM(user, task);
					});
					responseDetail = taskDescriptions
						.map((task) => `📝 "${task}"`)
						.join(', ')
						.replace(/,([^,]*)$/, ' &$1');
					template = _userConfig.responseTo[this.#languageCode].addTask;
				}
			} else if (_userConfig.commands.editTask.includes(command)) {
				// EDIT TASK
				const whiteSpaceIdx = message.search(/(?<=\d)\s/); // number followed by space
				if (whiteSpaceIdx === -1) {
					throw new Error('Task number or description format is invalid');
				}
				const taskNumber = message.slice(0, whiteSpaceIdx);
				const newDescription = message.slice(whiteSpaceIdx + 1);
				const task = this.userList.editUserTask(
					username,
					parseTaskIndex(taskNumber),
					newDescription,
				);
				this.editTaskFromDOM(task);
				responseDetail = taskNumber;
				template = _userConfig.responseTo[this.#languageCode].editTask;
			} else if (_userConfig.commands.focusTask.includes(command)) {
				// FOCUS TASK
				const taskIndex = parseTaskIndex(message);
				const task = this.userList.focusUserTask(username, taskIndex);
				this.focusTaskFromDOM(username, task.id);
				responseDetail = (taskIndex + 1).toString();
				template = _userConfig.responseTo[this.#languageCode].focusTask;
			} else if (_userConfig.commands.finishTask.includes(command)) {
				// COMPLETE/DONE TASK
				const indices = message.split(',').reduce<number[]>((acc, i) => {
					if (parseTaskIndex(i) >= 0) acc.push(parseTaskIndex(i));
					return acc;
				}, []);
				const tasks = this.userList.completeUserTasks(username, indices);
				tasks.forEach(({ id }) => {
					this.completeTaskFromDOM(id);
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
				// DELETE/REMOVE TASK
				responseDetail = message;
				if (message.toLowerCase() === 'all') {
					const user = this.userList.deleteUser(username);
					this.deleteUserFromDOM(user);
					template = _userConfig.responseTo[this.#languageCode].deleteAll;
				} else {
					const indices = message.split(',').reduce<number[]>((acc, i) => {
						if (parseTaskIndex(i) >= 0) acc.push(parseTaskIndex(i));
						return acc;
					}, []);
					const tasks = this.userList.deleteUserTasks(username, indices);
					tasks.forEach(({ id }) => {
						this.deleteTaskFromDOM(id);
					});
					if (tasks.length === 0) {
						template = _userConfig.responseTo[this.#languageCode].noTaskFound;
					} else {
						template = _userConfig.responseTo[this.#languageCode].deleteTask;
					}
				}
			} else if (_userConfig.commands.check.includes(command)) {
				// CHECK TASKS
				const taskMap = this.userList.checkUserTasks(username);
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
				// HELP COMMAND
				template = _userConfig.responseTo[this.#languageCode].help;
			} else if (_userConfig.commands.additional.includes(command)) {
				// ADDITIONAL COMMANDS
				template = _userConfig.responseTo[this.#languageCode].additional;
			} else {
				// INVALID COMMAND
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

	clearListFromDOM(): void {
		const primaryContainer = document.querySelector('.task-container.primary');
		const secondaryContainer = document.querySelector('.task-container.secondary');
		if (primaryContainer) primaryContainer.innerHTML = '';
		if (secondaryContainer) secondaryContainer.innerHTML = '';
		this.renderTaskCount();
		animateScroll();
	}

	addTaskToDOM(user: User, task: Task): void {
		const primaryContainer = document.querySelector('.task-container.primary');
		const secondaryContainer = document.querySelector('.task-container.secondary');
		if (!primaryContainer || !secondaryContainer) return;
		const userCardEls = document.querySelectorAll(`[data-user="${user.username}"]`);
		if (userCardEls.length === 0) {
			const userCard = createUserCard(user);
			const clonedUserCard = userCard.cloneNode(true);
			primaryContainer.appendChild(userCard);
			secondaryContainer.appendChild(clonedUserCard);
		}
		const taskElement = document.createElement('li');
		taskElement.classList.add('task');
		taskElement.dataset.taskId = `${task.id}`;
		taskElement.innerText = task.description;
		const cloneTaskElement = taskElement.cloneNode(true);

		primaryContainer
			.querySelector(`[data-user="${user.username}"] .tasks`)
			?.appendChild(taskElement);
		secondaryContainer
			.querySelector(`[data-user="${user.username}"] .tasks`)
			?.appendChild(cloneTaskElement);

		this.renderTaskCount();
		animateScroll();
	}

	editTaskFromDOM(task: Task): void {
		const taskElements = document.querySelectorAll<HTMLElement>(`[data-task-id="${task.id}"]`);
		for (const taskElement of taskElements) {
			taskElement.innerText = task.description;
		}
	}

	completeTaskFromDOM(taskId: string): void {
		const taskElements = document.querySelectorAll(`[data-task-id="${taskId}"]`);
		for (const taskElement of taskElements) {
			taskElement.classList.add('done');
			taskElement.classList.remove('focus');
		}
		this.renderTaskCount();
	}

	focusTaskFromDOM(username: string, taskId: string): void {
		document.querySelectorAll(`[data-user="${username}"] .task`).forEach((task) => {
			task.classList.remove('focus');
		});

		document.querySelectorAll(`[data-task-id="${taskId}"]`).forEach((task) => {
			task.classList.add('focus');
		});
	}

	deleteTaskFromDOM(taskId: string): void {
		const taskElements = document.querySelectorAll(`[data-task-id="${taskId}"]`);
		for (const taskElement of taskElements) {
			if (taskElement.parentElement?.children.length === 1) {
				// remove the user card if there is only one task
				taskElement.parentElement.parentElement?.remove();
			} else {
				taskElement.remove();
			}
		}
		this.renderTaskCount();
		animateScroll();
	}

	deleteUserFromDOM(user: User): void {
		// remove user card and reduce total tasks count
		const { username } = user;
		const userCardEls = document.querySelectorAll(`[data-user="${username}"]`);
		for (const card of userCardEls) {
			card.remove();
		}
		this.renderTaskCount();
		animateScroll();
	}
}

function respondMessage(
	template: string,
	username: string,
	message: string,
	error = false,
): ChatResponse {
	return {
		message:
			_settings.botResponsePrefix +
			template.replace('{user}', username).replace('{message}', message),
		error,
	};
}

function isMod(flags: CommandFlags): boolean {
	return flags.broadcaster || flags.mod;
}

function parseTaskIndex(index: string): number {
	return parseInt(index, 10) - 1;
}

function createUserCard({
	username,
	userColor,
}: {
	username: string;
	userColor: string;
}): HTMLDivElement {
	const cardEl = document.createElement('div');
	cardEl.classList.add('card');
	cardEl.dataset.user = username;
	const userNameDiv = document.createElement('div');
	userNameDiv.classList.add('username');
	userNameDiv.innerText = username;
	userNameDiv.style.color = _settings.showUsernameColor ? userColor : '';
	cardEl.appendChild(userNameDiv);
	const list = document.createElement('ol');
	list.classList.add('tasks');
	cardEl.appendChild(list);
	return cardEl;
}
