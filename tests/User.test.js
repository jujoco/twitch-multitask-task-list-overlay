import { beforeEach, describe, expect, test } from "vitest";
import User from "../src/classes/User";
import Task from "../src/classes/Task";

describe("User", () => {
	/** @type User */
	let user;

	beforeEach(() => {
		user = new User("Bob", { userColor: "red" });
	});

	describe("validateUsername", () => {
		test("should return the username if it is valid", () => {
			expect(user.validateUsername("Bob")).toBe("Bob");
		});

		test("should throw an error if the username is invalid", () => {
			expect(() => user.validateUsername("")).toThrow("Username invalid");
		});

		test("should throw an Error if username is not a string", () => {
			expect(() => user.validateUsername(123)).toThrow(
				"Username must be of type string"
			);
			expect(() => user.validateUsername(true)).toThrow(
				"Username must be of type string"
			);
			expect(() => user.validateUsername([])).toThrow(
				"Username must be of type string"
			);
		});
	});

	describe("addTask", () => {
		test("should accept a string as its value and return the Task object", () => {
			const task = new Task("task 1");
			const addedTask = user.addTask(task);
			expect(addedTask).toBeInstanceOf(Task);
			expect(addedTask.description).toBe("task 1");
		});
	});

	describe("editTask", () => {
		test("should update the task description at the specified index", () => {
			user.addTask(new Task("test task 1"));
			user.addTask(new Task("test task 2"));
			user.addTask(new Task("test task 3"));
			expect(user.editTask(2, "task 3 updated").description).toBe(
				"task 3 updated"
			);
		});

		test("should throw an error if the index is out of bounds", () => {
			expect(() => user.editTask(0, "updated task")).toThrow(Error);
		});
	});

	describe("completeTask", () => {
		test("should mark the task at the specified index as complete", () => {
			user.addTask(new Task("test task 1"));
			user.completeTask(0);
			expect(user.getTasks()[0].isComplete()).toBe(true);
		});

		test("should throw an error if the index is out of bounds", () => {
			expect(() => user.completeTask(0)).toThrow(Error);
		});
	});

	describe("deleteTask", () => {
		test("should be able to delete a single task given a single index number", () => {
			user.addTask(new Task("test task 0"));
			user.addTask(new Task("test task 1"));
			const deletedTasks = user.deleteTask(1);
			expect(deletedTasks.length).toBe(1);
		});

		test("should be able to delete multiple tasks if given an array of numbers", () => {
			user.addTask(new Task("test task 0"));
			user.addTask(new Task("test task 1"));
			user.addTask(new Task("test task 2"));
			const deletedTasks = user.deleteTask([1, 2]);
			expect(deletedTasks.length).toBe(2);
			expect(deletedTasks[0].description).toBe("test task 1");
			expect(deletedTasks[1].description).toBe("test task 2");
		});

		test("should throw an error if the index is out of bounds", () => {
			expect(() => user.deleteTask([10])).toThrow(
				"Task index out of bounds"
			);
		});
	});

	describe("removeCompletedTasks", () => {
		test("should remove all completed tasks", () => {
			user.addTask(new Task("test task 1"));
			user.addTask(new Task("test task 2"));
			user.addTask(new Task("test task 3"));
			user.completeTask(0);
			user.completeTask(2);
			const deletedTasks = user.removeCompletedTasks();
			expect(user.getTasks().length).toBe(1);
			expect(deletedTasks.length).toBe(2);
		});
	});

	describe("getTask", () => {
		test("should return the task at the specified index", () => {
			user.addTask(new Task("test task 1"));
			expect(user.getTask(0)).toBeInstanceOf(Task);
			expect(user.getTask(0).description).toBe("test task 1");
		});

		test("should throw an error if the index is out of bounds", () => {
			expect(() => user.getTask(0)).toThrow("Task index out of bounds");
		});
	});

	describe("getTasks", () => {
		test("should return the tasks of the user", () => {
			user.addTask(new Task("test task 1"));
			user.addTask(new Task("test task 2"));
			expect(user.getTasks().length).toBe(2);
		});
	});

	describe("validateTaskIndex", () => {
		test("should throw an error if the index is not a number", () => {
			expect(() => user.validateTaskIndex("0")).toThrow(
				"Task index must be a number"
			);
		});

		test("should throw an error if the index is out of bounds", () => {
			expect(() => user.validateTaskIndex(4)).toThrow(
				"Task index out of bounds"
			);
		});

		test("should Not throw an error if the index is within bounds", () => {
			user.addTask(new Task("test task 1"));
			expect(() => user.validateTaskIndex(0)).not.toThrow(Error);
			expect(user.validateTaskIndex(0)).toBe(true);
		});
	});
});
