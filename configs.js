const configs = (function () {
	"use strict";

	const settings = {
		languageCode: "EN", // "EN", "ES", "FR", "JP"
		crossTasksOnDone: true, // true or false
		maxTasksPerUser: 5, // number between 1 and 10
		scrollSpeed: 4, // number between 1 and 10
	};

	const admin = {
		list: {
			adminClearAllTasksCommands: ["!adminclearall"],
			adminClearDoneTasksCommands: ["!admincleardone"],
			adminClearUserCommands: ["!adminclearuser"],
		},
		responseTo: {
			EN: {
				adminClearAllTasksCommands: "All tasks have been cleared",
				adminClearDoneTasksCommands: "All finished tasks have been cleared",
				adminClearUserCommands: "All tasks for {user} have been cleared",
			},
			ES: {
				adminClearAllTasksCommands: "Todas las tareas han sido borradas",
				adminClearDoneTasksCommands:
					"Todas las tareas terminadas han sido borradas",
				adminClearUserCommands: "Todas las tareas de {user} han sido borradas",
			},
			FR: {
				adminClearAllTasksCommands: "Toutes les tâches ont été effacées",
				adminClearDoneTasksCommands:
					"Toutes les tâches terminées ont été effacées",
				adminClearUserCommands: "Toutes les tâches de {user} ont été effacées",
			},
			JP: {
				adminClearAllTasksCommands: "すべてのタスクがクリアされました",
				adminClearDoneTasksCommands: "完了したすべてのタスクがクリアされました",
				adminClearUserCommands: "{user}のすべてのタスクがクリアされました",
			},
		},
	};

	const user = {
		commands: {
			addTaskCommands: [
				"!add",
				"!task",
				"!todo",
				"!addtask",
				"!taskadd",
				"!taska",
				"!atask",
			],
			editTaskCommands: [
				"!edit",
				"!rename",
				"!taskedit",
				"!edittask",
				"!taske",
				"!etask",
			],
			finishTaskCommands: [
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
			deleteTaskCommands: [
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
			checkCommands: ["!check", "!mytask", "!taskcheck", "!checktask"],
			nextCommands: ["!next", "!nexttask"],
			helpCommands: ["!help", "!taskhelp"],
			additionalCommands: ["!creator", "!credits"],
		},
		responseTo: {
			EN: {
				addTaskCommands: 'Task "{taskDescription}" has been added, {user}!',
				editTaskCommands: 'Task updated to "{taskDescription}", {user}!',
				finishTaskCommands: 'Good job on finishing "{taskDescription}" {user}!',
				deleteTaskCommands:
					'Task "{taskDescription}" has been deleted, {user}!',
				checkCommands: 'Your current task is: "{taskDescription}", {user}',
				nextCommands: 'Moving onto "{taskDescription}", {user}!',
				helpCommands:
					"Use the following commands to help you out - !add !remove !edit !done",
				additionalCommands:
					"Jujoco is the creator of this bot, check out his Twitch at https://www.twitch.tv/JujocoCS",
				maxTasksAdded:
					"Looks like you've reached the max tasks {user}, try removing old tasks",
				noTaskFound: "Looks like you don't have a task up there {user}",
			},
			ES: {
				addTaskCommands:
					'La tarea "{taskDescription}" ha sido añadida, {user}!',
				noTaskAdded: 'La tarea "{taskDescription}" ha sido añadida, {user}!',
				maxTasksAdded:
					"Has alcanzado el número máximo de tareas {user}, usa !delete para borrar y remover las tareas antiguas",
				noTaskContent:
					"Intenta usar !add la-tarea-en-la-que-estás-trabajando {user}",
				noTaskToEdit: "No hay tarea para editar {user}",
			},
			FR: {
				addTaskCommands: 'La tâche "{taskDescription}" a été ajoutée, {user}!',
				noTaskAdded: 'La tâche "{taskDescription}" a été ajoutée, {user}!',
				maxTasksAdded:
					"Vous avez atteint le nombre maximum de tâches {user}, utilisez !delete pour supprimer les anciennes tâches",
				noTaskContent:
					"Essayez d'utiliser !add la-tâche-sur-laquelle-vous-travaillez {user}",
				noTaskToEdit: "Pas de tâche à éditer {user}",
			},
			JP: {
				addTaskCommands: 'タスク "{taskDescription}" が追加されました、{user}!',
				noTaskAdded: 'タスク "{taskDescription}" が追加されました、{user}!',
				maxTasksAdded:
					"最大タスク数に達しました {user}、古いタスクを削除して削除してください",
				noTaskContent: "!add 作業中のタスク {user} を使用してみてください",
				noTaskToEdit: "編集するタスクがありません {user}",
			},
		},
	};

	let module = {
		admin,
		user,
		settings,
	};

	return module;
})();
