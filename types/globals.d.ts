// Ambient types for the user-editable config files (_auth.js, _settings.js,
// _styles.js, _configAdmin.js, _configUser.js). These files remain plain JS and
// declare the globals (_authConfig, _settings, _styles, _adminConfig,
// _userConfig) at script scope; here we describe their shapes.

interface AuthConfig {
	twitch_oauth: string;
	twitch_channel: string;
	twitch_username: string;
}

interface SettingsConfig {
	languageCode: string;
	maxTasksPerUser: number;
	scrollSpeed: number;
	showUsernameColor: boolean;
	headerFeature: string;
	headerCustomText: string;
	botResponsePrefix: string;
	testMode: boolean;
}

// All style values are CSS strings keyed by camelCase property name
type StyleConfig = Record<string, string>;

interface AdminCommands {
	timer: string[];
	clearList: string[];
	clearDone: string[];
	clearUser: string[];
}

interface AdminResponse {
	timer: string;
	clearList: string;
	clearDone: string;
	clearUser: string;
}

interface AdminConfig {
	commands: AdminCommands;
	responseTo: Record<string, AdminResponse>;
}

interface UserCommands {
	addTask: string[];
	editTask: string[];
	finishTask: string[];
	deleteTask: string[];
	focusTask: string[];
	check: string[];
	help: string[];
	additional: string[];
}

interface UserResponse {
	addTask: string;
	editTask: string;
	finishTask: string;
	deleteTask: string;
	deleteAll: string;
	focusTask: string;
	check: string;
	help: string;
	additional: string;
	maxTasksAdded: string;
	noTaskFound: string;
	invalidCommand: string;
}

interface UserConfig {
	commands: UserCommands;
	responseTo: Record<string, UserResponse>;
}
