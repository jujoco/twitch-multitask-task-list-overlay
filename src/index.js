import UserList from "./classes/UserList.js";
import { loadStyles } from "./styleLoader.js";
import { fadeInOutHelpCommands } from "./animations/fadeCommands.js";
import { loadTestUsers, renderTaskListToDOM } from "./app.js";
import { chatHandler } from "./chatHandler.js";
import TwitchChat from "./twitch/TwitchChat.js";

const { twitch_channel, twitch_oauth, twitch_username } = configs.auth;

window.addEventListener("load", () => {
	window.userList = new UserList();
	loadStyles();
	fadeInOutHelpCommands();
	if (configs.settings.testMode) {
		window.userList.users = loadTestUsers();
	}

	const client = new TwitchChat({
		username: twitch_username,
		authToken: twitch_oauth,
		channel: twitch_channel,
	});
	client.on("command", (data) => {
		const { user, command, message, flags, extra } = data;
		const response = chatHandler(user, command, message, flags, extra);
		if (response) {
			client.say(response, extra.messageId);
		}
		renderTaskListToDOM(window.userList.users);
	});
	client.connect();

	renderTaskListToDOM(window.userList.users);
});
