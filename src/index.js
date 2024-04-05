let scrolling = false;
let primaryAnimation, secondaryAnimation;
let userList;

window.addEventListener("load", () => {
	userList = new UserList();
	loadCustomFont();
	// renderTaskBot();
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

function renderTaskBot() {
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

	const totalTasksElement = document.querySelector(".task-count");
	totalTasksElement.innerText = `${completedTasksCount} / ${totalTasksCount}`;

	const taskContainers = document.querySelectorAll(".task-container");
	taskContainers.forEach((taskContainer) => {
		taskContainer.innerHTML = "";
		taskContainer.appendChild(fragment);
	});

	animateScroll();
}

function animateScroll() {
	// task wrapper height
	let taskWrapper = document.querySelector(".task-wrapper");
	let taskWrapperHeight = taskWrapper.clientHeight;

	// task container height
	let taskContainerPrimary = document.querySelector(".task-container.primary");
	let taskContainerHeight = taskContainerPrimary.scrollHeight;

	// if primary task container height is greater than task wrapper height, animate scroll
	if (taskContainerHeight > taskWrapperHeight && !scrolling) {
		scrolling = true;

		let taskContainerSecondary = document.querySelector(
			".task-container.secondary"
		);
		taskContainerSecondary.style.display = "flex";

		let scrollSpeed = configs.settings.scrollSpeed;
		scrollSpeed = parseInt(scrollSpeed * 10, 10);

		let duration = (taskContainerHeight / scrollSpeed) * 1000;

		let options = {
			duration: duration,
			iterations: 1,
			easing: "linear",
		};

		let primaryKeyFrames = [
			{ transform: "translateY(0)" },
			{ transform: `translateY(-${taskContainerHeight}px)` },
		];

		let secondaryKeyFrames = [
			{ transform: `translateY(${taskContainerHeight}px)` },
			{ transform: "translateY(0)" },
		];

		// create animation object and play it
		primaryAnimation = document
			.querySelector(".primary")
			?.animate(primaryKeyFrames, options);

		secondaryAnimation = document
			.querySelector(".secondary")
			?.animate(secondaryKeyFrames, options);

		primaryAnimation?.play();
		secondaryAnimation?.play();

		addAnimationListeners();
	} else if (!scrolling) {
		// hide secondary element if task container height is less than task wrapper height
		let secondaryElement = document.querySelector(".secondary");
		secondaryElement.style.display = "none";
	}
}

function addAnimationListeners() {
	if (primaryAnimation) {
		primaryAnimation.addEventListener("finish", animationFinished);
		primaryAnimation.addEventListener("cancel", animationFinished);
	}
}

function animationFinished() {
	scrolling = false;
	renderTaskBot();
	animateScroll();
}
