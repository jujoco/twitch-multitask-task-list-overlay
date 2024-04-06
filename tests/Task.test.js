const Task = require("../src/Task");

describe("Task", () => {
	/** @type Task */
	let task;

	beforeEach(() => {
		task = new Task("Buy groceries");
	});

	describe("validateDescription", () => {
		it("should return the description if it is valid", () => {
			expect(task.validateDescription("Buy groceries")).toBe("Buy groceries");
		});

		it("should throw an error if the description is invalid", () => {
			expect(() => task.validateDescription("")).toThrow(
				"Task description invalid"
			);
		});

		it("should throw Error if description is not a string", () => {
			expect(() => task.validateDescription(123)).toThrow(
				"Task description must be of type string"
			);
			expect(() => task.validateDescription(true)).toThrow(
				"Task description must be of type string"
			);
			expect(() => task.validateDescription([])).toThrow(
				"Task description must be of type string"
			);
			expect(() => task.validateDescription({})).toThrow(
				"Task description must be of type string"
			);
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
			task.setCompletionStatus(false);
			expect(task.isComplete()).toBe(false);
		});

		it("should return Error if status is not a boolean", () => {
			expect(() => task.setCompletionStatus("true")).toThrow(
				"Completion status must be of type boolean"
			);
		});
	});
});
