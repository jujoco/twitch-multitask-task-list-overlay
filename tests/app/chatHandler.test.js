import { beforeEach, describe, expect, test, vi } from "vitest";
import App from "../../src/app";

describe("App.chatHandler", () => {
	describe("chatHandler", () => {
		const app = new App("TestStore");
		const userList = app.userList;
		app.renderTimer = vi.fn();
		app.startTimer = vi.fn();
		app.renderCommandTips = vi.fn();
		app.renderCustomText = vi.fn();
		app.clearListFromDOM = vi.fn();
		app.addTaskToDOM = vi.fn();
		app.editTaskFromDOM = vi.fn();
		app.completeTaskFromDOM = vi.fn();
		app.deleteTaskFromDOM = vi.fn();
		app.deleteUserFromDOM = vi.fn();

		const adminUser = {
			username: "bobTheAdmin",
			flags: {
				broadcaster: true,
				mod: false,
			},
			extra: {
				userColor: "#FF0000",
			},
			command: {
				TIMER: "timer",
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
			extra: { userColor: "#00FFFF" },
			command: {
				ADDTASK: "task",
				EDITTASK: "edit",
				DONETASK: "done",
				DELETETASK: "delete",
				CHECKTASK: "check",
				HELP: "help",
				ADDITIONAL: "credit",
			},
		};

		beforeEach(() => {
			userList.clearUserList();
			userList.createUser("joeTheUser", { userColor: "#00FFFF" });
			userList.addUserTasks("joeTheUser", ["task1", "task2", "task3"]);
			userList.completeUserTasks("joeTheUser", 1);

			userList.createUser("bobTheAdmin", { userColor: "#FF0000" });
			userList.addUserTasks("bobTheAdmin", ["task1", "task2"]);
		});

		describe("Admin commands", () => {
			describe("!timer command", () => {
				test("successfully execute Admin !timer command", () => {
					const response = app.chatHandler(
						adminUser.username,
						adminUser.command.TIMER,
						"60",
						adminUser.flags,
						adminUser.extra
					);
					expect(response.message).toBe(
						"Timer has been reset to 60 minutes"
					);
				});
			});

			describe("!clearList command", () => {
				test("should return a success message when an Admin user submits !clearList ", () => {
					const response = app.chatHandler(
						adminUser.username,
						adminUser.command.CLEARLIST,
						"",
						adminUser.flags,
						adminUser.extra
					);
					expect(userList.users.length).toBe(0);
					expect(response.message).toBe(
						"bobTheAdmin, All tasks have been cleared"
					);
				});

				test("should return a error when an non-Admin user submits !clearList ", () => {
					const response = app.chatHandler(
						chatUser.username,
						adminUser.command.CLEARLIST,
						"",
						chatUser.flags,
						chatUser.extra
					);
					expect(userList.users.length).toBe(2);
					expect(response.message).toBe(
						'joeTheUser, Invalid command: "command not found" - Try !help'
					);
				});
			});

			test("!clearDone command", () => {
				const response = app.chatHandler(
					adminUser.username,
					adminUser.command.CLEARDONE,
					"",
					adminUser.flags,
					adminUser.extra
				);
				expect(userList.users[0].getTasks().length).toBe(2);
				expect(response.error).toBe(false);
				expect(response.message).toBe(
					"bobTheAdmin, All done tasks have been cleared"
				);
			});

			test("!clearUser command", () => {
				const response = app.chatHandler(
					adminUser.username,
					adminUser.command.CLEARUSER,
					chatUser.username,
					adminUser.flags,
					adminUser.extra
				);
				expect(userList.users.length).toBe(1);
				expect(response.message).toBe(
					"bobTheAdmin, All tasks for joeTheUser have been cleared"
				);
			});
		});

		describe("User commands", () => {
			describe("Invalid command", () => {
				test("should error if the command is empty", () => {
					const response = app.chatHandler(
						chatUser.username,
						"",
						"",
						chatUser.flags,
						chatUser.extra
					);
					expect(response.error).toBe(true);
					expect(response.message).toBe(
						'joeTheUser, Invalid command: "command not found" - Try !help'
					);
				});

				test("should error if the command is not found", () => {
					const response = app.chatHandler(
						chatUser.username,
						"invalidCommand",
						"",
						chatUser.flags,
						chatUser.extra
					);
					expect(response.message).toBe(
						'joeTheUser, Invalid command: "command not found" - Try !help'
					);
				});
			});

			describe("!task command", () => {
				test("should create a new user if the user does not exist and add their task", () => {
					const response = app.chatHandler(
						"newUser22",
						chatUser.command.ADDTASK,
						"newTask",
						chatUser.flags,
						chatUser.extra
					);

					expect(response.error).toBe(false);
					expect(response.message).toBe(
						'Task(s) "newTask" added, newUser22!'
					);
				});

				test("should return a success message showing the added tasks", () => {
					const response = app.chatHandler(
						chatUser.username,
						chatUser.command.ADDTASK,
						"newTask",
						chatUser.flags,
						chatUser.extra
					);
					expect(response.error).toBe(false);
					expect(response.message).toBe(
						'Task(s) "newTask" added, joeTheUser!'
					);
				});

				test("should accept multiple, comma separated, tasks", () => {
					const response = app.chatHandler(
						chatUser.username,
						chatUser.command.ADDTASK,
						"newTask, newTask2",
						chatUser.flags,
						chatUser.extra
					);
					expect(response.error).toBe(false);
					expect(response.message).toBe(
						'Task(s) "newTask, newTask2" added, joeTheUser!'
					);
				});

				test("should letting the user know they reached max task limit", () => {
					const response = app.chatHandler(
						chatUser.username,
						chatUser.command.ADDTASK,
						"newTask, newTask2, newTask3, newTask4, newTask5",
						chatUser.flags,
						chatUser.extra
					);
					expect(response.error).toBe(false);
					expect(response.message).toBe(
						"joeTheUser, maximum number of tasks reached, try removing some first."
					);
				});

				test("should error if the message is empty", () => {
					const response = app.chatHandler(
						chatUser.username,
						chatUser.command.ADDTASK,
						"",
						chatUser.flags,
						chatUser.extra
					);
					expect(response.error).toBe(true);
					expect(response.message).toBe(
						'joeTheUser, Invalid command: "Task description is empty" - Try !help'
					);
				});
			});

			describe("!edit command", () => {
				test("should indicating the edited task number", () => {
					const response = app.chatHandler(
						chatUser.username,
						chatUser.command.EDITTASK,
						"2 editedTask",
						chatUser.flags,
						chatUser.extra
					);
					expect(response.error).toBe(false);
					expect(response.message).toBe(
						'Task "2" updated, joeTheUser!'
					);
				});

				test("should error if the message is empty", () => {
					const response = app.chatHandler(
						chatUser.username,
						chatUser.command.EDITTASK,
						"",
						chatUser.flags,
						chatUser.extra
					);
					expect(response.error).toBe(true);
					expect(response.message).toBe(
						'joeTheUser, Invalid command: "Task number or description format is invalid" - Try !help'
					);
				});

				test("should error if the task number is missing", () => {
					const response = app.chatHandler(
						chatUser.username,
						chatUser.command.EDITTASK,
						"edited Task",
						chatUser.flags,
						chatUser.extra
					);
					expect(response.error).toBe(true);
					expect(response.message).toBe(
						'joeTheUser, Invalid command: "Task number or description format is invalid" - Try !help'
					);
				});

				test("should error if task description is missing", () => {
					const response = app.chatHandler(
						chatUser.username,
						chatUser.command.EDITTASK,
						"2",
						chatUser.flags,
						chatUser.extra
					);
					expect(response.message).toBe(
						'joeTheUser, Invalid command: "Task number or description format is invalid" - Try !help'
					);
				});
			});

			describe("!done command", () => {
				test("returns a success message when marking task as done", () => {
					const response = app.chatHandler(
						chatUser.username,
						chatUser.command.DONETASK,
						"1",
						chatUser.flags,
						chatUser.extra
					);
					expect(response.error).toBe(false);
					expect(response.message).toBe(
						'Good job on completing task(s) "task1" joeTheUser!'
					);
				});

				test("returns a success message when marking multiple task as done", () => {
					const response = app.chatHandler(
						chatUser.username,
						chatUser.command.DONETASK,
						"1, 2",
						chatUser.flags,
						chatUser.extra
					);
					expect(response.error).toBe(false);
					expect(response.message).toBe(
						'Good job on completing task(s) "task1, & task2" joeTheUser!'
					);
				});

				test("returns generic message if 0 tasks modified", () => {
					const response = app.chatHandler(
						chatUser.username,
						chatUser.command.DONETASK,
						"4",
						chatUser.flags,
						chatUser.extra
					);

					expect(response.error).toBe(false);
					expect(response.message).toBe(
						"That task doesn't seem to exist, try adding one!"
					);
				});
			});

			describe("!delete command", () => {
				test("should indicating the task has been delete", () => {
					const response = app.chatHandler(
						chatUser.username,
						chatUser.command.DELETETASK,
						"1",
						chatUser.flags,
						chatUser.extra
					);

					expect(response.error).toBe(false);
					expect(response.message).toBe(
						'Task "1" has been deleted, joeTheUser!'
					);
				});

				test("should indicating all of the users tasks have been deleted", () => {
					const response = app.chatHandler(
						chatUser.username,
						chatUser.command.DELETETASK,
						"all",
						chatUser.flags,
						chatUser.extra
					);
					expect(response.error).toBe(false);
					expect(response.message).toBe(
						"All of your tasks have been deleted!"
					);
				});

				test("should error if the task is not found", () => {
					const response = app.chatHandler(
						chatUser.username,
						chatUser.command.DELETETASK,
						"4",
						chatUser.flags,
						chatUser.extra
					);
					expect(response.message).toBe(
						"That task doesn't seem to exist, try adding one!"
					);
				});
			});

			describe("!check command", () => {
				test("should listing user's uncompleted tasks", () => {
					const response = app.chatHandler(
						chatUser.username,
						chatUser.command.CHECKTASK,
						"",
						chatUser.flags,
						chatUser.extra
					);
					expect(response.error).toBe(false);
					expect(response.message).toBe(
						'Your current task is: "1. task1 | 3. task3", joeTheUser'
					);
				});

				test("should if no tasks are found", () => {
					userList.completeUserTasks("joeTheUser", [0, 2]);
					const response = app.chatHandler(
						chatUser.username,
						chatUser.command.CHECKTASK,
						"",
						chatUser.flags,
						chatUser.extra
					);
					expect(response.error).toBe(false);
					expect(response.message).toBe(
						"That task doesn't seem to exist, try adding one!"
					);
				});
			});

			describe("!help command", () => {
				test("should return a helpful message", () => {
					const response = app.chatHandler(
						chatUser.username,
						chatUser.command.HELP,
						"",
						chatUser.flags,
						chatUser.extra
					);
					expect(response.message).toBe(
						"Try using these commands - !task !edit !done !delete"
					);
				});
			});

			describe("!credit command", () => {
				test("should return info about the task bot", () => {
					const response = app.chatHandler(
						chatUser.username,
						chatUser.command.ADDITIONAL,
						"",
						chatUser.flags,
						chatUser.extra
					);
					expect(response.message).toBe(
						"Jujoco is the creator of this bot, check out his Twitch at: https://www.twitch.tv/JujocoCS"
					);
				});
			});
		});
	});
});
