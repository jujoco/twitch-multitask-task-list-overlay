// ===========================
// Bot Behavior Settings
// ===========================
/** @type {SettingsConfig} */
const _settings = {
	languageCode: 'EN', // "EN", "ES", "FR", "JP", "UA", "DE", "PT_BR"
	maxTasksPerUser: 20, // default number 20
	scrollSpeed: 30, // default number 40
	showUsernameColor: true, // true or false
	headerFeature: 'timer', // "timer", "commands", "text", "tasks-only"
	headerCustomText: 'Custom Text', // headerFeature above must be "text"
	botResponsePrefix: '🤖💬 ', // default bot message prefix
	pomodoro: {
		// defaults are used by the timer.
		sessionLength: 60, // minutes per focus session
		breakLength: 10, // minutes per break
		sessions: 1, // number of focus sessions (when running as a Pomodoro)
	},
	testMode: false, // true or false - for testing purposes
};
