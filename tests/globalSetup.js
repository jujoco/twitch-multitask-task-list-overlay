import { vi } from "vitest";

/** @type {AdminConfig} */
const _adminConfig = {
	commands: {
		timer: ["!timer"],
		clearList: ["!clearlist"],
		clearDone: ["!cleardone"],
		clearUser: ["!clearuser"],
	},
	responseTo: {
		EN: {
			timer: "Timer has been reset to {message} minutes",
			clearList: "All tasks have been cleared",
			clearDone: "All done tasks have been cleared",
			clearUser: "All tasks for {message} have been cleared",
		}
	},
};

/** @type {UserConfig} */
const _userConfig = {
	commands: {
		addTask: ["!task", "!add", "!añadir", "!ajouter", "!追加", "!додати"],
		editTask: ["!edit", "!editar", "!modifier", "!編集", "!редагувати"],
		finishTask: ["!done", "!hecho", "!terminé", "!完了", "!готово"],
		deleteTask: ["!delete", "!eliminar", "!supprimer", "!削除", "!видалити"],
		check: ["!check", "!comprobar", "!vérifier", "!チェック", "!перевірити"],
		help: ["!help", "!ayuda", "!aide", "!ヘルプ", "!допомога"],
		additional: ["!credit", "!crédito", "!crédit", "!クレジット", "!кредит"],
	},
	responseTo: {
		EN: {
			addTask: 'Task(s) {message} added!',
			editTask: 'Task {message} updated!',
			finishTask: 'Good job on completing task(s) {message}!',
			deleteTask: 'Task(s) {message} has been deleted!',
			deleteAll: "All of your tasks have been deleted!",
			check: 'Your current task(s) are: {message}',
			help: "Try using these commands - !task !edit !done !delete, !check",
			additional:
				"Jujoco is the creator of this bot, check out his Twitch at: https://www.twitch.tv/Jujoco_Dev",
			maxTasksAdded:
				"Maximum number of tasks reached, try deleting old tasks.",
			noTaskFound: "That task doesn't seem to exist, try adding one!",
			invalidCommand: "Invalid command: {message}. Try !help",
		}
	}
};

/** @type {SettingsConfig} */
const _settings = {
	languageCode: "EN", // "EN", "ES", "FR", "JP", "UA", etc.
	maxTasksPerUser: 10, // default number 10
	scrollSpeed: 20, // default number 20
	showUsernameColor: true, // true or false
	headerFeature: "timer", // "timer", "commands", "text", "tasks-only"
	headerCustomText: "Custom Text", // HeaderFeature above must be "text"
	botResponsePrefix: "🤖💬 ", // default "🤖💬 "
	testMode: false, // true or false - for testing purposes
};

/** @type {StyleConfig} */
const _styles = {};

vi.stubGlobal("_adminConfig", _adminConfig);
vi.stubGlobal("_userConfig", _userConfig);
vi.stubGlobal("_settings", _settings);
vi.stubGlobal("_styles", _styles);
