const configs = {
	// ========================================
	// Authentication and channel - Required
	// Before you start modifying these settings,
	// get your oauth token from https://twitchapps.com/tmi
	// ========================================
	auth: {
		twitch_oauth: "OAUTHTOKEN", // Replace OAUTHTOKEN with your Twitch oauth token
		twitch_channel: "CHANNEL", // Replace CHANNEL with a Twitch channel name
		twitch_username: "USERNAME", // Replace USERNAME with your Twitch username
	},

	// ========================================
	// Bot Behavior Settings
	// ========================================
	settings: {
		languageCode: "EN", // "EN", "ES", "FR", "JP", etc.
		maxTasksPerUser: 5, // default number 5
		scrollSpeed: 40, // default number 40
		showUsernameColor: true, // true or false
		headerDisplay: "Timer", // "Timer", "None", "Commands", "Text"
		headerText: "Custom Text", // HeaderDisplay above must be "Text"
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
		appBackgroundColor: "rgba(0, 0, 0, 0)", // rgba or hex value https://rgbcolorpicker.com

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
		cardBackgroundColor: "rgba(45, 45, 45, 0.7)", // rgba or hex value https://rgbcolorpicker.com/

		// Username Styles
		usernameFontSize: "18px", // px value
		usernameColor: "#FFFFFF", // hex value
		usernameFontWeight: "normal", // "normal", "lighter", "bold"

		// Task Styles
		taskFontSize: "16px", // px value
		taskFontColor: "#FFFFFF", // hex value
		taskFontWeight: "normal", // "normal", "lighter", "bold"

		taskDoneFontColor: "#b0b0b0", // hex value
		taskDoneFontStyle: "italic", // "italic" or "normal"
		taskDoneTextDecoration: "none", // "line-through" or "none"
	},

	// ========================================
	// Admin Command and Response
	// ========================================
	admin: {
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
			},
			ES: {
				timer: "El temporizador ha sido restablecido a {message} minutos",
				clearList: "Todas las tareas han sido eliminadas",
				clearDone: "Todas las tareas completadas han sido eliminadas",
				clearUser: "Todas las tareas de {message} han sido eliminadas",
			},
			FR: {
				timer: "Le minuteur a été réinitialisé à {message} minutes",
				clearList: "Toutes les tâches ont été effacées",
				clearDone: "Toutes les tâches terminées ont été effacées",
				clearUser: "Toutes les tâches de {message} ont été effacées",
			},
			JP: {
				timer: "タイマーが {message} 分にリセットされました",
				clearList: "すべてのタスクがクリアされました",
				clearDone: "完了したすべてのタスクがクリアされました",
				clearUser: "{message} のすべてのタスクがクリアされました",
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
			deleteTask: ["!delete", "!deletetask", "!taskdelete", "!remove"],
			check: ["!check", "!taskcheck", "!checktask", "!mytask"],
			help: ["!help", "!taskhelp", "!helptask"],
			additional: ["!credit", "!taskbot"],
		},
		responseTo: {
			EN: {
				addTask: 'Task(s) "{message}" added!',
				editTask: 'Task "{message}" updated!',
				finishTask: 'Good job on completing task(s) "{message}"!',
				deleteTask: 'Task(s) "{message}" has been deleted!',
				deleteAll: "All of your tasks have been deleted!",
				check: 'Your current task(s) are: "{message}"',
				help: "Try using these commands - !add !edit !done !delete, !check",
				additional:
					"Jujoco is the creator of this bot, check out his Twitch at: https://www.twitch.tv/JujocoCS",
				maxTasksAdded:
					"Maximum number of tasks reached, try deleting old tasks.",
				noTaskFound:
					"Looks like you don't have a task up there, try adding one!",
				invalidCommand: "Invalid command: {message}. Try !help",
			},
			ES: {
				addTask: 'Tarea(s) "{message}" añadida(s)!',
				editTask: 'Tarea "{message}" actualizada!',
				finishTask:
					'¡Buen trabajo completando la(s) tarea(s) "{message}"!',
				deleteTask: 'La(s) tarea(s) "{message}" ha sido eliminada(s)!',
				deleteAll: "Todas tus tareas han sido eliminadas!",
				check: 'Tus tareas actuales son: "{message}"',
				help: "Prueba a usar estos comandos - !add !edit !done !delete, !check",
				additional:
					"Jujoco es el creador de este bot, visita su Twitch en: https://www.twitch.tv/JujocoCS",
				maxTasksAdded:
					"Número máximo de tareas alcanzado, intenta eliminar tareas antiguas.",
				noTaskFound:
					"Parece que no tienes ninguna tarea, ¡intenta añadir una!",
				invalidCommand: "Comando inválido: {message}. Prueba !help",
			},
			FR: {
				addTask: 'Tâche(s) "{message}" ajoutée(s)!',
				editTask: 'Tâche "{message}" mise à jour!',
				finishTask:
					'Bon travail pour avoir terminé la tâche "{message}"!',
				deleteTask: 'La tâche "{message}" a été supprimée!',
				deleteAll: "Toutes vos tâches ont été supprimées!",
				check: 'Vos tâches actuelles sont: "{message}"',
				help: "Essayez d'utiliser ces commandes - !add !edit !done !delete, !check",
				additional:
					"Jujoco est le créateur de ce bot, consultez son Twitch sur: https://www.twitch.tv/JujocoCS",
				maxTasksAdded:
					"Nombre maximum de tâches atteint, essayez de supprimer les anciennes tâches.",
				noTaskFound:
					"Vous n'avez pas de tâche, essayez d'en ajouter une!",
				invalidCommand: "Commande invalide: {message}. Essayez !help",
			},
			JP: {
				addTask: 'タスク "{message}" が追加されました!',
				editTask: 'タスク "{message}" が更新されました!',
				finishTask: 'タスク "{message}" を完了しました!',
				deleteTask: 'タスク "{message}" が削除されました!',
				deleteAll: "すべてのタスクが削除されました!",
				check: '現在のタスクは "{message}" です',
				help: "これらのコマンドを試してみてください - !add !edit !done !delete, !check",
				additional:
					"Jujoco はこのボットの作成者です、彼の Twitch をチェックしてください: https://www.twitch.tv/JujocoCS",
				maxTasksAdded:
					"最大タスク数に達しました、古いタスクを削除してみてください。",
				noTaskFound:
					"タスクが見つかりません、タスクを追加してみてください!",
				invalidCommand:
					"無効なコマンド: {message}。!help を試してみてください",
			},
		},
	},
};
