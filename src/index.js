import ComfyJS from "comfy.js";
import UserList from "./classes/UserList.js";
import { loadStyles } from "./styleLoader.js";
import { loadTestUsers, renderTaskListToDOM } from "./app.js";
import { chatHandler } from "./chatHandler.js";

const { twitch_channel, twitch_oauth, twitch_username } = configs.auth;

window.addEventListener("load", () => {
	window.userList = new UserList();
	loadStyles();
	if (configs.settings.testMode) {
		window.userList.users = loadTestUsers();
	}

	ComfyJS.Init(twitch_username, twitch_oauth, [twitch_channel]);
	ComfyJS.onCommand = (user, command, message, flags, extra) => {
		const response = chatHandler(user, command, message, flags, extra);
		ComfyJS.Say(response);
		renderTaskListToDOM(window.userList.users);
	};

	renderTaskListToDOM(window.userList.users);
});
