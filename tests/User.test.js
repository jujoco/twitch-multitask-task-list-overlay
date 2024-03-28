const User = require("../src/User");

describe("User", () => {
	/** @type User */
	let user;

	beforeEach(() => {
		user = new User("Bob");
	});

	describe("constructor", () => {
		it("should create a new user", () => {
			expect(user).toBeInstanceOf(User);
		});

		it("should set the username of the user", () => {
			expect(user.username).toBe("Bob");
		});
	});

	describe("addTask", () => {
		it("should add a task to the user", () => {
			user.addTask("test task 1");
			expect(user.getTasks().length).toBe(1);
		});
		it("should add a task with the specified description", () => {
			user.addTask("test task 1");
			expect(user.getTasks()[0].getDescription()).toBe("test task 1");
		});
	});

	describe("getTasks", () => {
		it("should return the tasks of the user", () => {
			user.addTask("test task 1");
			user.addTask("test task 2");
			expect(user.getTasks().length).toBe(2);
		});
	});

	describe("updateTask", () => {
		it("should update the task at the specified index", () => {
			user.addTask("test task 1");
			user.updateTask(0, "updated task");
			expect(user.getTasks()[0].getDescription()).toBe("updated task");
		});

		it("should throw an error if the index is out of bounds", () => {
			expect(() => user.updateTask(0, "updated task")).toThrow(Error);
		});
	});

	describe("completeTask", () => {
		it("should mark the task at the specified index as complete", () => {
			user.addTask("test task 1");
			user.completeTask(0);
			expect(user.getTasks()[0].isComplete()).toBe(true);
		});

		it("should throw an error if the index is out of bounds", () => {
			expect(() => user.completeTask(0)).toThrow(Error);
		});
	});

	describe("deleteTask", () => {
		it("should delete the task at the specified index", () => {
			user.addTask("test task 1");
			user.deleteTask(0);
			expect(user.getTasks().length).toBe(0);
		});

		it("should delete the 2nd task accurately", () => {
			user.addTask("test task 0");
			user.addTask("test task 1");
			user.addTask("test task 2");
			user.deleteTask(1);
			expect(user.getTask(0).getDescription()).toBe("test task 0");
			expect(user.getTask(1).getDescription()).toBe("test task 2");
			expect(user.getTasks().length).toBe(2);
		});

		it("should throw an error if the index is out of bounds", () => {
			expect(() => user.deleteTask(0)).toThrow(Error);
		});
	});

	describe("getTaskCount", () => {
		it("should return the number of tasks the user has", () => {
			user.addTask("test task 1");
			user.addTask("test task 2");
			user.addTask("test task 3");
			expect(user.getTaskCount()).toBe(3);
		});
	});
});
