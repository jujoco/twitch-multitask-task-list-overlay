import { animateScroll } from './animations/animateScroll.js';
import { fadeInOutText } from './animations/fadeCommands.js';
import PomodoroTimer from './classes/PomodoroTimer.js';
import type Task from './classes/Task.js';
import type { TaskListView } from './classes/TaskCommandHandler.js';
import type { TimerControls } from './classes/TimerCommandHandler.js';
import type User from './classes/User.js';
import UserList from './classes/UserList.js';
import { formatTemplate } from './format.js';
import { loadStyles } from './styleLoader.js';

export default class App implements TaskListView, TimerControls {
	userList: UserList;
	#pomodoroTimer: PomodoroTimer;
	#sayCallback: ((message: string) => void) | null = null;
	#languageCode: string;
	#headerFeature: string;
	#headerCustomText: string;

	constructor(storeName: string) {
		this.userList = new UserList(storeName);
		loadStyles(_styles);
		this.#languageCode = _settings.languageCode;
		this.#headerFeature = _settings.headerFeature;
		this.#headerCustomText = _settings.headerCustomText;
		this.#pomodoroTimer = new PomodoroTimer({
			onBreak: ({ session, total, breakLength }) =>
				this.#announce(_adminConfig.responseTo[this.#languageCode].pomoBreak, {
					session,
					total,
					break: breakLength,
				}),
			onSessionStart: ({ session, total, focusLength }) =>
				this.#announce(_adminConfig.responseTo[this.#languageCode].pomo, {
					session,
					total,
					duration: focusLength,
				}),
			onComplete: ({ total }) =>
				this.#announce(_adminConfig.responseTo[this.#languageCode].pomoComplete, { total }),
		});
	}

	setSayCallback(callback: (message: string) => void): void {
		this.#sayCallback = callback;
	}

	render(): void {
		this.#renderTaskList();
		this.#renderTaskHeader();
	}

	startTimer(focusDuration = 0, breakDuration = 10): void {
		this.#pomodoroTimer.startTimer(focusDuration, breakDuration);
	}

	startPomodoro(focusDuration: number, breakDuration: number, sessions: number): void {
		this.#pomodoroTimer.startPomodoro(focusDuration, breakDuration, sessions);
	}

	pause(): 'paused' | 'none' {
		return this.#pomodoroTimer.pause();
	}

	resume(): 'resumed' | 'none' {
		return this.#pomodoroTimer.resume();
	}

	clearListFromDOM(): void {
		const primaryContainer = document.querySelector('.task-container.primary');
		const secondaryContainer = document.querySelector('.task-container.secondary');
		if (primaryContainer) primaryContainer.innerHTML = '';
		if (secondaryContainer) secondaryContainer.innerHTML = '';
		this.#renderTaskCount();
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

		this.#renderTaskCount();
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
		this.#renderTaskCount();
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
		this.#renderTaskCount();
		animateScroll();
	}

	deleteUserFromDOM(user: User): void {
		// remove user card and reduce total tasks count
		const { username } = user;
		const userCardEls = document.querySelectorAll(`[data-user="${username}"]`);
		for (const card of userCardEls) {
			card.remove();
		}
		this.#renderTaskCount();
		animateScroll();
	}

	#renderTaskList(): void {
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

	#renderTaskHeader(): void {
		this.#renderTaskCount();
		if (this.#headerFeature.toLowerCase() === 'timer') {
			this.#renderTimer();
		} else if (this.#headerFeature.toLowerCase() === 'commands') {
			this.#renderCommandTips();
		} else if (this.#headerFeature.toLowerCase() === 'text') {
			this.#renderCustomText(this.#headerCustomText);
		}
	}

	#renderTaskCount(): void {
		const completedTasksCount = this.userList.tasksCompleted;
		const totalTasksCount = this.userList.totalTasks;
		const totalTasksElement = document.querySelector<HTMLElement>('.task-count');
		if (totalTasksElement) {
			totalTasksElement.innerText = `${completedTasksCount}/${totalTasksCount}`;
		}
	}

	#renderTimer(): void {
		this.#pomodoroTimer.reveal();
	}

	#renderCommandTips(): void {
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

	#renderCustomText(text: string): void {
		document.querySelector('.custom-header')?.classList.remove('hidden');
		const customText = document.querySelector('.custom-text');
		if (customText) {
			customText.textContent = text;
		}
	}

	#announce(template: string, replacements: Record<string, string | number>): void {
		this.#sayCallback?.(_settings.botResponsePrefix + formatTemplate(template, replacements));
	}
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
