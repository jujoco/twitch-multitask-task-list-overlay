const UserList = require("../src/UserList");

describe("UserList", () => {
	/** @type UserList */
	let userList;

	beforeEach(() => {
		userList = new UserList();
	});

	describe("addUser", () => {
		it("should add a user to the list", () => {
			userList.addUser("John");
			expect(userList.getUserCount()).toBe(1);
		});

		it("should add a user to the list", () => {
			userList.addUser("John");
			userList.addUser("Jane");
			expect(userList.getUserCount()).toBe(2);
		});
	});

	describe("getUser", () => {
		it("should get the user by username", () => {
			userList.addUser("John");
			const user = userList.getUser("John");
			expect(user.username).toBe("John");
		});
	});

	describe("deleteUser", () => {
		it("should delete the user by username", () => {
			userList.addUser("John");
			userList.deleteUser("John");
			expect(userList.getUserCount()).toBe(0);
		});
	});

	describe("getUserCount", () => {
		it("should return the number of users in the list", () => {
			userList.addUser("John");
			userList.addUser("Jane");
			expect(userList.getUserCount()).toBe(2);
		});
	});

	describe("addUserTask", () => {
		it("should add a task to the user at the specified index", () => {
			userList.addUser("John");
			userList.addUserTask("John", "Task 1");
			expect(userList.getUserTaskCount("John")).toBe(1);
		});
	});

	describe("updateUserTask", () => {
		it("should update the task at the specified index", () => {
			userList.addUser("John");
			userList.addUserTask("John", "Task 1");
			userList.updateUserTask("John", 0, "Updated Task");
			const user = userList.getUser("John");
			const task1 = user.getTasks()[0];
			expect(task1.getDescription()).toBe("Updated Task");
		});
	});

	describe("deleteUserTask", () => {
		it("should delete the task at the specified index", () => {
			userList.addUser("John");
			userList.addUserTask("John", "Task 1");
			userList.deleteUserTask("John", 0);
			expect(userList.getUserTaskCount("John")).toBe(0);
		});
	});

	describe("getUserTaskCount", () => {
		it("should return the number of tasks the user has", () => {
			userList.addUser("John");
			userList.addUserTask("John", "Task 1");
			userList.addUserTask("John", "Task 2");
			expect(userList.getUserTaskCount("John")).toBe(2);
		});

		it("should return 0 if the user does not exist", () => {
			expect(userList.getUserTaskCount("John")).toBe(0);
		});
	});
});
