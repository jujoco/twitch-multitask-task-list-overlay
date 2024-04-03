const { UserList, ActionType } = require("../src/UserList");

describe("UserList", () => {
	/** @type UserList */
	let userList;

	beforeEach(() => {
		localStorage.clear();
		userList = new UserList();
	});

	describe("Interacting with LocalStorage", () => {
		it("should load user list from local storage", () => {
			expect(userList.loadFromLocalStorage()).toEqual([]);
		});

		it("should save user list to local storage", () => {
			userList.addUserTask("user1", "Task 1");
			expect(localStorage.getItem("userList")).toEqual(
				'[{"username":"user1","tasks":[{"description":"Task 1","completionStatus":false}]}]'
			);
		});
	});

	describe("Dispatching Actions", () => {
		const username = "user1";
		const taskDescription = "Task 1";
		it("should dispatch ADD_USER_TASK", () => {
			const response = userList.dispatch(ActionType.ADD_USER_TASK, {
				username,
				taskDescription,
			});
			expect(response.taskDescriptions).toEqual(["Task 1"]);
			expect(response.error).toBeNull();

			const response2 = userList.dispatch(ActionType.ADD_USER_TASK, {
				username,
				taskDescription: "Task 2",
			});
			expect(response2).toEqual({ error: null, taskDescriptions: ["Task 2"] });
			expect(response2.error).toBeNull();
		});

		it("should dispatch EDIT_USER_TASK", () => {
			userList.dispatch(ActionType.ADD_USER_TASK, {
				username,
				taskDescription,
			});
			const taskIndex = 0;
			const response = userList.dispatch(ActionType.EDIT_USER_TASK, {
				username,
				taskIndex,
				taskDescription: "Updated Task 1",
			});
			expect(response.taskDescriptions).toEqual(["Updated Task 1"]);
			expect(response.error).toBeNull();

			const response2 = userList.dispatch(ActionType.EDIT_USER_TASK, {
				username: "nonExistentUser",
				taskIndex,
				taskDescription: "Updated Task 2",
			});
			expect(response2.taskDescriptions).toEqual([]);
			expect(response2.error).toEqual("nonExistentUser has no tasks");
		});

		it("should dispatch COMPLETE_USER_TASK", () => {
			userList.dispatch(ActionType.ADD_USER_TASK, {
				username,
				taskDescription,
			});
			const taskIndex = 0;
			const response = userList.dispatch(ActionType.COMPLETE_USER_TASK, {
				username,
				taskIndex,
			});
			expect(response.taskDescriptions).toEqual(["Task 1"]);
			expect(response.error).toBeNull();

			const response2 = userList.dispatch(ActionType.COMPLETE_USER_TASK, {
				username: "nonExistentUser",
				taskIndex,
			});
			expect(response2.taskDescriptions).toEqual([]);
			expect(response2.error).toEqual("nonExistentUser has no tasks");
		});

		it("should dispatch DELETE_USER_TASK", () => {
			userList.dispatch(ActionType.ADD_USER_TASK, {
				username,
				taskDescription,
			});

			const response = userList.dispatch(ActionType.DELETE_USER_TASK, {
				username,
				taskIndex: 0,
			});
			expect(response.taskDescriptions).toEqual(["Task 1"]);
			expect(response.error).toBeNull();

			const response2 = userList.dispatch(ActionType.DELETE_USER_TASK, {
				username: "nonExistentUser",
				taskIndex: 0,
			});
			expect(response2.taskDescriptions).toEqual([]);
			expect(response2.error).toEqual("nonExistentUser has no tasks");
		});

		it("should dispatch CHECK_USER_TASK", () => {
			userList.dispatch(ActionType.ADD_USER_TASK, {
				username,
				taskDescription,
			});

			const response = userList.dispatch(ActionType.CHECK_USER_TASKS, {
				username,
			});
			expect(response.taskDescriptions).toEqual(["Task 1"]);
		});

		it("should throw an error for invalid action type", () => {
			const response = userList.dispatch("INVALID_ACTION", { username });
			expect(response.error).toBe("Invalid action type");
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
	});

	describe("editUserTask", () => {
		it("should edit a task for the user", () => {
			userList.addUserTask("user1", "Task 1");
			expect(userList.editUserTask("user1", 0, "Updated Task 1")).toEqual(
				"Updated Task 1"
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
});
