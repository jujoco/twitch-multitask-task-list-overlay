import { beforeEach, describe, expect, test } from "vitest";
import UserList from "../src/classes/UserList";
import User from "../src/classes/User";
import Task from "../src/classes/Task";

describe("UserList", () => {
	/** @type UserList */
	let userList;

	beforeEach(() => {
		localStorage.clear();
		userList = new UserList();
	});

	describe("constructor", () => {
		beforeEach(() => {
			localStorage.clear();
		});

		test("should load an empty user list if localStorage dose not contain userList", () => {
			userList = new UserList();
			expect(userList.users).toEqual([]);
		});

		test("should load user list if localStorage contains userList", () => {
			localStorage.setItem(
				"userList",
				JSON.stringify([
					{
						username: "user1",
						tasks: [
							{ description: "Task 1", completionStatus: false },
						],
					},
				])
			);
			userList = new UserList();
			let user = userList.users[0];
			expect(user.username).toEqual("user1");
			expect(user.tasks[0].description).toEqual("Task 1");
			expect(user.tasks[0].completionStatus).toEqual(false);
		});
	});

	describe("getUser", () => {
		test("should return user by providing username", () => {
			userList.createUser("user1", { userColor: "#ff0000" });
			const user = userList.getUser("user1");
			expect(user.username).toEqual("user1");
			expect(user.userColor).toEqual("#ff0000");
			expect(user.tasks).toEqual([]);
		});

		test("should return undefined if user does not exist", () => {
			expect(userList.getUser("nonExistentUser")).toBeUndefined();
		});
	});

	describe("getAllUsers", () => {
		test("should return all users", () => {
			userList.createUser("user1", { userColor: "#ff0000" });
			userList.createUser("user2", { userColor: "#00ff00" });

			const [user1, user2] = userList.users;
			expect(user1.username).toEqual("user1");
			expect(user1.userColor).toEqual("#ff0000");
			expect(user1.tasks).toEqual([]);

			expect(user2.username).toEqual("user2");
			expect(user2.userColor).toEqual("#00ff00");
			expect(user2.tasks).toEqual([]);
		});

		test("should return an empty array if there are no users", () => {
			expect(userList.getAllUsers()).toEqual([]);
		});
	});

	describe("createUser", () => {
		test("should create a new user", () => {
			const user = userList.createUser("user1", { userColor: "#ff0000" });
			expect(user.username).toEqual("user1");
			expect(user.userColor).toEqual("#ff0000");
			expect(user.tasks).toEqual([]);
			expect(user).toBeInstanceOf(User);
		});

		test("should throw an error if user already exists", () => {
			userList.createUser("user1", { userColor: "#ff0000" });
			expect(() =>
				userList.createUser("user1", { userColor: "#ff0000" })
			).toThrow("user1 already exists");
		});
	});

	describe("addUserTasks", () => {
		test("should be able to add a single string description", () => {
			userList.createUser("user1", { userColor: "#ff0000" });
			const tasks = userList.addUserTasks(
				"user1",
				"A single task containing , comma in, description"
			);
			const [task1] = tasks;

			expect(task1).instanceOf(Task);
			expect(task1.description).toEqual(
				"A single task containing , comma in, description"
			);
		});

		test("should be able to add multiple tasks if given an array of descriptions", () => {
			userList.createUser("user1", { userColor: "#ff0000" });
			const tasks = userList.addUserTasks("user1", [
				"Task 1",
				"Task 2 containing , comma in, description",
			]);
			const [task1, task2] = tasks;

			expect(task1.description).toEqual("Task 1");
			expect(task2.description).toEqual(
				"Task 2 containing , comma in, description"
			);
		});

		test("should throw an error if user does not exist", () => {
			expect(() =>
				userList.addUserTasks("nonExistentUser", "Task 1")
			).toThrow("nonExistentUser does not exist");
		});
	});

	describe("editUserTask", () => {
		test("should edit a task for the user", () => {
			userList.createUser("user1", { userColor: "#ff0000" });
			userList.addUserTasks("user1", "Task 1");
			const task = userList.editUserTask("user1", 0, "Updated Task 1");
			expect(task.description).toEqual("Updated Task 1");
		});

		test("should throw an error if task does not exist", () => {
			userList.createUser("user1", { userColor: "#ff0000" });
			userList.addUserTasks("user1", "Task 1");
			expect(() =>
				userList.editUserTask("user1", 1, "Updated Task 1")
			).toThrow("Task 1 not found");
		});

		test("should throw an error if user does not exist", () => {
			expect(() =>
				userList.editUserTask("nonExistentUser", 0, "Updated Task 1")
			).toThrow("nonExistentUser has no tasks");
		});
	});

	describe("completeUserTask", () => {
		test("should complete a task for the user", () => {
			userList.createUser("user1", { userColor: "#ff0000" });
			userList.addUserTasks("user1", "Task 1");
			const [task1] = userList.completeUserTasks("user1", 0);
			expect(task1.description).toEqual("Task 1");
		});

		test("should be able to mark multiple tasks as complete if given an array of indices", () => {
			userList.createUser("user1", { userColor: "#ff0000" });
			userList.addUserTasks("user1", [
				"Task 1",
				"Task 2",
				"Task 3",
				"Task 4",
			]);
			const tasks = userList.completeUserTasks("user1", [0, 2, 3]);
			expect(tasks.length).toEqual(3);
			expect(tasks[0].description).toEqual("Task 1");
			expect(tasks[1].description).toEqual("Task 3");
			expect(tasks[2].description).toEqual("Task 4");
		});

		test("returns an array of only existing task indices provide", () => {
			userList.createUser("user1", { userColor: "#ff0000" });
			userList.addUserTasks("user1", "Task 1");
			userList.addUserTasks("user1", "Task 2");
			const tasks = userList.completeUserTasks("user1", 3);
			expect(tasks).toHaveLength(0);
		});

		test("should throw an error if user does not exist", () => {
			expect(() =>
				userList.completeUserTasks("nonExistentUser", 0)
			).toThrow("User nonExistentUser not found");
		});
	});

	describe("setFocusedTask", () => {
		test("should set the focused task for the user", () => {
			userList.createUser("user1", { userColor: "#ff0000" });
			userList.addUserTasks("user1", ["Task 1", "Task 2"]);
			const task = userList.focusUserTask("user1", 1);
			expect(task.description).toEqual("Task 2");
		});

		test("should throw an error if user does not exist", () => {
			expect(() =>
				userList.focusUserTask("nonExistentUser", 0)
			).toThrow("User nonExistentUser not found");
		});
	});

	describe("deleteUserTask", () => {
		test("should delete a task if given a single index", () => {
			userList.createUser("user1", { userColor: "#ff0000" });
			userList.addUserTasks("user1", ["Task 1", "Task 2"]);
			const [task1] = userList.deleteUserTasks("user1", 0);

			expect(task1.description).toEqual("Task 1");
		});

		test("should delete multiple tasks if given an array of indices", () => {
			userList.createUser("user1", { userColor: "#ff0000" });
			userList.addUserTasks("user1", ["Task 1", "Task 2", "Task 3"]);
			const [task1, task3] = userList.deleteUserTasks("user1", [0, 2]);

			expect(task1.description).toEqual("Task 1");
			expect(task3.description).toEqual("Task 3");
		});

		test("should throw an error if task does not exist", () => {
			userList.createUser("user1", { userColor: "#ff0000" });
			userList.addUserTasks("user1", "Task 1");
			expect(userList.deleteUserTasks("user1", [1])).toEqual([]);
		});

		test("should throw an error if user does not exist", () => {
			expect(() =>
				userList.deleteUserTasks("nonExistentUser", [0])
			).toThrow("User nonExistentUser not found");
		});
	});

	describe("checkUserTasks", () => {
		test("should return all tasks for the user", () => {
			userList.createUser("user1", { userColor: "#ff0000" });
			userList.addUserTasks("user1", ["Task 1", "Task 2"]);
			const taskMap = userList.checkUserTasks("user1");
			expect(taskMap.size).toEqual(2);
			expect(taskMap).instanceOf(Map);
			expect(taskMap.get(0).description).toEqual("Task 1");
			expect(taskMap.get(1).description).toEqual("Task 2");
		});

		test("should throw an error if user does not exist", () => {
			const taskMap = userList.checkUserTasks("nonExistentUser");
			expect(taskMap.size).toEqual(0);
			expect(taskMap).instanceOf(Map);
		});
	});

	describe("clearUserList", () => {
		test("should clear all tasks", () => {
			userList.createUser("user1", { userColor: "#ff0000" });
			userList.addUserTasks("user1", "Task 1, Task 2");
			userList.clearUserList();
			expect(userList.users).toEqual([]);
		});
	});

	describe("clearDoneTasks", () => {
		test("should clear all done tasks for the user", () => {
			const user1 = userList.createUser("user1", {
				userColor: "#ff0000",
			});
			userList.addUserTasks("user1", [
				"user1-task 1",
				"user1-task 2",
				"user1-task 3",
			]);
			userList.completeUserTasks("user1", 0);

			const user2 = userList.createUser("user2", {
				userColor: "#ff0000",
			});
			userList.addUserTasks("user2", ["user2-task 1", "user2-task 2"]);
			userList.completeUserTasks("user2", 1);
			userList.completeUserTasks("user2", 0);

			userList.clearDoneTasks();
			expect(userList.getUser("user1").tasks).toHaveLength(2);
			expect(userList.getAllUsers().length).toEqual(1);
		});
	});

	describe("deleteUser", () => {
		test("should delete user by given username", () => {
			userList.createUser("user1", { userColor: "#ff0000" });
			userList.addUserTasks("user1", "Task 1");
			const user = userList.deleteUser("user1");
			expect(user.username).toEqual("user1");
			expect(user.userColor).toEqual("#ff0000");
			expect(user.tasks[0].description).toEqual("Task 1");
			expect(user).toBeInstanceOf(User);
		});

		test("should throw an error if user does not exist", () => {
			expect(() => userList.deleteUser("nonExistentUser")).toThrow(
				"User not found"
			);
		});
	});
});
