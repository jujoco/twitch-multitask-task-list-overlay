import { parseMessage } from "./message-parsers";
import EventEmitter from "./EventEmitter";

/**
 * @class TwitchChat
 * @extends EventEmitter
 * @property {string }
 * @method connect
 * @method say
 * @method handleMessage
 * @method close
 */
class TwitchChat extends EventEmitter {
	/**
	 * @constructor
	 * @param {Object} options
	 * @param {string} options.username - Twitch username
	 * @param {string} options.authToken - Twitch OAuth token
	 * @param {string} options.channel - Twitch channel name
	 */
	constructor({ username, authToken, channel }) {
		super();
		this.username = username;
		this.authToken = authToken;
		this.channel = channel;
		this.ws = null;
	}

	/**
	 * @param {string} url
	 * @returns {void}
	 */
	connect(url = "ws://irc-ws.chat.twitch.tv:80") {
		this.ws = new WebSocket(url);

		this.ws.onopen = () => {
			console.log("Connected to Twitch IRC");
			this.ws.send(`PASS ${this.authToken}`);
			this.ws.send(`NICK ${this.username}`);
			this.ws.send(`JOIN #${this.channel}`);
		};

		this.ws.onerror = (error) => {
			console.error("Error connecting to Twitch IRC", error);
		};

		this.ws.onmessage = (message) => {
			this.handleMessage(message.data);
		};

		this.ws.onclose = () => {
			console.log("Disconnected from Twitch IRC");
		};
	}

	/**
	 * @param {string} message
	 * @returns {void}
	 */
	say(message) {
		if (this.ws.readyState === WebSocket.OPEN) {
			this.ws.send(`PRIVMSG #${this.channel} :${message}`);
		} else {
			console.error("Connection is not open");
		}
	}

	/**
	 * @param {string} data
	 * @returns {void}
	 */
	handleMessage(ircMessage) {
		// You would parse the message here and emit specific events as needed
		// For example, checking for chat messages or server pings
		console.log(ircMessage); // Simple log for demonstration
		if (ircMessage.type === "utf8") {
			let rawIrcMessage = ircMessage.utf8Data.trimEnd();
			console.log(
				`Message received (${new Date().toISOString()}): '${rawIrcMessage}'\n`
			);

			let messages = rawIrcMessage.split("\r\n"); // The IRC message may contain one or more messages.
			messages.forEach((message) => {
				debugger;
				let parsedMessage = parseMessage(message);

				if (parsedMessage) {
					console.log(
						`Message command: ${parsedMessage.command.command}`
					);
					console.log(`\n${JSON.stringify(parsedMessage, null, 3)}`);

					switch (parsedMessage.command.command) {
						case "PRIVMSG":
							// handle chat command here with a prefix of "!"
							this.emit("message", parsedMessage);
							break;
						case "PING":
							console.log("Received PING from server");
							this.ws.send("PONG " + parsedMessage.parameters);
							break;
						case "001":
							// Successfully logged in, so join the channel.
							this.ws.send(`JOIN ${channel}`);
							break;
						case "JOIN":
							this.ws.send(`PRIVMSG ${channel} :JOIN CASE`);
							break;
						case "PART":
							console.log(
								"The channel must have banned (/ban) the bot."
							);
							this.ws.close();
							break;
						case "NOTICE":
							// If the authentication failed, leave the channel.
							// The server will close the connection.
							if (
								"Login authentication failed" ===
								parsedMessage.parameters
							) {
								console.log(
									`Authentication failed; left ${channel}`
								);
								this.ws.send(`PART ${channel}`);
							} else if (
								"You don't have permission to perform that action" ===
								parsedMessage.parameters
							) {
								console.log(
									`No permission. Check if the access token is still valid. Left ${channel}`
								);
								this.ws.send(`PART ${channel}`);
							}
							break;
						default: // Ignore all other IRC messages.
					}
				}
			});
		}
	}

	/**
	 * @returns {void}
	 */
	close() {
		if (this.ws) {
			this.ws.close();
		}
	}
}

export default TwitchChat;
