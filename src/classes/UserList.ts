import Task from './Task.js';
import User from './User.js';

interface StoredTask {
	description: string;
	completionStatus: boolean;
	focusStatus: boolean;
}

interface StoredUser {
	username: string;
	userColor: string;
	tasks: StoredTask[];
}

export default class UserList {
	#localStoreName: string;
	users: User[];
	tasksCompleted: number;
	totalTasks: number;

	constructor(localStoreName = 'userList') {
		this.#localStoreName = localStoreName;
		this.tasksCompleted = 0;
		this.totalTasks = 0;
		this.users = this.#loadUserListFromLocalStorage();
	}

	#loadUserListFromLocalStorage(): User[] {
		const userList: User[] = [];
		const lStore = localStorage.getItem(this.#localStoreName);

		if (lStore) {
			(JSON.parse(lStore) as StoredUser[]).forEach((lsUser) => {
				const user = new User(lsUser.username, {
					userColor: lsUser.userColor,
				});
				lsUser.tasks.forEach((task) => {
					const newTask = user.addTask(new Task(task.description));
					this.totalTasks++;
					if (task.completionStatus) {
						newTask.setCompletionStatus(task.completionStatus);
						this.tasksCompleted++;
					}
					if (task.focusStatus) {
						newTask.setFocusStatus(task.focusStatus);
					}
				});
				userList.push(user);
			});
		} else {
			localStorage.setItem(this.#localStoreName, JSON.stringify(userList));
		}
		return userList;
	}

	#commitToLocalStorage(): void {
		localStorage.setItem(this.#localStoreName, JSON.stringify(this.users));
	}

	getUser(username: string): User | undefined {
		return this.users.find((user) => user.username === username);
	}

	getAllUsers(): User[] {
		return this.users;
	}

	createUser(username: string, options?: { userColor?: string }): User {
		if (this.getUser(username)) {
			throw new Error(`${username} already exists`);
		}
		const user = new User(username, options);
		this.users.push(user);
		return user;
	}

	addUserTasks(username: string, taskDescriptions: string | string[]): Task[] {
		const user = this.getUser(username);
		if (!user) {
			throw new Error(`${username} does not exist`);
		}
		const descriptions = [taskDescriptions].flat();
		const tasks: Task[] = [];
		descriptions.forEach((taskDesc) => {
			tasks.push(user.addTask(new Task(taskDesc)));
			this.totalTasks++;
		});
		this.#commitToLocalStorage();
		return tasks;
	}

	editUserTask(username: string, taskIndex: number, taskDescription: string): Task {
		const user = this.getUser(username);
		if (!user) {
			throw new Error(`${username} has no tasks`);
		}
		const task = user.editTask(taskIndex, taskDescription);
		if (!task) {
			throw new Error(`Task ${taskIndex} not found`);
		}
		this.#commitToLocalStorage();
		return task;
	}

	focusUserTask(username: string, taskIndex: number): Task {
		const user = this.getUser(username);
		if (!user) {
			throw new Error(`User ${username} not found`);
		}
		const task = user.setFocusedTask(taskIndex);
		if (!task) {
			throw new Error(`Task ${taskIndex} not found`);
		}
		this.#commitToLocalStorage();
		return task;
	}

	completeUserTasks(username: string, indices: number | number[]): Task[] {
		const user = this.getUser(username);
		if (!user) {
			throw new Error(`User ${username} not found`);
		}
		const tasks = [indices].flat().reduce<Task[]>((acc, curr) => {
			const task = user.getTask(curr);
			if (!task) return acc;
			if (!task.isComplete()) {
				task.setCompletionStatus(true);
				this.tasksCompleted++;
			}
			acc.push(task);
			return acc;
		}, []);
		this.#commitToLocalStorage();
		return tasks;
	}

	deleteUserTasks(username: string, indices: number | number[]): Task[] {
		const user = this.getUser(username);
		if (!user) {
			throw new Error(`User ${username} not found`);
		}
		const items = [indices].flat();
		const tasks = user.deleteTask(items);
		if (user.getTasks().length === 0) {
			this.deleteUser(username);
		}
		this.decreaseTaskCount(tasks);
		this.#commitToLocalStorage();
		return tasks;
	}

	checkUserTasks(username: string, status = 'incomplete'): Map<number, Task> {
		const user = this.getUser(username);
		if (!user) {
			return new Map();
		}
		const map = new Map<number, Task>();
		user.getTasks().forEach((task, i) => {
			if (status === 'incomplete' && !task.isComplete()) {
				map.set(i, task);
			}
			if (status === 'complete' && task.isComplete()) {
				map.set(i, task);
			}
		});
		return map;
	}

	clearUserList(): void {
		this.users = [];
		this.tasksCompleted = 0;
		this.totalTasks = 0;
		this.#commitToLocalStorage();
	}

	clearDoneTasks(): Task[] {
		let tasks: Task[] = [];
		// loop over in reverse to avoid index shifting
		for (let i = this.users.length - 1; i >= 0; i--) {
			const user = this.users[i];
			const removedTasks = user.removeCompletedTasks();
			tasks = tasks.concat(removedTasks);

			// remove user if no tasks left
			if (user.getTasks().length === 0) {
				this.users.splice(i, 1);
			}
		}
		this.decreaseTaskCount(tasks);
		this.#commitToLocalStorage();
		return tasks;
	}

	deleteUser(username: string): User {
		const userIndex = this.users.findIndex((user) => {
			const regex = RegExp(`^${username}`, 'i');
			return regex.test(user.username);
		});
		if (userIndex === -1) {
			throw new Error(`${username} not found`);
		}
		const user = this.users[userIndex];
		const deletedUser = this.users.splice(userIndex, 1)[0];
		this.decreaseTaskCount(deletedUser.getTasks());
		this.#commitToLocalStorage();
		return user;
	}

	decreaseTaskCount(removedTasks: Task[]): void {
		removedTasks.forEach((t) => {
			if (t.isComplete()) {
				this.tasksCompleted--;
			}
			this.totalTasks--;
		});
	}
}
