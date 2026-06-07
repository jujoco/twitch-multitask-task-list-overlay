import EventEmitter from './EventEmitter.js';
import { type ParsedMessage, parseIRCMessage } from './message-parsers.js';
import type { CommandData } from './types.js';

interface TwitchChatOptions {
	username: string;
	authToken: string;
	channel: string;
}

/**
 * WebSocket IRC client for Twitch chat. Emits "command", "oauthSuccess",
 * "oauthError", and "phoneVerificationRequired" events.
 */
export default class TwitchChat extends EventEmitter {
	#ws: WebSocket | null = null;
	#reconnectInterval = 1000; // milliseconds
	url: string;
	username: string;
	channel: string;
	authToken: string;
	WebSocketService: typeof WebSocket;

	constructor(
		url: string,
		{ username, authToken, channel }: TwitchChatOptions,
		WebSocketService: typeof WebSocket = WebSocket,
	) {
		super();
		this.url = url;
		this.username = username.toLowerCase();
		this.channel = `#${channel.toLowerCase()}`;
		this.authToken = authToken.includes('oauth:') ? authToken : `oauth:${authToken}`;
		this.WebSocketService = WebSocketService;
	}

	/**
	 * Connects to the Twitch IRC server
	 */
	connect(): void {
		const ws = new this.WebSocketService(this.url);
		this.#ws = ws;

		ws.onopen = () => {
			// Authenticating with Twitch IRC server
			ws.send('CAP REQ :twitch.tv/tags twitch.tv/commands');
			ws.send(`PASS ${this.authToken}`);
			ws.send(`NICK ${this.username}`);
		};

		ws.onerror = (error) => {
			console.error('websocket error: ', error);
			return error;
		};

		ws.onmessage = (message: MessageEvent) => {
			const ircMessage = message?.data;
			const messages = ircMessage.trim().split('\r\n');
			messages.forEach((message: string) => {
				const parsedMessage = parseIRCMessage(message);
				if (parsedMessage?.command) {
					switch (parsedMessage.command.command) {
						case 'PRIVMSG':
							if (parsedMessage.parameters?.startsWith('!')) {
								const data = convertToCommandFormat(parsedMessage);
								this.emit('command', data);
							}
							break;
						case 'PING':
							ws.send(`PONG ${parsedMessage.parameters}`);
							break;
						case '001':
							ws.send(`JOIN ${this.channel}`);
							break;
						case 'JOIN':
							console.log(`Joined ${this.channel}`);
							this.#reconnectInterval = 1000;
							this.emit('oauthSuccess');
							break;
						case 'RECONNECT':
							this.disconnect(
								1012,
								'The Twitch IRC server is terminating the connection for maintenance reasons.',
							);
							break;
						case 'PART':
							console.error('The channel must have banned (/ban) the bot.');
							ws.close();
							break;
						case 'NOTICE':
							// Genuine auth failures arrive on the "*" channel; notices scoped to
							// the real channel are operational (rate limits, duplicates, etc.).
							if (parsedMessage.command.channel === '*') {
								console.error(`${parsedMessage.parameters}; left ${this.channel}`);
								this.emit('oauthError');
								ws.send(`PART ${this.channel}`);
							} else {
								console.warn(`Twitch NOTICE: ${parsedMessage.parameters}`);
								// Twitch blocks chat until the account verifies a phone number;
								// surface it in the UI since users forget the bot account.
								const msgId = parsedMessage.tags?.['msg-id'];
								if (
									msgId === 'msg_requires_verified_phone_number' ||
									/verified phone number/i.test(parsedMessage.parameters || '')
								) {
									this.emit('phoneVerificationRequired');
								}
							}
							break;
						default: // Ignore all other IRC messages.
					}
				}
			});
		};

		ws.onclose = (event: CloseEvent) => {
			switch (event.code) {
				case 1000:
					console.log('Connection closed normally.');
					break;
				case 1006: {
					// If your connection is dropped, try reconnecting
					// using an exponential backoff approach.
					console.error(
						`Connection dropped. Reconnecting in ${this.#reconnectInterval} milliseconds...`,
					);
					// recursive delay reconnection attempts
					const reconnectInterval = this.#reconnectInterval;
					setTimeout(() => {
						this.connect();
					}, reconnectInterval);
					this.#reconnectInterval = this.#reconnectInterval * 2;
					break;
				}
				case 1012:
					console.log(`Switching  servers...`);
					this.connect();
					break;
				default:
					console.error(`Unhandled code: ${event.code}. Reason: ${event.reason}`);
			}
		};
	}

	/**
	 * Sends a message to the Twitch channel
	 */
	say(message: string, messageId?: string): void {
		const ws = this.#ws;
		if (ws?.readyState === WebSocket.OPEN) {
			const reply = messageId ? `@reply-parent-msg-id=${messageId}` : '';
			const fullMessage = [reply, 'PRIVMSG', this.channel, `:${message}`].join(' ').trim();
			ws.send(fullMessage);
		} else {
			console.error('Connection is not open');
		}
	}

	/**
	 * Disconnects from the Twitch IRC server
	 */
	disconnect(code = 1000, reason = ''): void {
		this.#ws?.close(code, reason);
	}
}

/**
 * Converts a parsed message to the "command" event payload format.
 */
function convertToCommandFormat(message: ParsedMessage): CommandData {
	return {
		user: message.tags?.['display-name'] ?? '',
		command: message.command?.botCommand ?? '',
		message: message.command?.botCommandParams || '',
		flags: {
			broadcaster: !!message.tags?.badges?.broadcaster,
			mod: !!message.tags?.badges?.moderator,
		},
		extra: {
			userColor: message.tags?.color,
			messageId: message.tags?.id,
		},
	};
}
