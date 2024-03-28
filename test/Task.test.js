const Task = require("../scripts/Task");

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

	it("should initialize with the correct task description", () => {
		expect(task.getDescription()).toBe("Buy groceries");
	});

	it("should initialize with isComplete set to false", () => {
		expect(task.completionStatus).toBe(false);
	});

	it("should be able to set a new task description", () => {
		task.setDescription("Clean the house");
		expect(task.getDescription()).toBe("Clean the house");
	});

	it("should be able to set the task status to complete", () => {
		task.setCompletionStatus(true);
		expect(task.isComplete()).toBe(true);
	});
});
