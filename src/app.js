import { animateScroll } from "./animations/animateScroll.js";

/**
 * Render the task list to the DOM
 * @param {Object[]} userList - The user list to render
 * @returns {void}
 */
export function renderTaskListToDOM(users) {
	const fragment = document.createDocumentFragment();
	let totalTasksCount = 0;
	let completedTasksCount = 0;

	users.forEach((user) => {
		const cardDiv = document.createElement("div");
		cardDiv.classList.add("card");
		const userNameDiv = document.createElement("div");
		userNameDiv.classList.add("username");
		userNameDiv.innerText = user.username;
		userNameDiv.style.color = configs.settings.showUsernameColor
			? user.nameColor
			: "";
		cardDiv.appendChild(userNameDiv);
		const list = document.createElement("ol");
		list.classList.add("tasks");
		user.tasks.forEach((task) => {
			const listItem = document.createElement("li");
			listItem.classList.add("task");
			listItem.innerText = task.description;
			if (task.completionStatus) {
				listItem.classList.add("done");
				completedTasksCount++;
			}
			totalTasksCount++;
			list.appendChild(listItem);
		});
		cardDiv.appendChild(list);
		fragment.appendChild(cardDiv);
	});

	const totalTasksElement = document.querySelector(".task-count");
	totalTasksElement.innerText = `${completedTasksCount}/${totalTasksCount}`;

	const clonedFragment = fragment.cloneNode(true);

	const primaryContainer = document.querySelector(".task-container.primary");
	primaryContainer.innerHTML = "";
	primaryContainer.appendChild(fragment);

	const secondaryContainer = document.querySelector(
		".task-container.secondary"
	);
	secondaryContainer.innerHTML = "";
	secondaryContainer.appendChild(clonedFragment);

	animateScroll();
}

/**
 * Returns a list of test users
 * @returns {Object[]}
 */
export function loadTestUsers() {
	const testUserList = [];
	for (let i = 1; i <= 6; i++) {
		const userName = `Username${i}`;
		const colorOptions = [
			"red",
			"royalBlue",
			"springGreen",
			"lightSeaGreen",
			"goldenRod",
			"violet",
		];
		const nameColor =
			colorOptions[Math.floor(Math.random() * colorOptions.length)];
		const user = {
			username: userName,
			nameColor: nameColor,
			tasks: [
				{ description: "Task 1 description", completionStatus: true },
				{
					description: "This is task 2 description",
					completionStatus: true,
				},
				{
					description:
						"This description is a longer description task",
					completionStatus: false,
				},
			],
		};
		testUserList.push(user);
	}
	return testUserList;
}
