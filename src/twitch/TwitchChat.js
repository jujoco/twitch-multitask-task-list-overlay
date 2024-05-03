import { parseIRCMessage } from "./message-parsers";
import EventEmitter from "../classes/EventEmitter";

/**
 * @class TwitchChat
 * @extends EventEmitter
 * @method connect - Connects to the Twitch IRC server
 * @method say - Sends a message to the Twitch channel
 * @method close - Closes the WebSocket connection
 */
export default class TwitchChat extends EventEmitter {
	/**
	 * @type WebSocket | null
	 * @private
	 */
	#ws = null;

	/**
	 * @constructor
	 * @param {Object} options
	 * @param {string} options.username - Twitch username
	 * @param {string} options.authToken - Twitch OAuth token
	 * @param {string} options.channel - Twitch channel name
	 */
	constructor({ username, authToken, channel }) {
		super();
		this.username = username.toLowerCase();
		this.channel = `#${channel.toLowerCase()}`;
		this.authToken = authToken;
	}

	/**
	 * Connects to the Twitch IRC server
	 * @param {string} url
	 * @returns {void}
	 */
	connect(url = "ws://irc-ws.chat.twitch.tv:80") {
		this.#ws = new WebSocket(url);

		this.#ws.onopen = () => {
			this.#ws.send("CAP REQ :twitch.tv/tags twitch.tv/commands");
			this.#ws.send(`PASS ${this.authToken}`);
			this.#ws.send(`NICK ${this.username}`);
			console.log("Authenticating with Twitch IRC server...");
		};

		this.#ws.onerror = (error) => {
			console.error("Error connecting to Twitch IRC", error);
		};

		this.#ws.onmessage = (message) => {
			this.#handleMessage(message.data);
		};

		this.#ws.onclose = () => {
			console.log("Disconnected from Twitch IRC");
		};
	}

	/**
	 * Sends a message to the Twitch channel
	 * @param {string} message
	 * @param {string} id
	 * @returns {void}
	 */
	say(message, messageId) {
		if (this.#ws.readyState === WebSocket.OPEN) {
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
	 * Parses the IRC message and emits a "command" event
	 * @private
	 * @param {string} ircMessage
	 * @returns {void}
	 */
	#handleMessage(ircMessage) {
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
						// Successfully logged in, so join the channel.
						this.#ws.send(`JOIN ${this.channel}`);
						break;
					case "JOIN":
						console.log(`Joined ${this.channel}`);
						break;
					case "PART":
						console.log(
							"The channel must have banned (/ban) the bot."
						);
						this.#ws.close();
						break;
					case "NOTICE":
						// If the authentication failed, leave the channel.
						// The server will close the connection.
						if (
							"Login authentication failed" ===
							parsedMessage.parameters
						) {
							console.log(
								`Authentication failed; left ${this.channel}`
							);
							this.#ws.send(`PART ${this.channel}`);
						} else if (
							"You don't have permission to perform that action" ===
							parsedMessage.parameters
						) {
							console.log(
								`No permission. Check if the access token is still valid. Left ${this.channel}`
							);
							this.#ws.send(`PART ${this.channel}`);
						}
						break;
					default: // Ignore all other IRC messages.
				}
			}
		});
	}

	/**
	 * Closes the WebSocket connection
	 * @returns {void}
	 */
	close() {
		if (this.#ws) {
			this.#ws.close();
		}
	}
}

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
