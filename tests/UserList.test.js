const UserList = require("../src/UserList");
const User = require("../src/User");

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

		it("should load an empty user list if localStorage dose not contain userList", () => {
			userList = new UserList();
			expect(userList.users).toEqual([]);
		});

		it("should load user list if localStorage contains userList", () => {
			localStorage.setItem(
				"userList",
				JSON.stringify([
					{
						username: "user1",
						tasks: [{ description: "Task 1", completionStatus: false }],
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
		it("should return user by username", () => {
			userList.addUserTask("user1", "Task 1");
			expect(userList.getUser("user1")).toEqual({
				username: "user1",
				tasks: [
					{
						description: "Task 1",
						completionStatus: false,
					},
				],
			});
		});

		it("should return undefined if user does not exist", () => {
			expect(userList.getUser("nonExistentUser")).toBeUndefined();
		});
	});

	describe("getAllUsers", () => {
		it("should return all users", () => {
			userList.addUserTask("user1", "user1 task 1");
			userList.addUserTask("user2", "user2 task 1");
			expect(userList.getAllUsers()).toEqual([
				{
					username: "user1",
					tasks: [
						{
							completionStatus: false,
							description: "user1 task 1",
						},
					],
				},
				{
					username: "user2",
					tasks: [
						{
							completionStatus: false,
							description: "user2 task 1",
						},
					],
				},
			]);
		});

		it("should return an empty array if there are no users", () => {
			expect(userList.getAllUsers()).toEqual([]);
		});
	});

	describe("deleteUser", () => {
		it("should delete user by username", () => {
			userList.addUserTask("user1", "Task 1");
			expect(userList.deleteUser("user1")).toEqual({
				username: "user1",
				tasks: [
					{
						description: "Task 1",
						completionStatus: false,
					},
				],
			});
		});

		it("should throw an error if user does not exist", () => {
			expect(() => userList.deleteUser("nonExistentUser")).toThrow(
				"User not found"
			);
		});
	});

	describe("addUserTask", () => {
		it("should add a task to the user", () => {
			userList.addUserTask("user1", "Task 1");
			expect(userList.getUser("user1")).toEqual({
				username: "user1",
				tasks: [
					{
						description: "Task 1",
						completionStatus: false,
					},
				],
			});
		});

		it("should add a task to the user", () => {
			userList.addUserTask("user1", "Task 1");
			expect(userList.getUser("user1")).toEqual({
				username: "user1",
				tasks: [
					{
						description: "Task 1",
						completionStatus: false,
					},
				],
			});
		});
	});

	describe("editUserTask", () => {
		it("should edit a task for the user", () => {
			userList.addUserTask("user1", "Task 1");
			expect(userList.editUserTask("user1", 0, "Updated Task 1")).toEqual(
				"Updated Task 1"
			);
		});

		it("should throw an error if task does not exist", () => {
			userList.addUserTask("user1", "Task 1");
			expect(() => userList.editUserTask("user1", 1, "Updated Task 1")).toThrow(
				"Task index out of bounds"
			);
		});

		it("should throw an error if user does not exist", () => {
			expect(() =>
				userList.editUserTask("nonExistentUser", 0, "Updated Task 1")
			).toThrow("nonExistentUser has no tasks");
		});
	});

	describe("completeUserTask", () => {
		it("should complete a task for the user", () => {
			userList.addUserTask("user1", "Task 1");
			expect(userList.completeUserTask("user1", 0)).toEqual("Task 1");
		});

		it("should throw an error if task does not exist", () => {
			userList.addUserTask("user1", "Task 1");
			expect(() => userList.completeUserTask("user1", 1)).toThrow(
				"Task index out of bounds"
			);
		});

		it("should throw an error if user does not exist", () => {
			expect(() => userList.completeUserTask("nonExistentUser", 0)).toThrow(
				"nonExistentUser has no tasks"
			);
		});
	});

	describe("deleteUserTask", () => {
		it("should delete a task for the user", () => {
			userList.addUserTask("user1", "Task 1");
			expect(userList.deleteUserTask("user1", 0)).toEqual("Task 1");
		});

		it("should throw an error if task does not exist", () => {
			userList.addUserTask("user1", "Task 1");
			expect(() => userList.deleteUserTask("user1", 1)).toThrow(
				"Task index out of bounds"
			);
		});

		it("should throw an error if user does not exist", () => {
			expect(() => userList.deleteUserTask("nonExistentUser", 0)).toThrow(
				"nonExistentUser has no tasks"
			);
		});
	});

	describe("checkUserTasks", () => {
		it("should return all tasks for the user", () => {
			userList.addUserTask("user1", "Task 1");
			expect(userList.checkUserTasks("user1")).toEqual(["Task 1"]);
		});

		it("should throw an error if user does not exist", () => {
			expect(() => userList.checkUserTasks("nonExistentUser")).toThrow(
				"nonExistentUser has no tasks"
			);
		});
	});

	describe("clearUserList", () => {
		it("should clear all tasks", () => {
			userList.addUserTask("user1", "Task 1");
			userList.addUserTask("user1", "Task 1");
			userList.clearUserList();
			expect(userList.users).toEqual([]);
		});
	});

	describe("clearDoneTasks", () => {
		it("should clear all done tasks for the user", () => {
			userList.addUserTask("user1", ["user1 Task 1", "user1 Task 1"]);
			userList.addUserTask("user2", ["user2 Task 1", "user2 Task 1"]);
			userList.completeUserTask("user1", 0);
			userList.completeUserTask("user2", 1);
			userList.clearDoneTasks();
			expect(userList.getUser("user1")).toEqual({
				username: "user1",
				tasks: [{ description: "user1 Task 1", completionStatus: false }],
			});
		});
	});
});
