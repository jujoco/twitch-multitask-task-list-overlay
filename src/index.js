/** @typedef {import('./UserList')} UserList */
/** @type {UserList} */
let userList;
/** @type {Animation} */
let primaryAnimation;
/** @type {Animation} */
let secondaryAnimation;

window.addEventListener("load", () => {
	userList = new UserList();
	if (configs.settings.testMode) {
		loadTestUsers();
	}
	renderDOM();
});

function loadTestUsers() {
	userList.clearUserList();
	for (let i = 1; i <= 10; i++) {
		userList.addUserTask(`User${i}`, ["Task 1", "Task 2", "Task 3"]);
	}
}

function renderDOM() {
	renderTaskListToDOM();
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

	updateTaskCount(completedTasksCount, totalTasksCount);

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

function updateTaskCount(completed, total) {
	const totalTasksElement = document.querySelector(".task-count");
	totalTasksElement.innerText = `${completed}/${total}`;
}

function animateScroll() {
	const wrapper = document.querySelector(".task-wrapper");
	const wrapperHeight = wrapper.clientHeight;

	const containerPrimary = document.querySelector(".task-container.primary");
	const containerHeight = containerPrimary.scrollHeight;

	const containerSecondary = document.querySelector(
		".task-container.secondary"
	);

	// hide 2nd container & cancel animation OR
	// show it & play animation
	if (containerHeight < wrapperHeight) {
		containerSecondary.style.display = "none";
		cancelAnimation();
	} else {
		containerSecondary.style.display = "flex";

		const scrollSpeed = parseInt(configs.settings.scrollSpeed, 10);

		let duration = (containerHeight / scrollSpeed) * 1000;
		let options = {
			duration: duration,
			iterations: 1,
			easing: "linear",
		};

		const gapSize = getComputedStyle(document.documentElement)
			.getPropertyValue("--card-gap-between")
			.slice(0, -2);
		let adjustedHight = containerHeight + parseInt(gapSize, 10);
		let primaryKeyFrames = [
			{ transform: "translateY(0)" },
			{ transform: `translateY(-${adjustedHight}px)` },
		];
		let secondaryKeyFrames = [
			{ transform: "translateY(0)" },
			{ transform: `translateY(-${adjustedHight}px)` },
		];

		// store and apply animations
		primaryAnimation = containerPrimary.animate(primaryKeyFrames, options);
		secondaryAnimation = containerSecondary.animate(
			secondaryKeyFrames,
			options
		);

		addAnimationListeners();
	}
}

function cancelAnimation() {
	if (primaryAnimation) {
		primaryAnimation.cancel();
	}
	if (secondaryAnimation) {
		secondaryAnimation.cancel();
	}
}

function addAnimationListeners() {
	if (primaryAnimation) {
		primaryAnimation.addEventListener("finish", animationFinished);
		primaryAnimation.addEventListener("cancel", animationFinished);
	}
}

function animationFinished() {
	animateScroll();
}
