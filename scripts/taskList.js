/*
DB structure:

User {
	- username: string
	- tasks: Task[]
} 
    
Task {
	- id: number
	- task: string
	- isComplete: boolean
}

*/

const responses = configs.responses;
let scrolling = false;
let primaryAnimation, secondaryAnimation;

/**
 *
 * @param {string} font
 */
function loadGoogleFont(font) {
	WebFont.load({
		google: {
			families: [font],
		},
	});
}

/**
 * convert taskListBorderColor to task-list-border-color
 */
function convertToCSSVar(name) {
	let cssVar = name.replace(/([A-Z])/g, "-$1").toLowerCase();
	return `--${cssVar}`;
}

/**
 * This function imports styles from the configs object and applies them to the document.
 * It loads the Google fonts specified in the configs, applies all styles that do not include 'Background' in their keys,
 * and applies background colors and opacities for specific elements.
 * If the 'showTasksNumber' setting in configs is false, it hides the task count element.
 */
function importStyles() {
	const styles = configs.styles;

	loadGoogleFont(styles.headerFontFamily);
	loadGoogleFont(styles.bodyFontFamily);

	const stylesToImport = Object.keys(styles).filter((style) => {
		return !style.includes("Background");
	});

	const backgroundStyles = [
		"taskList",
		"header",
		"body",
		"task",
		"checkBox",
		"doneTask",
	];

	stylesToImport.forEach((style) => {
		document.documentElement.style.setProperty(
			convertToCSSVar(style),
			styles[style]
		);
	});

	// loop through backgroundstyles
	backgroundStyles.forEach((style) => {
		// get background color and opacity
		let backgroundColor = styles[`${style}BackgroundColor`];
		let backgroundOpacity = styles[`${style}BackgroundOpacity`];

		let cssStyle = convertToCSSVar(style);

		// set background color
		document.documentElement.style.setProperty(
			`${cssStyle}-background-color`,
			`rgba(${hexToRgb(backgroundColor)}, ${backgroundOpacity})`
		);
	});

	if (!configs.settings.showTasksNumber) {
		document.getElementById("task-count").style.display = "none";
	}
}

/**
 * This function sets up the database. It checks if the keys 'usernames_id' and 'tasks' exist in local storage.
 * If they do not exist, it initializes them with empty objects.
 */
function setupDB() {
	if (!localStorage.usernames_id) {
		localStorage.setItem(`usernames_id`, "{}");
	}
	if (!localStorage.tasks) {
		localStorage.setItem(`tasks`, "{}");
	}
}

/**
 * This function resets the database. It clears the local storage and then sets up the database again.
 */
function resetDB() {
	localStorage.clear();
	setupDB();
}

/**
 * This function clears all tasks from the task list. It resets the database, cancels any ongoing animation, and re-renders the task list.
 */
function clearAllTasks() {
	resetDB();
	cancelAnimation();
	renderTaskList();
}

/**
 * This function retrieves the tasks from local storage. It parses the tasks stored under the key 'tasks' and returns them as an array.
 *
 * @returns {Array} The array of tasks retrieved from local storage.
 */
function getTasks() {
	return JSON.parse(localStorage.tasks);
}

/**
 * This function saves the tasks to local storage. It stringifies the tasks array and stores it under the key 'tasks'.
 *
 * @param {Array} tasks - The array of tasks to be saved.
 */
function saveTasks(tasks) {
	localStorage.setItem(`tasks`, JSON.stringify(tasks));
}

/**
 * This function retrieves the ID associated with a given username from local storage.
 * If the username does not exist, it assigns an ID of 0 and stores the username-ID pair in local storage.
 *
 * @param {string} username - The username for which to retrieve the ID.
 * @returns {number} The ID associated with the given username.
 */
function getID(username) {
	let id = 0;
	// let usernames_id = JSON.parse(localStorage.usernames_id);
	// if (usernames_id[username]) {
	// 	id = usernames_id[username];
	// } else {
	// 	usernames_id[username] = id;
	// 	localStorage.setItem(`usernames_id`, JSON.stringify(usernames_id));
	// }

	return username;
}

/**
 * This function increments the ID associated with a given username by a specified value.
 * The new ID is then stored in local storage.
 *
 * @param {string} username - The username for which to increment the ID.
 * @param {number} value - The value by which to increment the ID.
 */
function incrementID(username, value) {
	let newID = getID(username) + value;
	let usernames_id = JSON.parse(localStorage.usernames_id);
	usernames_id[username] = newID;
	localStorage.setItem(`usernames_id`, JSON.stringify(usernames_id));
}

/**
 * This function renders the task count on the DOM. It retrieves the tasks from local storage, counts the total number of tasks and the number of completed tasks,
 * and then updates the task count element on the DOM with the format 'completed/total'.
 */
function renderTaskCount() {
	let tasks = getTasks();

	let totalTasksCount = 0;
	let completedTasksCount = 0;

	for (let task in tasks) {
		let taskData = tasks[task];
		if (taskData.done) {
			completedTasksCount++;
		}
		totalTasksCount++;
	}

	let taskCount = document.getElementById("task-count");
	taskCount.innerText = `${completedTasksCount}/${totalTasksCount}`;
}

/**
 * This function renders the task list on the DOM. It retrieves the tasks from local storage, filters them based on the settings,
 * reverses the order if necessary, and then adds each task to the DOM. After all tasks are added, it renders the task count and triggers the animation.
 */
function renderTaskList() {
	let tasks = getTasks();

	if (!configs.settings.showDoneTasks) {
		for (let task in tasks) {
			let taskData = tasks[task];
			if (taskData.done) {
				delete tasks[task];
			}
		}
	}

	// reverse the order of tasks
	if (configs.settings.reverseOrder) {
		let reversedTasks = {};
		let tasksKeys = Object.keys(tasks);
		for (let i = tasksKeys.length - 1; i >= 0; i--) {
			let task = tasksKeys[i];
			reversedTasks[task] = tasks[task];
		}
		tasks = reversedTasks;
	}

	let taskContainers = document.querySelectorAll(".task-container");

	taskContainers.forEach(function (taskList) {
		taskList.innerHTML = "";
	});

	for (let task in tasks) {
		let taskData = tasks[task];
		let username = task.split("-")[0];
		let id = task.split("-")[1];

		addTasksToDom(username, taskData.userColor, taskData.task, taskData.done);
	}

	renderTaskCount();
	animate();
}

/**
 * This function adds tasks to the DOM. It creates a new task element for each task and appends it to the task container.
 * It also handles the creation of the checkbox or bullet point, the username, and the task text.
 * If the task is completed, it adds the appropriate classes and checks the checkbox if it exists.
 *
 * @param {string} username - The username associated with the task.
 * @param {string} userColor - The color associated with the username.
 * @param {string} task - The task text.
 * @param {boolean} completed - Whether the task is completed or not.
 */
function addTasksToDom(username, userColor, task, completed) {
	let taskContainers = document.querySelectorAll(".task-container");

	taskContainers.forEach(function (taskList) {
		let newTask = document.createElement("div");
		let usernameTask = document.createElement("div");

		newTask.className = "task-div";

		// if task is done, append "done-task-div" to newTask class
		if (completed) {
			newTask.classList.add("done-task-div");
		}

		usernameTask.className = "username-div";

		if (configs.settings.showCheckBox) {
			// <div class="checkbox"><input type="checkbox" /><label></label></div>
			let checkbox = document.createElement("div");
			checkbox.className = "checkbox";

			let checkboxInput = document.createElement("input");
			checkboxInput.type = "checkbox";

			// if completed is true, check the checkbox
			if (completed) {
				checkboxInput.checked = true;
			}

			checkbox.appendChild(checkboxInput);

			let checkboxLabel = document.createElement("label");
			checkbox.appendChild(checkboxLabel);

			usernameTask.appendChild(checkbox);
		} else {
			let bulletPointDiv = document.createElement("div");

			bulletPointDiv.className = "bullet-point";
			bulletPointDiv.innerText = configs.styles.bulletPointCharacter;

			usernameTask.appendChild(bulletPointDiv);
		}

		// <div class="username">username</div>
		let usernameDiv = document.createElement("div");
		usernameDiv.className = "username";
		usernameDiv.innerText = username;

		if (configs.styles.usernameColor == "") {
			usernameDiv.style.color = userColor;
		}

		usernameTask.appendChild(usernameDiv);

		//  <div class="colon">:</div>
		let colon = document.createElement("div");
		colon.className = "colon";
		colon.innerText = ":";
		usernameTask.appendChild(colon);

		newTask.appendChild(usernameTask);

		// <div class="task">task</div>
		let taskDiv = document.createElement("div");
		taskDiv.className = "task";
		taskDiv.innerText = task;

		if (configs.settings.crossTasksOnDone && completed) {
			taskDiv.classList.add("crossed");
		}

		if (completed) {
			taskDiv.classList.add("done");
		}

		newTask.appendChild(taskDiv);

		// append to task list
		taskList.appendChild(newTask);
	});
}

/**
 * This function checks if a user has a task that is not done yet.
 * It retrieves the tasks from local storage and checks if the task associated with the given username and ID exists and is not done.
 *
 * @param {string} username - The username associated with the task.
 * @returns {boolean} Returns true if the user has a task that is not done yet, false otherwise.
 */
function userHasTask(username) {
	let tasks = getTasks();
	let id = getID(username);

	if (tasks[`${username}-${id}`] == null) {
		return false;
	}

	return !tasks[`${username}-${id}`].done;
}

/**
 * user adding task
 * */
function addTask(username, userColor, task) {
	let tasks = getTasks();
	let id = getID(username);

	tasks[`${username}-${id}`] = {
		userColor: userColor,
		task: task,
		done: false,
	};

	saveTasks(tasks);

	if (!scrolling) {
		renderTaskList();
	}
}

/** user completing task
 * @returns {string} The task that was completed.
 * */
function doneTask(username) {
	let id = getID(username);
	let tasks = getTasks();

	let finishedTask = tasks[`${username}-${id}`].task;

	tasks[`${username}-${id}`].done = true;

	incrementID(username, 1);

	saveTasks(tasks);

	if (!scrolling) {
		renderTaskList();
	}

	return finishedTask;
}

/**
 * This function removes a task associated with a given username.
 * It retrieves the ID and tasks from local storage, finds the task associated with the username and ID, and deletes it.
 * It then decrements the ID, saves the tasks back to local storage, and re-renders the task list if not currently scrolling.
 *
 * @param {string} username - The username associated with the task to be removed.
 * @returns {string} The task that was removed.
 */
function removeTask(username) {
	let id = getID(username);
	let tasks = getTasks();

	let userTasks = tasks[`${username}-${id}`];
	if (!userTasks) {
		id = id - 1;
		userTasks = tasks[`${username}-${id}`];
		incrementID(username, -1);
	}

	let removedTask = userTasks.task;

	delete tasks[`${username}-${id}`];

	incrementID(username, -1);

	saveTasks(tasks);

	if (!scrolling) {
		renderTaskList();
	}

	return removedTask;
}

/**
 * This function edits a task associated with a given username.
 * It retrieves the ID and tasks from local storage, finds the task associated with the username and ID, and updates its text.
 * It then saves the tasks back to local storage and re-renders the task list if not currently scrolling.
 *
 * @param {string} username - The username associated with the task to be edited.
 * @param {string} task - The new task text.
 */
function editTask(username, task) {
	let tasks = getTasks();
	let id = getID(username);

	tasks[`${username}-${id}`].task = task;

	saveTasks(tasks);

	if (!scrolling) {
		renderTaskList();
	}
}

/**
 * This function marks the current task as done and adds a new task for the given username.
 * It first calls the doneTask function to mark the current task as done and then calls the addTask function to add the new task.
 *
 * @param {string} username - The username associated with the task.
 * @param {string} userColor - The color associated with the username.
 * @param {string} task - The new task text.
 * @returns {string} The task that was marked as done.
 */
function nextTask(username, userColor, task) {
	let finishedTask = doneTask(username);
	addTask(username, userColor, task);

	return finishedTask;
}

/**
 * This function checks if a task exists for a given username.
 * It first removes the '@' character from the username if it exists, then retrieves the ID associated with the username and the tasks from local storage.
 * If a task associated with the username and ID exists, it returns the task. Otherwise, it returns an empty string.
 *
 * @param {string} username - The username for which to check the task.
 * @returns {string} The task associated with the given username, or an empty string if no task exists.
 */
function checkTask(username) {
	// remove @ in username if it exists
	if (username[0] === "@") {
		username = username.slice(1);
	}

	let id = getID(username);
	let tasks = getTasks();

	if (tasks[`${username}-${id}`]) {
		return tasks[`${username}-${id}`].task;
	} else {
		return "";
	}
}

/**
 * This function allows an admin to delete all tasks associated with a given username.
 * It first removes the '@' character from the username if it exists, then retrieves the tasks from local storage.
 * It then iterates over all tasks and deletes those associated with the username.
 * After all tasks are deleted, it resets the ID associated with the username to 0, saves the tasks back to local storage, and re-renders the task list.
 *
 * @param {string} username - The username for which to delete all tasks.
 */
function adminDeleteTask(username) {
	// remove @ in username if it exists
	if (username[0] === "@") {
		username = username.slice(1);
	}

	// allows admin to delete all tasks from username
	let tasks = getTasks();

	// get all tasks that has username as the keys and delete them
	for (let task in tasks) {
		if (task.split("-")[0] === username) {
			delete tasks[task];
		}
	}

	// reset id to 0
	let usernames_id = JSON.parse(localStorage.usernames_id);
	usernames_id[username] = 0;
	localStorage.setItem(`usernames_id`, JSON.stringify(usernames_id));

	saveTasks(tasks);
	renderTaskList();
	cancelAnimation();
}

/**
 * This function clears all completed tasks from the task list.
 * It retrieves the tasks from local storage, iterates over them, and deletes those marked as done.
 * After all completed tasks are deleted, it saves the tasks back to local storage and re-renders the task list.
 */
function cleardone() {
	let tasks = getTasks();

	for (let task in tasks) {
		if (tasks[task].done) {
			delete tasks[task];
		}
	}

	saveTasks(tasks);
	renderTaskList();
	cancelAnimation();
}

/**
 * This function creates a promise that resolves after a specified number of milliseconds.
 *
 * @param {number} ms - The number of milliseconds to wait before the promise resolves.
 * @returns {Promise} A promise that resolves after the specified number of milliseconds.
 */
function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * This function animates the task list by scrolling it up and down once.
 * It first calculates the heights of the task container and task wrapper.
 * If the task container height is greater than the task wrapper height and the task list is not currently scrolling, it calculates the final height and duration of the animation,
 * creates the keyframes and options for the animation, and then creates and plays the animation.
 * If the task list is currently scrolling, it hides the secondary task list and cancels the animation.
 */
async function animate() {
	// task container height
	let taskContainer = document.querySelector(".task-container");
	let taskContainerHeight = taskContainer.scrollHeight;

	let taskWrapper = document.querySelector(".task-wrapper");
	let taskWrapperHeight = taskWrapper.clientHeight;

	// scroll task wrapper up and down once
	if (taskContainerHeight > taskWrapperHeight && !scrolling) {
		let secondaryElement = document.querySelector(".secondary");
		secondaryElement.style.display = "flex";

		let finalHeight = taskContainerHeight + configs.styles.gapBetweenScrolls;
		let duration = (finalHeight / configs.styles.pixelsPerSecond) * 1000;

		// keyframes object in css scroll
		let primaryKeyFrames = [
			{ transform: `translateY(0)` },
			{ transform: `translateY(-${finalHeight}px)` },
		];

		let secondaryKeyFrames = [
			{ transform: `translateY(${finalHeight}px)` },
			{ transform: `translateY(0)` },
		];

		let options = {
			duration: duration,
			iterations: 1,
			easing: "linear",
		};

		// create animation object and play it
		primaryAnimation = document
			.querySelector(".primary")
			.animate(primaryKeyFrames, options);

		secondaryAnimation = document
			.querySelector(".secondary")
			.animate(secondaryKeyFrames, options);

		primaryAnimation.play();
		secondaryAnimation.play();

		// wait for animation to finish
		scrolling = true;

		addAnimationListeners();
	} else if (!scrolling) {
		document.querySelector(".secondary").style.display = "none";

		// cancel animations
		cancelAnimation();
	}
}

/**
 * This function adds event listeners to the primary animation.
 * If the primary animation exists, it adds 'finish' and 'cancel' event listeners that both trigger the animationFinished function.
 */
function addAnimationListeners() {
	if (primaryAnimation) {
		primaryAnimation.addEventListener("finish", animationFinished);
		primaryAnimation.addEventListener("cancel", animationFinished);
	}
}

/**
 * This function is triggered when the primary animation finishes or is cancelled.
 * It sets the scrolling flag to false, re-renders the task list, and then starts the animation again.
 */
function animationFinished() {
	scrolling = false;
	renderTaskList();
	animate();
}

/**
 * This function cancels the primary and secondary animations if they exist.
 * It also sets the scrolling flag to false.
 */
function cancelAnimation() {
	if (primaryAnimation) {
		primaryAnimation.cancel();
	}
	if (secondaryAnimation) {
		secondaryAnimation.cancel();
	}
	scrolling = false;
}

/**
 * This function tests the task list functionality with a list of streamers.
 * It loops through the list of streamers, adds a task for each streamer, waits for 100 milliseconds, and then marks the task as done.
 * It then waits for 1000 milliseconds before moving on to the next streamer.
 */
async function tests() {
	let listOfStreamers = [
		`cloudydayzzz`,
		`berryspace`,
		`MohFocus`,
		`xeno_hiraeth`,
		`euphie___`,
		`unknownnie`,
		`theyolotato`,
		`charliosaurus`,
		`jutstreams`,
		`mikewhatwhere`,
		`studypaws`,
		`pcc_lanezzz`,
		`workwithjandj`,
		`studylena`,
	];

	// loop through list of streamers
	for (let i = 0; i < listOfStreamers.length; i++) {
		addTask(listOfStreamers[i], "#fff", `test task ${i}`);
		await sleep(100);
		doneTask(listOfStreamers[i]);

		await sleep(1000);
	}
}

/**
 * This function converts a hex color code to an RGB color code.
 * It first checks if the hex code includes the '#' character and removes it if present.
 * Then, it checks the length of the hex code.
 * If it's 3, it duplicates each character to create a 6-digit hex code.
 * If it's 6, it uses the hex code as is.
 * Finally, it converts each pair of hex digits to decimal to get the RGB values and returns them as a string.
 *
 * @param {string} hex - The hex color code to be converted.
 * @returns {string} The RGB color code.
 */
function hexToRgb(hex) {
	// remove # if present
	if (hex[0] === "#") {
		hex = hex.slice(1);
	}

	let r = 0,
		g = 0,
		b = 0;

	if (hex.length == 3) {
		// 3 digits
		r = "0x" + hex[0] + hex[0];
		g = "0x" + hex[1] + hex[1];
		b = "0x" + hex[2] + hex[2];
	} else if (hex.length == 6) {
		// 6 digits
		r = "0x" + hex[0] + hex[1];
		g = "0x" + hex[2] + hex[3];
		b = "0x" + hex[4] + hex[5];
	}

	// interger value of rgb
	r = +r;
	g = +g;
	b = +b;

	return `${r}, ${g}, ${b}`;
}

let currentTitle = 0;
// interval the task title
setInterval(async () => {
	let taskTitle = document.getElementById("command-code");

	// cycle through a list of titles
	const titles = configs.titles;

	// if current title is the last title, set it to the first title
	if (currentTitle === titles.length - 1) {
		currentTitle = 0;
	} else {
		currentTitle++;
	}

	// on change title, add fade animation
	taskTitle.classList.add("fade");
	await sleep(500);

	// set new title
	taskTitle.innerText = titles[currentTitle];

	await sleep(100);

	// remove fade animation
	taskTitle.classList.remove("fade");
}, 8000);

// on window load
window.onload = function () {
	importStyles();

	setupDB();
	if (configs.settings.enableTests) {
		resetDB();
		tests();
	}
	renderTaskList();
};
