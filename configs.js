const configs = (function () {
	"use strict";

	const settings = {
		languageCode: "EN", // "EN", "ES", "FR", "JP"
		crossTasksOnDone: true, // true or false
		maxTasksPerUser: 5, // default 5
		scrollSpeed: 40, // default 40
		testMode: false, // true or false - for testing purposes
	};

	const admin = {
		commands: {
			adminClearUserList: ["!adminclearall"],
			adminClearDoneTasks: ["!admincleardone"],
		},
		responseTo: {
			EN: {
				adminClearUserList: "All tasks have been cleared",
				adminClearDoneTasks: "All finished tasks have been cleared",
			},
			ES: {
				adminClearUserList: "Todas las tareas han sido borradas",
				adminClearDoneTasks: "Todas las tareas terminadas han sido borradas",
			},
			FR: {
				adminClearUserList: "Toutes les tâches ont été effacées",
				adminClearDoneTasks: "Toutes les tâches terminées ont été effacées",
			},
			JP: {
				adminClearUserList: "すべてのタスクがクリアされました",
				adminClearDoneTasks: "完了したすべてのタスクがクリアされました",
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
			editTask: [
				"!edit",
				"!rename",
				"!taskedit",
				"!edittask",
				"!taske",
				"!etask",
			],
			finishTask: [
				"!done",
				"!donetask",
				"!taskdone",
				"!finished",
				"!taskf",
				"!taskfinish",
				"!ftask",
				"!finishtask",
				"!taskd",
				"!dtask",
				"!finish",
			],
			deleteTask: [
				"!delete",
				"!remove",
				"!taskd",
				"!taskdel",
				"!deltask",
				"!taskdelete",
				"!deletetask",
				"!taskremove",
				"!removetask",
				"!taskr",
				"!rtask",
			],
			check: ["!check", "!mytask", "!taskcheck", "!checktask"],
			next: ["!next", "!nexttask"],
			help: ["!help", "!taskhelp"],
			additional: ["!creator", "!credits"],
		},
		responseTo: {
			EN: {
				addTask: 'Task "{message}" has been added, {user}!',
				editTask: 'Task updated to "{message}", {user}!',
				finishTask: 'Good job on finishing "{message}" {user}!',
				deleteTask: 'Task "{message}" has been deleted, {user}!',
				check: 'Your current task is: "{message}", {user}',
				next: 'Moving onto "{message}", {user}!',
				help: "Try using these commands - !taskadd !taskedit !taskdone !taskdelete",
				additional:
					"Jujoco is the creator of this bot, check out his Twitch at: https://www.twitch.tv/JujocoCS",
				maxTasksAdded:
					"Looks like you've reached the max tasks {user}, try removing old tasks",
				noTaskFound: "Looks like you don't have a task up there {user}",
				invalidCommand: "Invalid command, try !help {user}",
			},
			ES: {
				addTask: 'La tarea "{message}" ha sido añadida, {user}!',
				editTask: 'Tarea actualizada a "{message}", {user}!',
				finishTask: '¡Buen trabajo al terminar "{message}" {user}!',
				deleteTask: 'La tarea "{message}" ha sido eliminada, {user}!',
				check: 'Tu tarea actual es: "{message}", {user}',
				next: 'Pasando a "{message}", {user}!',
				help: "Prueba a usar estos comandos - !taskadd !taskedit !taskdone !taskdelete",
				additional:
					"Jujoco es el creador de este bot, mira su Twitch en: https://www.twitch.tv/JujocoCS",
				maxTasksAdded:
					"Parece que has alcanzado el máximo de tareas {user}, intenta eliminar tareas antiguas",
				noTaskFound: "Parece que no tienes una tarea ahí arriba {user}",
				invalidCommand: "Comando inválido, prueba !help {user}",
			},
			FR: {
				addTask: 'Tâche "{message}" a été ajoutée, {user}!',
				editTask: 'Tâche mise à jour en "{message}", {user}!',
				finishTask: 'Bon travail pour avoir terminé "{message}" {user}!',
				deleteTask: 'La tâche "{message}" a été supprimée, {user}!',
				check: 'Votre tâche actuelle est : "{message}", {user}',
				next: 'Passons à "{message}", {user}!',
				help: "Essayez d'utiliser ces commandes - !taskadd !taskedit !taskdone !taskdelete",
				additional:
					"Jujoco est le créateur de ce bot, consultez son Twitch sur: https://www.twitch.tv/JujocoCS",
				maxTasksAdded:
					"Vous avez atteint le nombre maximal de tâches {user}, essayez de supprimer les anciennes tâches",
				noTaskFound: "On dirait que vous n'avez pas de tâche là-haut {user}",
				invalidCommand: "Commande invalide, essayez !help {user}",
			},
			JP: {
				addTask: "タスク「{message}」が追加されました、{user}!",
				editTask: "タスクが「{message}」に更新されました、{user}!",
				finishTask: "「{message}」を終了してよくやった、{user}!",
				deleteTask: "タスク「{message}」が削除されました、{user}!",
				check: "現在のタスクは「{message}」です、{user}",
				next: "「{message}」に移動します、{user}!",
				help: "これらのコマンドを試してみてください - !taskadd !taskedit !taskdone !taskdelete",
				additional:
					"このボットの作成者はJujocoです、彼のTwitchは: https://www.twitch.tv/JujocoCS",
				maxTasksAdded:
					"最大タスク数に達しました {user}、古いタスクを削除してみてください",
				noTaskFound: "上にタスクがないようです {user}",
				invalidCommand: "無効なコマンドです。!help {user} を試してください",
			},
		},
	};

	const module = {
		admin,
		user,
		settings,
	};

	return module;
})();
