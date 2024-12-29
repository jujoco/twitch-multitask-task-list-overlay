import App from "./app.js";
import { closeModal, openModal } from "./modal.js";
import TwitchChat from "./twitch/TwitchChat.js";
import { loadTestUsers } from "./twitch/loadTestUsers.js";

const {
	twitch_channel, twitch_oauth, twitch_username
} = _authConfig;

const twitchIRC = "ws://irc-ws.chat.twitch.tv:80";
const client = new TwitchChat(twitchIRC, {
	username: twitch_username,
	authToken: twitch_oauth,
	channel: twitch_channel,
});

window.addEventListener("load", () => {
	let storeName = "userList";
	if (_settings.testMode) {
		console.log("Test mode enabled");
		storeName = "testUserList";
	}
	const app = new App(storeName);
	app.render();

	client.on("command", (data) => {
		const { user, command, message, flags, extra } = data;
		const response = app.chatHandler(user, command, message, flags, extra);
		if (!response.error) {
			client.say(response.message, extra.messageId);
		} else {
			// error logs also are added to OBS logs
			console.error(response.message);
		}
	});

	client.on("oauthError", () => {
		openModal();
	});

	client.on("oauthSuccess", () => {
		closeModal();
	});

	client.connect();
	if (_settings.testMode) loadTestUsers(client);
});
