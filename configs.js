window.configs = {
	// ========================================
	// Authentication and channel - Required
	// Get your oauth token from https://twitchapps.com/tmi
	// ========================================
	auth: {
		twitch_channel: "CHANNEL", // Replace CHANNEL with a Twitch channel name
		twitch_username: "USERNAME", // Replace USERNAME with your Twitch username
		twitch_oauth: "OAUTHTOKEN", // Replace OAUTHTOKEN with your Twitch oauth token
	},
	// ========================================
	// Bot Behavior Settings
	// ========================================
	settings: {
		languageCode: "EN", // "EN", "ES", "FR", "JP", etc.
		maxTasksPerUser: 5, // default 5
		scrollSpeed: 50, // default 50
		showUsernameColor: true, // true or false
		testMode: false, // true or false - for testing purposes
	},

	// ========================================
	// Styles Settings
	// ========================================
	styles: {
		// Font Family: available @ https://fonts.google.com
		headerFontFamily: "Roboto Mono",
		cardFontFamily: "Roboto Mono",

		// App Styles
		appBorderRadius: "5px", // px value
		appPadding: "8px", // px value
		appBackgroundImage: "url(../images/transparent-image.png)", // image must go in images folder
		appBackgroundColor: "rgba(130, 130, 130, 0)", // rgba or hex value https://rgbcolorpicker.com

		//  Header Styles
		headerDisplay: "flex", // "none" to hide header or "flex" to show header
		headerBorderRadius: "6px", // px value
		headerMarginBottom: "6px", // px value
		headerBackgroundColor: "rgba(45, 45, 45, 0.7)", // rgba or hex value https://rgbcolorpicker.com/
		headerFontSize: "20px", // px value
		headerFontColor: "#FFFFFF", // hex value
		headerFontWeight: "normal", // "normal", "lighter", "bold"

		// Body Styles
		bodyBackgroundColor: "rgba(0, 0, 0, 0)", // rgba or hex value https://rgbcolorpicker.com/

		// Card Styles
		cardGapBetween: "6px", // px value
		cardBorderRadius: "6px", // px value
		cardBackgroundColor: "rgba(45, 45, 45, 0.6)", // rgba or hex value https://rgbcolorpicker.com/

		// Username Styles
		usernameFontSize: "18px", // px value
		usernameColor: "#FFFFFF", // hex value
		usernameFontWeight: "normal", // "normal", "lighter", "bold"

		// Task Styles
		taskFontSize: "16px", // px value
		taskFontColor: "#FFFFFF", // hex value
		taskFontWeight: "normal", // "normal", "lighter", "bold"

		taskDoneFontColor: "#aaaaaa", // hex value
		taskDoneFontStyle: "italic", // "italic" or "normal"
		taskDoneTextDecoration: "none", // "line-through" or "none"
	},

	// ========================================
	// Admin Command and Response
	// ========================================
	admin: {
		commands: {
			clearList: ["!clearlist"],
			clearDone: ["!cleardone"],
			clearUser: ["!clearuser"],
		},
		responseTo: {
			EN: {
				clearList: "{user}, All tasks have been cleared",
				clearDone: "{user}, All done tasks have been cleared",
				clearUser: "{user}, All tasks for {message} have been cleared",
			},
			ES: {
				clearList: "{user}, Todas las tareas han sido eliminadas",
				clearDone:
					"{user}, Todas las tareas terminadas han sido eliminadas",
				clearUser:
					"{user}, Todas las tareas de {message} han sido eliminadas",
			},
			FR: {
				clearList: "{user}, Toutes les tâches ont été effacées",
				clearDone:
					"{user}, Toutes les tâches terminées ont été effacées",
				clearUser:
					"{user}, Toutes les tâches de {message} ont été effacées",
			},
			JP: {
				clearList: "{user}, すべてのタスクがクリアされました",
				clearDone: "{user}, 完了したすべてのタスクがクリアされました",
				clearUser:
					"{user}, {message} のすべてのタスクがクリアされました",
			},
		},
	},

	// ========================================
	// User Commands and Responses
	// ========================================
	user: {
		commands: {
			addTask: ["!add", "!task", "!addtask", "!taskadd"],
			editTask: ["!edit", "!edittask", "!taskedit"],
			finishTask: ["!done", "!donetask", "!taskdone"],
			deleteTask: ["!delete", "!deletetask", "!taskdelete"],
			check: ["!check", "!taskcheck", "!checktask", "!mytask"],
			help: ["!help", "!taskhelp", "!helptask"],
			additional: ["!credit", "!taskbot"],
		},
		responseTo: {
			EN: {
				addTask: 'Task(s) "{message}" added, {user}!',
				editTask: 'Task "{message}" updated, {user}!',
				finishTask:
					'Good job on completing task(s) "{message}" {user}!',
				deleteTask: 'Task(s) "{message}" has been deleted, {user}!',
				check: 'Your current task is: "{message}", {user}',
				help: "Try using these commands - !add !edit !done !delete, !check",
				additional:
					"Jujoco is the creator of this bot, check out his Twitch at: https://www.twitch.tv/JujocoCS",
				maxTasksAdded:
					"{user}, maximum number of tasks reached, try removing some first.",
				noTaskFound: "Looks like you don't have a task up there {user}",
				invalidCommand: "{user}, Invalid command: {message}. Try !help",
			},
			ES: {
				addTask: 'La tarea "{message}" ha sido añadida, {user}!',
				editTask: 'Tarea actualizada a "{message}", {user}!',
				finishTask: '¡Buen trabajo al terminar "{message}" {user}!',
				deleteTask: 'La tarea "{message}" ha sido eliminada, {user}!',
				check: 'Tu tarea actual es: "{message}", {user}',
				help: "Prueba a usar estos comandos - !add !edit !done !delete",
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
				help: "Essayez d'utiliser ces commandes - !add !edit !done !delete",
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
				help: "これらのコマンドを試してみてください - !add !edit !done !delete",
				additional:
					"このボットの作成者はJujocoです、彼のTwitchは: https://www.twitch.tv/JujocoCS",
				maxTasksAdded:
					"最大タスク数に達しました {user}、古いタスクを削除してみてください",
				noTaskFound: "上にタスクがないようです {user}",
				invalidCommand:
					"{user}、無効なコマンド: {message}。!help を試してみてください",
			},
		},
	},
};
