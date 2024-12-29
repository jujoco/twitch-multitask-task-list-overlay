import { parseIRCMessage } from "./message-parsers";
import EventEmitter from "./EventEmitter";

/**
 * @class TwitchChat
 * @extends EventEmitter
 * @method connect - Connects to the Twitch IRC server
 * @method say - Sends a message to the Twitch channel
 * @method disconnect - Disconnect the WebSocket connection
 */
export default class TwitchChat extends EventEmitter {
	/**
	 * @type {WebSocket | null}
	 */
	#ws = null;
	#reconnectInterval = 1000; // milliseconds

	/**
	 * @constructor
	 * @param {string} url - WebSocket connection url
	 * @param {Object} options
	 * @param {string} options.username - Twitch username
	 * @param {string} options.authToken - Twitch OAuth token
	 * @param {string} options.channel - Twitch channel name
	 * @param {Object} [WebSocketService] - WebSocket service
	 */
	constructor(
		url,
		{ username, authToken, channel },
		WebSocketService = WebSocket
	) {
		super();
		this.url = url;
		this.username = username.toLowerCase();
		this.channel = `#${channel.toLowerCase()}`;
		this.authToken = authToken.includes("oauth:")
			? authToken
			: `oauth:${authToken}`;
		this.WebSocketService = WebSocketService;
	}

	/**
	 * Connects to the Twitch IRC server
	 * @returns {void}
	 */
	connect() {
		this.#ws = new this.WebSocketService(this.url);

		this.#ws.onopen = () => {
			// Authenticating with Twitch IRC server
			this.#ws.send("CAP REQ :twitch.tv/tags twitch.tv/commands");
			this.#ws.send(`PASS ${this.authToken}`);
			this.#ws.send(`NICK ${this.username}`);
		};

		this.#ws.onerror = (error) => {
			console.error("websocket error: ", error);
			return error;
		};

		this.#ws.onmessage = (message) => {
			let ircMessage = message?.data;
			const messages = ircMessage.trim().split("\r\n");
			messages.forEach((message) => {
				const parsedMessage = parseIRCMessage(message);
				if (parsedMessage) {
					switch (parsedMessage.command.command) {
						case "PRIVMSG":
							if (parsedMessage.parameters.startsWith("!")) {
								const data = convertToCommandFormat(parsedMessage);
								this.emit("command", data);
							}
							break;
						case "PING":
							this.#ws.send("PONG " + parsedMessage.parameters);
							break;
						case "001":
							this.#ws.send(`JOIN ${this.channel}`);
							break;
						case "JOIN":
							console.log(`Joined ${this.channel}`);
							this.#reconnectInterval = 1000;
							this.emit("oauthSuccess");
							break;
						case "RECONNECT":
							this.disconnect(
								1012,
								"The Twitch IRC server is terminating the connection for maintenance reasons."
							);
							break;
						case "PART":
							console.error("The channel must have banned (/ban) the bot.");
							this.#ws.close();
							break;
						case "NOTICE":
							// If the authentication failed, leave the channel.
							// The server will close the connection.
							console.error(`${parsedMessage.parameters}; left ${this.channel}`);
							this.emit("oauthError");
							this.#ws.send(`PART ${this.channel}`);
							break;
						default: // Ignore all other IRC messages.
					}
				}
			});
		};

		this.#ws.onclose = (event) => {
			switch (event.code) {
				case 1000:
					console.log("Connection closed normally.");
					break;
				case 1006:
					// If your connection is dropped, try reconnecting
					// using an exponential backoff approach.
					console.error(
						`Connection dropped. Reconnecting in ${this.#reconnectInterval
						} milliseconds...`
					);
					// recursive delay reconnection attempts
					let reconnectInterval = this.#reconnectInterval;
					setTimeout(() => {
						this.connect();
					}, reconnectInterval);
					this.#reconnectInterval = this.#reconnectInterval * 2;
					break;
				case 1012:
					console.log(`Switching  servers...`);
					this.connect();
					break;
				default:
					console.error(
						`Unhandled code: ${event.code}. Reason: ${event.reason}`
					);
			}
		};
	}

	/**
	 * Sends a message to the Twitch channel
	 * @param {string} message
	 * @param {string} [messageId]
	 * @returns {void}
	 */
	say(message, messageId) {
		if (this.#ws?.readyState === WebSocket.OPEN) {
			let reply = messageId ? `@reply-parent-msg-id=${messageId}` : "";
			const fullMessage = [reply, "PRIVMSG", this.channel, `:${message}`]
				.join(" ")
				.trim();
			this.#ws.send(fullMessage);
		} else {
			console.error("Connection is not open");
		}
	}

	/**
	 * Disconnects from the Twitch IRC server
	 * @param {number} code - WebSocket close code
	 * @param {string} reason - WebSocket close reason
	 * @returns {void}
	 */
	disconnect(code = 1000, reason = "") {
		this.#ws.close(code, reason);
	}
}

/**
 * Converts a parsed message to a command format
 * @param {Object} message
 * @returns {Object}
 */
function convertToCommandFormat(message) {
	return {
		user: message.tags["display-name"],
		command: message.command.botCommand,
		message: message.command.botCommandParams || "",
		flags: {
			broadcaster: !!message.tags.badges?.broadcaster,
			mod: !!message.tags.badges?.moderator,
		},
		extra: {
			userColor: message.tags.color,
			messageId: message.tags.id,
		},
	};
}
