import App from "./app.js";
import TwitchChat from "./twitch/TwitchChat.js";

const { twitch_channel, twitch_oauth, twitch_username } = configs.auth;

window.addEventListener("load", () => {
	const app = new App();
	app.render();

	const client = new TwitchChat({
		username: twitch_username,
		authToken: twitch_oauth,
		channel: twitch_channel,
	});

	client.on("command", (data) => {
		const { user, command, message, flags, extra } = data;
		const response = app.chatHandler(user, command, message, flags, extra);
		if (!response.error) {
			client.say(response, extra.messageId);
		}
	});
	client.connect();
});
