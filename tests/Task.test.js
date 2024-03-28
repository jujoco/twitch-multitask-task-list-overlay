const Task = require("../src/Task");

describe("Task", () => {
	/** @type Task */
	let task;

	beforeEach(() => {
		task = new Task("Buy groceries");
	});

	describe("constructor", () => {
		it("should correctly initialize a task with the given description and default completion status", () => {
			expect(task).toBeInstanceOf(Task);
		});
	});

	describe("getDescription", () => {
		it("should return the description of the task", () => {
			expect(task.getDescription()).toBe("Buy groceries");
		});
	});

	describe("setDescription", () => {
		it("should set the description of the task", () => {
			task.setDescription("Clean the house");
			expect(task.getDescription()).toBe("Clean the house");
		});

		it("should return Error if description is not a string", () => {
			expect(() => task.setDescription(123)).toThrow(
				"Description must be a string"
			);
		});
	});

	describe("isComplete", () => {
		it("should return the completion status of the task", () => {
			expect(task.isComplete()).toBe(false);
		});
	});

	describe("setCompletionStatus", () => {
		it("should set the task status to complete", () => {
			task.setCompletionStatus(true);
			expect(task.isComplete()).toBe(true);
		});

		it("should return Error if status is not a boolean", () => {
			expect(() => task.setCompletionStatus("true")).toThrow(
				"Status must be a boolean"
			);
		});
	});
});
