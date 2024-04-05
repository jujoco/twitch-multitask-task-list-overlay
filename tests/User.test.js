const User = require("../src/User");

describe("User", () => {
	/** @type User */
	let user;

	beforeEach(() => {
		user = new User("Bob");
	});

	describe("validateUsername", () => {
		it("should return the username if it is valid", () => {
			expect(user.validateUsername("Bob")).toBe("Bob");
		});

		it("should throw an error if the username is invalid", () => {
			expect(() => user.validateUsername("")).toThrow(
				"Invalid username format"
			);
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

	describe("editTask", () => {
		it("should update the task at the specified index", () => {
			user.addTask("test task 1");
			user.editTask(0, "updated task");
			expect(user.getTasks()[0].getDescription()).toBe("updated task");
		});

		it("should throw an error if the index is out of bounds", () => {
			expect(() => user.editTask(0, "updated task")).toThrow(Error);
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
			expect(() => user.deleteTask(10)).toThrow("Task index out of bounds");
		});
	});

	describe("getTasks", () => {
		it("should return the tasks of the user", () => {
			user.addTask("test task 1");
			user.addTask("test task 2");
			expect(user.getTasks().length).toBe(2);
		});
	});

	describe("validateTaskIndex", () => {
		it("should throw an error if the index is not a number", () => {
			expect(() => user.validateTaskIndex("0")).toThrow(
				"Task index must be a number"
			);
		});

		it("should throw an error if the index is out of bounds", () => {
			expect(() => user.validateTaskIndex(4)).toThrow(
				"Task index out of bounds"
			);
		});

		it("should Not throw an error if the index is within bounds", () => {
			user.addTask("test task 1");
			expect(() => user.validateTaskIndex(0)).not.toThrow(Error);
			expect(user.validateTaskIndex(0)).toBe(true);
		});
	});
});
