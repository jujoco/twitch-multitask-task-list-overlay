/** @typedef {import('./UserList')} UserList */
/** @type {UserList} */
let userList;

window.addEventListener("load", () => {
	userList = new UserList();
	loadCustomFont();
	renderTaskListToDOM();
});

function loadCustomFont() {
	const headerFontFamily = getComputedStyle(document.documentElement)
		.getPropertyValue("--header-font-family")
		.trim();
	loadGoogleFont(headerFontFamily);

	const bodyFontFamily = getComputedStyle(document.documentElement)
		.getPropertyValue("--body-font-family")
		.trim();
	loadGoogleFont(bodyFontFamily);
}

function loadGoogleFont(font) {
	WebFont.load({
		google: {
			families: [font],
		},
	});
}

function renderTaskListToDOM() {
	const users = userList.getAllUsers();
	const fragment = document.createDocumentFragment();
	let totalTasksCount = 0;
	let completedTasksCount = 0;

	users.forEach((user) => {
		const cardDiv = document.createElement("div");
		cardDiv.classList.add("card");
		const userNameDiv = document.createElement("div");
		userNameDiv.classList.add("username");
		userNameDiv.innerText = user.username;
		cardDiv.appendChild(userNameDiv);
		const list = document.createElement("ol");
		list.classList.add("user-task-list");
		user.tasks.forEach((task) => {
			const listItem = document.createElement("li");
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

	updateTaskCount(completedTasksCount, totalTasksCount);

	const clonedFragment = fragment.cloneNode(true);

	const taskContainerPrimary = document.querySelector(
		".task-container.primary"
	);
	taskContainerPrimary.innerHTML = "";
	taskContainerPrimary.appendChild(clonedFragment);

	const taskContainerSecondary = document.querySelector(
		".task-container.secondary"
	);
	taskContainerSecondary.innerHTML = "";
	taskContainerSecondary.appendChild(fragment);

	animateScroll();
}

function updateTaskCount(completed, total) {
	const totalTasksElement = document.querySelector(".task-count");
	totalTasksElement.innerText = `${completed}/${total}`;
}

function animateScroll() {
	const taskWrapper = document.querySelector(".task-wrapper");
	const taskWrapperHeight = taskWrapper.clientHeight;

	const taskContainerPrimary = document.querySelector(
		".task-container.primary"
	);
	const taskContainerHeight = taskContainerPrimary.scrollHeight;

	let taskContainerSecondary = document.querySelector(
		".task-container.secondary"
	);

	if (taskContainerHeight < taskWrapperHeight) {
		// hide secondary container
		taskContainerSecondary.style.display = "none";
	} else {
		// show secondary container
		taskContainerSecondary.style.display = "block";

		let scrollSpeed = configs.settings.scrollSpeed;
		scrollSpeed = parseInt(scrollSpeed, 10);

		let duration = (taskContainerHeight / scrollSpeed) * 1000;

		let options = {
			duration: duration,
			iterations: "Infinity",
			easing: "linear",
		};

		let primaryKeyFrames = [
			{ transform: "translateY(0)" },
			{ transform: `translateY(-${taskContainerHeight}px)` },
		];

		let secondaryKeyFrames = [
			{ transform: "translateY(0)" },
			{ transform: `translateY(-${taskContainerHeight}px)` },
		];

		// apply animation
		taskContainerPrimary.animate(primaryKeyFrames, options);
		taskContainerSecondary.animate(secondaryKeyFrames, options);
	}
}
