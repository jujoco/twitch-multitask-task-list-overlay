import App from './app.js';
import TaskCommandHandler from './classes/TaskCommandHandler.js';
import TimerCommandHandler from './classes/TimerCommandHandler.js';
import { closeModal, openModal } from './modal.js';
import { loadTestUsers } from './twitch/loadTestUsers.js';
import TwitchChat from './twitch/TwitchChat.js';
import type { CommandData } from './twitch/types.js';

const { twitch_channel, twitch_oauth, twitch_username } = _authConfig;

const twitchIRC = 'wss://irc-ws.chat.twitch.tv:443';
const client = new TwitchChat(twitchIRC, {
	username: twitch_username,
	authToken: twitch_oauth,
	channel: twitch_channel,
});

window.addEventListener('load', () => {
	let storeName = 'userList';
	if (_settings.testMode) {
		console.log('Test mode enabled');
		storeName = 'testUserList';
	}
	const app = new App(storeName);
	app.render();
	app.setSayCallback((message: string) => client.say(message));

	const taskCommandHandler = new TaskCommandHandler(app.userList, app);
	const timerCommandHandler = new TimerCommandHandler(app);

	client.on('command', (data: CommandData) => {
		const { user, command, message, flags, extra } = data;
		const response =
			timerCommandHandler.handle(user, command, message, flags) ??
			taskCommandHandler.handle(user, command, message, flags, extra);
		if (!response.error) {
			client.say(response.message, extra.messageId);
		} else {
			console.error(response.message);
		}
	});

	client.on('oauthError', () => {
		openModal();
	});

	client.on('oauthSuccess', () => {
		closeModal();
	});

	client.on('phoneVerificationRequired', () => {
		openModal('phone-modal');
	});

	client.connect();
	if (_settings.testMode) loadTestUsers(client);
});
