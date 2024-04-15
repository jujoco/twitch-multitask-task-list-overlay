import UserList from "./classes/UserList.js";
import { loadStyles } from "./styleLoader.js";
import { loadTestUsers, renderTaskListToDOM } from "./app.js";
import { mountChatHandler } from "./chatHandler.js";

window.addEventListener("load", () => {
	window.userList = new UserList();
	loadStyles();
	mountChatHandler();
	if (configs.settings.testMode) {
		window.userList.users = loadTestUsers();
	}
	renderTaskListToDOM(window.userList.users);
});
