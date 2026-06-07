import type Task from './Task.js';

export default class User {
	username: string;
	userColor: string;
	tasks: Task[];

	constructor(username: string, options?: { userColor?: string }) {
		this.username = this.validateUsername(username);
		this.userColor = options?.userColor || '';
		this.tasks = [];
	}

	validateUsername(username: string): string {
		if (typeof username !== 'string') {
			throw new Error('Username must be of type string');
		}
		username = username.trim();
		if (username.length === 0) {
			throw new Error('Username invalid');
		}
		return username;
	}

	addTask(task: Task): Task {
		this.tasks.push(task);
		return task;
	}

	editTask(index: number, description: string): Task | null {
		const task = this.getTask(index);
		if (task) {
			task.setDescription(description);
			return task;
		}
		return null;
	}

	completeTask(index: number): Task | null {
		const task = this.getTask(index);
		if (task) {
			task.setCompletionStatus(true);
			return task;
		}
		return null;
	}

	setFocusedTask(index: number): Task | null {
		const task = this.getTask(index);
		if (task) {
			this.tasks.forEach((t) => {
				t.setFocusStatus(false);
			});
			task.setFocusStatus(true);
			return task;
		}
		return null;
	}

	deleteTask(indices: number | number[]): Task[] {
		const items = [indices].flat().filter((i) => {
			return this.validTaskIndex(i);
		});
		const taskForDeletion: Task[] = [];

		this.tasks = this.tasks.filter((task, i) => {
			if (items.includes(i)) {
				taskForDeletion.push(task);
				return false;
			}
			return true;
		});

		return taskForDeletion;
	}

	removeCompletedTasks(): Task[] {
		const removedTasks: Task[] = [];
		this.tasks = this.tasks.filter((task) => {
			if (task.isComplete()) {
				removedTasks.push(task);
				return false;
			}
			return true;
		});
		return removedTasks;
	}

	getTask(index: number): Task | null {
		return this.validTaskIndex(index) ? this.tasks[index] : null;
	}

	getTasks(): Task[] {
		return this.tasks;
	}

	validTaskIndex(index: number): boolean {
		if (
			typeof index !== 'number' ||
			Number.isNaN(index) ||
			index < 0 ||
			index >= this.tasks.length
		) {
			return false;
		}
		return true;
	}
}
