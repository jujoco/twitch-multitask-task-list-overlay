const auth = (function () {
	// Authentication and channel - required
	const channel = "Jujoco"; // your channel
	const username = "Jujoco"; // your channel or bot account

	// Generate your token here: https://twitchapps.com/tmi/
	// Example Token: "oauth:1a2b3c4d5e6f7g8h9i1j2k3l"
	const oauth = "YOUR_TWITCH_OAUTH_TOKEN_HERE";
	return {
		channel,
		username,
		oauth,
	};
})();
