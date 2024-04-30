import { beforeEach, describe, expect, it, test } from "vitest";
import { chatHandler } from "../src/chatHandler";

describe("chatHandler", () => {
	/** @typedef {import('../src/classes/UserList').default} UserList */
	/** @type UserList */
	const userList = window.userList;
	const adminUser = {
		username: "bobTheAdmin",
		flags: {
			broadcaster: true,
			mod: false,
		},
		extra: { color: "#FF0000" },
		command: {
			CLEARLIST: "clearList",
			CLEARDONE: "clearDone",
			CLEARUSER: "clearUser",
		},
	};
	const chatUser = {
		username: "joeTheUser",
		flags: {
			broadcaster: false,
			mod: false,
		},
		extra: { color: "#00FFFF" },
		command: {
			ADDTASK: "addTask",
			EDITTASK: "editTask",
			DONETASK: "doneTask",
			DELETETASK: "deleteTask",
			CHECKTASK: "checkTask",
			HELP: "help",
			ADDITIONAL: "credit",
		},
	};

	beforeEach(() => {
		userList.clearUserList();
		userList.createUser("joeTheUser", { userColor: "#00FFFF" });
		userList.addUserTasks("joeTheUser", ["task1", "task2"]);
		userList.completeUserTasks("joeTheUser", 0);

		userList.createUser("bobTheAdmin", { userColor: "#FF0000" });
		userList.addUserTasks("bobTheAdmin", ["task1", "task2"]);
	});

	describe("Admin commands", () => {
		describe("!clearList", () => {
			it("should return a success message when an Admin user submits !clearList ", () => {
				const response = chatHandler(
					adminUser.username,
					adminUser.command.CLEARLIST,
					"",
					adminUser.flags,
					adminUser.extra
				);
				expect(userList.users.length).toBe(0);
				expect(response).toBe(
					"bobTheAdmin, All tasks have been cleared"
				);
			});

			it("should return a error message when an non-Admin user submits !clearList ", () => {
				const response = chatHandler(
					chatUser.username,
					adminUser.command.CLEARLIST,
					"",
					chatUser.flags,
					chatUser.extra
				);
				expect(userList.users.length).toBe(2);
				expect(response).toBe(
					'joeTheUser, Invalid command: "command not found" - Try !help'
				);
			});
		});

		test("!clearDone", () => {
			const response = chatHandler(
				adminUser.username,
				adminUser.command.CLEARDONE,
				"",
				adminUser.flags,
				adminUser.extra
			);
			expect(userList.users[0].getTasks().length).toBe(1);
			expect(response).toBe(
				"bobTheAdmin, All done tasks have been cleared"
			);
		});

		test("!clearUser", () => {
			const response = chatHandler(
				adminUser.username,
				adminUser.command.CLEARUSER,
				chatUser.username,
				adminUser.flags,
				adminUser.extra
			);
			expect(userList.users.length).toBe(1);
			expect(response).toBe(
				"bobTheAdmin, All tasks for joeTheUser have been cleared"
			);
		});
	});

	describe("User commands", () => {
		describe("Invalid command", () => {
			it("should return an error message if the command is not found", () => {
				const response = chatHandler(
					chatUser.username,
					"invalidCommand",
					"",
					chatUser.flags,
					chatUser.extra
				);
				expect(response).toBe(
					'joeTheUser, Invalid command: "command not found" - Try !help'
				);
			});
		});

		describe("!addTask", () => {
			it("should return a success message showing the added tasks", () => {
				const response = chatHandler(
					chatUser.username,
					chatUser.command.ADDTASK,
					"newTask",
					chatUser.flags,
					chatUser.extra
				);
				expect(userList.users[0].getTasks().length).toBe(3);
				expect(response).toBe('Task(s) "newTask" added, joeTheUser!');
			});

			it("should accept multiple, comma separated, tasks", () => {
				const response = chatHandler(
					chatUser.username,
					chatUser.command.ADDTASK,
					"newTask, newTask2",
					chatUser.flags,
					chatUser.extra
				);
				expect(userList.users[0].getTasks().length).toBe(4);
				expect(response).toBe(
					'Task(s) "newTask, newTask2" added, joeTheUser!'
				);
			});

			it("should return error message if the user over assigns tasks", () => {
				const response = chatHandler(
					chatUser.username,
					chatUser.command.ADDTASK,
					"newTask, newTask2, newTask3, newTask4, newTask5",
					chatUser.flags,
					chatUser.extra
				);
				expect(userList.users[0].getTasks().length).toBe(2);
				expect(response).toBe(
					"joeTheUser, maximum number of tasks reached, try removing some first."
				);
			});

			it("should return an error message if the message is empty", () => {
				const response = chatHandler(
					chatUser.username,
					chatUser.command.ADDTASK,
					"",
					chatUser.flags,
					chatUser.extra
				);
				expect(response).toBe(
					'joeTheUser, Invalid command: "Task description is empty" - Try !help'
				);
			});
		});

		describe("!editTask", () => {
			it("should return a message indicating the edited task number", () => {
				const response = chatHandler(
					chatUser.username,
					chatUser.command.EDITTASK,
					"2 editedTask",
					chatUser.flags,
					chatUser.extra
				);
				expect(
					userList
						.getUser(chatUser.username)
						.getTask(1)
						.getDescription()
				).toBe("editedTask");
				expect(response).toBe('Task "2" updated, joeTheUser!');
			});

			it("should return an error message if the message is empty", () => {
				const response = chatHandler(
					chatUser.username,
					chatUser.command.EDITTASK,
					"",
					chatUser.flags,
					chatUser.extra
				);
				expect(response).toBe(
					'joeTheUser, Invalid command: "Task number or description format is invalid" - Try !help'
				);
			});

			it("should return an error message if the task number is missing", () => {
				const response = chatHandler(
					chatUser.username,
					chatUser.command.EDITTASK,
					"edited Task",
					chatUser.flags,
					chatUser.extra
				);
				expect(response).toBe(
					'joeTheUser, Invalid command: "Task number or description format is invalid" - Try !help'
				);
			});

			it("should return an error message if task description is missing", () => {
				const response = chatHandler(
					chatUser.username,
					chatUser.command.EDITTASK,
					"2",
					chatUser.flags,
					chatUser.extra
				);
				expect(response).toBe(
					'joeTheUser, Invalid command: "Task number or description format is invalid" - Try !help'
				);
			});
		});

		describe("!doneTask", () => {
			it("should return a success message when marking task as done", () => {
				const response = chatHandler(
					chatUser.username,
					chatUser.command.DONETASK,
					"1",
					chatUser.flags,
					chatUser.extra
				);
				expect(
					userList
						.getUser(chatUser.username)
						.getTasks()[0]
						.isComplete()
				).toBe(true);
				expect(response).toBe(
					'Good job on finishing "task1" joeTheUser!'
				);
			});

			it("should return an error message if the task is not found", () => {
				const response = chatHandler(
					chatUser.username,
					chatUser.command.DONETASK,
					"3",
					chatUser.flags,
					chatUser.extra
				);
				expect(userList.users[0].getTasks().length).toBe(2);
				expect(response).toBe(
					'joeTheUser, Invalid command: "Task index out of bounds" - Try !help'
				);
			});
		});

		describe("!deleteTask", () => {
			it("should return a message indicating the task has been delete", () => {
				const response = chatHandler(
					chatUser.username,
					chatUser.command.DELETETASK,
					"1",
					chatUser.flags,
					chatUser.extra
				);
				expect(userList.users[0].getTasks().length).toBe(1);
				expect(response).toBe(
					'Task "task1" has been deleted, joeTheUser!'
				);
			});

			it("should return an error message if the task is not found", () => {
				const response = chatHandler(
					chatUser.username,
					chatUser.command.DELETETASK,
					"3",
					chatUser.flags,
					chatUser.extra
				);
				expect(userList.users[0].getTasks().length).toBe(2);
				expect(response).toBe(
					'joeTheUser, Invalid command: "Task index out of bounds" - Try !help'
				);
			});
		});

		describe("!checkTask", () => {
			it("should return a message listing user's uncompleted tasks", () => {
				const response = chatHandler(
					chatUser.username,
					chatUser.command.CHECKTASK,
					"",
					chatUser.flags,
					chatUser.extra
				);
				expect(response).toBe(
					'Your current task is: "task2", joeTheUser'
				);
			});

			it("should return a message if no tasks are found", () => {
				userList.completeUserTasks("joeTheUser", 1);
				const response = chatHandler(
					chatUser.username,
					chatUser.command.CHECKTASK,
					"",
					chatUser.flags,
					chatUser.extra
				);
				expect(response).toBe(
					"Looks like you don't have a task up there joeTheUser"
				);
			});
		});

		describe("!help", () => {
			it("should return a helpful message", () => {
				const response = chatHandler(
					chatUser.username,
					chatUser.command.HELP,
					"",
					chatUser.flags,
					chatUser.extra
				);
				expect(response).toBe(
					"Try using these commands - !add !edit !done !delete"
				);
			});
		});

		describe("!credit", () => {
			it("should return info about the task bot", () => {
				const response = chatHandler(
					chatUser.username,
					chatUser.command.ADDITIONAL,
					"",
					chatUser.flags,
					chatUser.extra
				);
				expect(response).toBe(
					"Jujoco is the creator of this bot, check out his Twitch at: https://www.twitch.tv/JujocoCS"
				);
			});
		});
	});
});
