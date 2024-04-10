const configs = (function () {
	"use strict";

	// Authentication and channel - Required
	const channel = ""; // <-- your channel
	const username = ""; // <-- your username
	const oauth = "oauth:101010101010101010101010"; // <-- your oauth token

	// Font Family: available @ https://fonts.google.com
	const headerFontFamily = "Roboto Mono";
	const cardFontFamily = "Roboto Mono";

	// App Styles
	const appBorderRadius = "5px"; // px
	const appPadding = "8px"; // px
	const appBackgroundImage = "url(../public/transparent-background.png)"; // images go in public folder
	const appBackgroundColor = "rgba(0, 0, 0, 0)"; // color picker https://rgbcolorpicker.com/

	//  Header Styles
	const headerBorderRadius = "5px";
	const headerMarginBottom = "10px";
	const headerBackgroundColor = "rgb(0, 0, 0)"; // color picker https://rgbcolorpicker.com/
	const headerFontSize = "24px";
	const headerFontColor = "#FFFFFF"; // color picker https://rgbcolorpicker.com/
	const headerFontWeight = "lighter"; // lighter, normal, bold

	// Body Styles
	const bodyBackgroundColor = "rgb(0, 77, 0, 0)"; // color picker https://rgbcolorpicker.com/

	// Card Styles
	const cardGapBetween = "10px";
	const cardBorderRadius = "5px";
	const cardBackgroundColor = "rgb(0, 0, 0, 0.8)"; // color picker https://rgbcolorpicker.com/

	// User Name Styles
	const usernameFontSize = "22px";
	const usernameColor = "rgb(255, 255, 255)"; // color picker https://rgbcolorpicker.com/
	const usernameFontWeight = "lighter"; // lighter, normal, bold

	// User Task Styles
	const taskFontSize = "18px"; // px
	const taskFontColor = "#FFFFFF"; // color picker https://rgbcolorpicker.com/
	const taskFontWeight = "lighter"; // lighter, normal, bold
	const taskDoneFontColor = "#2E2E2E"; // color picker https://rgbcolorpicker.com/

	// Bot Behavior Settings
	const settings = {
		languageCode: "EN", // "EN", "ES", "FR", "JP", etc.
		crossTasksOnDone: true, // true or false
		maxTasksPerUser: "5", // default 5
		scrollSpeed: "50", // default 50
		testMode: true, // true or false - for testing purposes
	};

	const admin = {
		commands: {
			adminClearList: ["!adminclearall"],
			adminClearDoneTasks: ["!admincleardone"],
			adminClearUser: ["!adminclearuser"],
		},
		responseTo: {
			EN: {
				adminClearList: "{user}, All tasks have been cleared",
				adminClearDoneTasks:
					"{user}, All finished tasks have been cleared",
				adminClearUser:
					"{user}, All tasks for {message} have been cleared",
			},
			ES: {
				adminClearList: "{user}, Todas las tareas han sido eliminadas",
				adminClearDoneTasks:
					"{user}, Todas las tareas terminadas han sido eliminadas",
				adminClearUser:
					"{user}, Todas las tareas de {message} han sido eliminadas",
			},
			FR: {
				adminClearList: "{user}, Toutes les tâches ont été effacées",
				adminClearDoneTasks:
					"{user}, Toutes les tâches terminées ont été effacées",
				adminClearUser:
					"{user}, Toutes les tâches de {message} ont été effacées",
			},
			JP: {
				adminClearList: "{user}, すべてのタスクがクリアされました",
				adminClearDoneTasks:
					"{user}, 完了したすべてのタスクがクリアされました",
				adminClearUser:
					"{user}, {message} のすべてのタスクがクリアされました",
			},
		},
	};

	const user = {
		commands: {
			addTask: [
				"!add",
				"!task",
				"!todo",
				"!addtask",
				"!taskadd",
				"!taska",
				"!atask",
			],
			editTask: ["!edit", "!taskedit", "!edittask", "!taske", "!etask"],
			finishTask: ["!done", "!donetask", "!taskdone"],
			deleteTask: [
				"!delete",
				"!taskdelete",
				"!deletetask",
				"!taskdel",
				"!deltask",
			],
			check: ["!check", "!taskcheck", "!checktask", "!mytask"],
			help: ["!help", "!taskhelp", "!helptask"],
			additional: ["!creator", "!credits"],
		},
		responseTo: {
			EN: {
				addTask: 'Task "{message}" has been added, {user}!',
				editTask: 'Task updated to "{message}", {user}!',
				finishTask: 'Good job on finishing "{message}" {user}!',
				deleteTask: 'Task "{message}" has been deleted, {user}!',
				check: 'Your current task is: "{message}", {user}',
				help: "Try using these commands - !taskadd !taskedit !taskdone !taskdelete",
				additional:
					"Jujoco is the creator of this bot, check out his Twitch at: https://www.twitch.tv/JujocoCS",
				maxTasksAdded:
					"Looks like you've reached the max tasks {user}, try removing old tasks",
				noTaskFound: "Looks like you don't have a task up there {user}",
				invalidCommand: "{user}, Invalid command: {message}. Try !help",
			},
			ES: {
				addTask: 'La tarea "{message}" ha sido añadida, {user}!',
				editTask: 'Tarea actualizada a "{message}", {user}!',
				finishTask: '¡Buen trabajo al terminar "{message}" {user}!',
				deleteTask: 'La tarea "{message}" ha sido eliminada, {user}!',
				check: 'Tu tarea actual es: "{message}", {user}',
				help: "Prueba a usar estos comandos - !taskadd !taskedit !taskdone !taskdelete",
				additional:
					"Jujoco es el creador de este bot, mira su Twitch en: https://www.twitch.tv/JujocoCS",
				maxTasksAdded:
					"Parece que has alcanzado el máximo de tareas {user}, intenta eliminar tareas antiguas",
				noTaskFound: "Parece que no tienes una tarea ahí arriba {user}",
				invalidCommand:
					"{user}, Comando inválido: {message}. ¡Intenta !help",
			},
			FR: {
				addTask: 'Tâche "{message}" a été ajoutée, {user}!',
				editTask: 'Tâche mise à jour en "{message}", {user}!',
				finishTask:
					'Bon travail pour avoir terminé "{message}" {user}!',
				deleteTask: 'La tâche "{message}" a été supprimée, {user}!',
				check: 'Votre tâche actuelle est : "{message}", {user}',
				help: "Essayez d'utiliser ces commandes - !taskadd !taskedit !taskdone !taskdelete",
				additional:
					"Jujoco est le créateur de ce bot, consultez son Twitch sur: https://www.twitch.tv/JujocoCS",
				maxTasksAdded:
					"Vous avez atteint le nombre maximal de tâches {user}, essayez de supprimer les anciennes tâches",
				noTaskFound:
					"On dirait que vous n'avez pas de tâche là-haut {user}",
				invalidCommand:
					"{user}, Commande invalide: {message}. Essayez !help",
			},
			JP: {
				addTask: "タスク「{message}」が追加されました、{user}!",
				editTask: "タスクが「{message}」に更新されました、{user}!",
				finishTask: "「{message}」を終了してよくやった、{user}!",
				deleteTask: "タスク「{message}」が削除されました、{user}!",
				check: "現在のタスクは「{message}」です、{user}",
				help: "これらのコマンドを試してみてください - !taskadd !taskedit !taskdone !taskdelete",
				additional:
					"このボットの作成者はJujocoです、彼のTwitchは: https://www.twitch.tv/JujocoCS",
				maxTasksAdded:
					"最大タスク数に達しました {user}、古いタスクを削除してみてください",
				noTaskFound: "上にタスクがないようです {user}",
				invalidCommand:
					"{user}、無効なコマンド: {message}。!help を試してみてください",
			},
		},
	};

	const styles = {
		appBorderRadius,
		appPadding,
		appBackgroundImage,
		appBackgroundColor,
		headerBorderRadius,
		headerMarginBottom,
		headerBackgroundColor,
		headerFontFamily,
		headerFontSize,
		headerFontColor,
		headerFontWeight,
		bodyBackgroundColor,
		cardGapBetween,
		cardBorderRadius,
		cardBackgroundColor,
		cardFontFamily,
		usernameFontSize,
		usernameColor,
		usernameFontWeight,
		taskFontSize,
		taskFontColor,
		taskFontWeight,
		taskDoneFontColor,
	};

	const auth = {
		channel,
		username,
		oauth,
	};

	const module = {
		admin,
		user,
		auth,
		styles,
		settings,
	};

	return module;
})();
