// This file is used to store your Twitch authentication credentials
// Rename file to auth.js and replace the values with your own
// Do not share this file or your credentials
const auth = (function () {
	// Authentication and channel - required
	const channel = "Jujoco"; // <-- your channel
	const username = "Jujoco"; // <-- your channel or bot account

	// Generate your token here: https://twitchapps.com/tmi/
	// Example Token: "oauth:1a2b3c4d5e6f7g8h9i1j2k3l"
	// Replace YOUR_TWITCH_OAUTH_TOKEN_HERE with your OAuth token
	const oauth = "YOUR_TWITCH_OAUTH_TOKEN_HERE";
	return {
		channel,
		username,
		oauth,
	};
})();
