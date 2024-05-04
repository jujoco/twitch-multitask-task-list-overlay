/**
 * @typedef {object} parsedMessage
 * @property {object | null} command
 * @property {object | null} source
 * @property {object | null} tags
 * @property {string | null} parameters
 */

/**
 * Parses an IRC message and returns a parsed object containing the message's component parts.
 * @param {string} message
 * @returns {parsedMessage | null}
 */
export function parseIRCMessage(message) {
	const parsedMessage = {
		command: null,
		parameters: null,
		source: null,
		tags: null,
	};
	let idx = 0;
	let rawTagsComponent = null;
	let rawSourceComponent = null;
	let rawCommandComponent = null;
	let rawParametersComponent = null;

	// Get the raw tags component of the IRC message.
	// example: "@badge-info=;badges=broadcaster/1;color=#0000FF;"
	if (message[idx] === "@") {
		let endIdx = message.indexOf(" ");
		rawTagsComponent = message.slice(1, endIdx);
		idx = endIdx + 1; // Should now point to source colon (:).
	}

	// Get the raw source component of the IRC message (otherwise it's a PING command).
	// example: ":username1!username1@username1.tmi.twitch.tv"
	if (message[idx] === ":") {
		idx += 1;
		let endIdx = message.indexOf(" ", idx);
		rawSourceComponent = message.slice(idx, endIdx);
		idx = endIdx + 1;
	}

	// Get the raw command component of the IRC message.
	// example: "PRIVMSG #jujococs"
	let endIdx = message.indexOf(":", idx); // Looking for the parameters part of the message.
	if (-1 === endIdx) {
		// But not all messages include the parameters part.
		endIdx = message.length;
	}
	rawCommandComponent = message.slice(idx, endIdx).trim();
	// Get the raw parameters component of the IRC message.
	// example: ":!taskAdd walk the dog"
	if (endIdx !== message.length) {
		idx = endIdx + 1; // skip the colon (:)
		rawParametersComponent = message.slice(idx);
	}

	// Parse the command component of the IRC message.
	parsedMessage.command = parseCommand(rawCommandComponent);

	// Only parse the rest of the components if it's a command we recognize.
	if (parsedMessage.command === null) {
		return null;
	} else {
		if (rawTagsComponent !== null) {
			parsedMessage.tags = parseTags(rawTagsComponent);
		}

		parsedMessage.source = parseSource(rawSourceComponent);
		parsedMessage.parameters = rawParametersComponent;
		if (rawParametersComponent && rawParametersComponent[0] === "!") {
			parsedMessage.command = parseParameters(
				rawParametersComponent,
				parsedMessage.command
			);
		}
	}

	return parsedMessage;
}

/**
 * Parses the command component of the IRC message.
 * @param {string} rawCommandComponent
 * @returns {object | null}
 */
function parseCommand(rawCommandComponent) {
	let parsedCommand = null;
	const commandParts = rawCommandComponent.split(" ");
	switch (commandParts[0]) {
		case "JOIN":
		case "PART":
		case "NOTICE":
		case "CLEARCHAT":
		case "HOSTTARGET":
		case "PRIVMSG":
			parsedCommand = {
				command: commandParts[0],
				channel: commandParts[1],
			};
			break;
		case "PING":
			parsedCommand = {
				command: commandParts[0],
			};
			break;
		case "CAP":
			parsedCommand = {
				command: commandParts[0],
				isCapRequestEnabled: commandParts[2] === "ACK",
			};
			break;
		case "GLOBALUSERSTATE":
			parsedCommand = {
				command: commandParts[0],
			};
			break;
		case "USERSTATE":
		case "ROOMSTATE":
			parsedCommand = {
				command: commandParts[0],
				channel: commandParts[1],
			};
			break;
		case "RECONNECT":
			// "The Twitch server is about to terminate the connection for maintenance."
			parsedCommand = {
				command: commandParts[0],
			};
			break;
		case "421":
			console.error(`Unsupported IRC command: ${commandParts[2]}`);
			return null;
		case "001":
			parsedCommand = {
				command: commandParts[0],
			};
			break;
		case "002":
		case "003":
		case "004":
		case "353":
		case "366":
		case "372":
		case "375":
		case "376":
			// console.log(`numeric message: ${commandParts[0]}`);
			return null;
		default:
			console.log(`Unexpected command: ${commandParts[0]}`);
			return null;
	}

	return parsedCommand;
}

/**
 * Raw tags are semicolon-separated key/value pairs.
 * @param {string} tags
 * @returns {object}
 */
function parseTags(tags) {
	// badge-info=;badges=broadcaster/1;color=#0000FF;...

	const tagsToIgnore = {
		// List of tags to ignore.
		"client-nonce": null,
		flags: null,
	};

	let dictParsedTags = {};
	let parsedTags = tags.split(";");
	parsedTags.forEach((tag) => {
		let parsedTag = tag.split("=");
		let tagValue = parsedTag[1] === "" ? null : parsedTag[1];

		switch (parsedTag[0]) {
			case "badges":
			case "badge-info":
				// badges=staff/1,broadcaster/1,turbo/1;

				if (tagValue) {
					let dict = {};
					// The key is the badge's name (e.g., subscriber).
					let badges = tagValue.split(",");
					badges.forEach((pair) => {
						let badgeParts = pair.split("/");
						dict[badgeParts[0]] = badgeParts[1];
					});
					dictParsedTags[parsedTag[0]] = dict;
				} else {
					dictParsedTags[parsedTag[0]] = null;
				}
				break;
			case "emotes":
				// emotes=25:0-4,12-16/1902:6-10
				if (tagValue) {
					let dictEmotes = {}; // Holds a list of emote objects.
					// The key is the emote's ID.
					let emotes = tagValue.split("/");
					emotes.forEach((emote) => {
						let emoteParts = emote.split(":");

						let textPositions = []; // The list of position objects that identify
						// the location of the emote in the chat message.
						let positions = emoteParts[1].split(",");
						positions.forEach((position) => {
							let positionParts = position.split("-");
							textPositions.push({
								startPosition: positionParts[0],
								endPosition: positionParts[1],
							});
						});

						dictEmotes[emoteParts[0]] = textPositions;
					});

					dictParsedTags[parsedTag[0]] = dictEmotes;
				} else {
					dictParsedTags[parsedTag[0]] = null;
				}

				break;
			case "emote-sets":
				// emote-sets=0,33,50,237
				let emoteSetIds = tagValue.split(","); // Array of emote set IDs.
				dictParsedTags[parsedTag[0]] = emoteSetIds;
				break;
			default:
				// If the tag is in the list of tags to ignore, ignore
				// it; otherwise, add it.

				if (tagsToIgnore.hasOwnProperty(parsedTag[0])) {
				} else {
					dictParsedTags[parsedTag[0]] = tagValue;
				}
		}
	});

	return dictParsedTags;
}

/**
 * Parses the source (nick and host) components of the IRC message.
 * @param {string} rawSourceComponent
 * @returns {object | null}
 */
function parseSource(rawSourceComponent) {
	if (null == rawSourceComponent) {
		// Not all messages contain a source
		return null;
	} else {
		let sourceParts = rawSourceComponent.split("!");
		return {
			nick: sourceParts.length == 2 ? sourceParts[0] : null,
			host: sourceParts.length == 2 ? sourceParts[1] : sourceParts[0],
		};
	}
}

/**
 * Parsing the IRC parameters component if it contains a command (e.g., !taskAdd).
 * @param {string} rawParametersComponent
 * @param {object} command
 * @returns {object}
 */
function parseParameters(rawParametersComponent, command) {
	let idx = 0;
	let commandParts = rawParametersComponent.slice(idx + 1).trim(); // remove the leading "!"
	let paramsIdx = commandParts.indexOf(" ");

	if (paramsIdx === -1) {
		command.botCommand = commandParts.slice(0);
		command.botCommandParams = "";
	} else {
		command.botCommand = commandParts.slice(0, paramsIdx);
		command.botCommandParams = commandParts.slice(paramsIdx).trim();
	}

	return command;
}
