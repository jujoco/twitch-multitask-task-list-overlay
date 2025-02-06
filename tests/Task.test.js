import { beforeEach, describe, expect, it } from "vitest";
import Task from "../src/classes/Task";

describe("Task", () => {
	/** @type Task */
	let task;

	beforeEach(() => {
		task = new Task("Buy groceries");
	});

	describe("constructor", () => {
		it("should see that all properties are assigned correctly", () => {
			expect(task.description).toBeTypeOf("string");
			expect(task.id).toBeTypeOf("string");
			expect(task.completionStatus).toBeTypeOf("boolean");
		});
	});

	describe("validateDescription", () => {
		it("should return the description if it is valid", () => {
			expect(task.validateDescription("Buy groceries")).toBe(
				"Buy groceries"
			);
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
			expect(task.description).toBe("Buy groceries");
		});
	});

	describe("setDescription", () => {
		it("should set the description of the task", () => {
			task.setDescription("Clean the house");
			expect(task.description).toBe("Clean the house");
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

		it("should unfocus a task when it's completed", () => {
			task.setFocusStatus(true)
			task.setCompletionStatus(true)
			expect(task.isFocused()).toBe(false);
		});
	});

	describe("isFocused", () => {
		it("should return the focus status of the task", () => {
			expect(task.isFocused()).toBe(false);
		});
	});

	describe("setFocusStatus", () => {
		it("should set the focus status of the task", () => {
			task.setFocusStatus(true);
			expect(task.isFocused()).toBe(true);
			task.setFocusStatus(false);
			expect(task.isFocused()).toBe(false);
		});

		it("should return Error if status is not a boolean", () => {
			expect(() => task.setFocusStatus("true")).toThrow(
				"Focus status must be of type boolean"
			);
		});
	});
});
