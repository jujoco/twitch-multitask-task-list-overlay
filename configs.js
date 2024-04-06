const configs = (function () {
	"use strict";

	const settings = {
		languageCode: "EN", // "EN", "ES", "FR", "JP"
		crossTasksOnDone: true, // true or false
		maxTasksPerUser: 5, // number between 1 and 10
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
				help: "Use the following commands to help you out - !add !remove !edit !done",
				additional:
					"Jujoco is the creator of this bot, check out his Twitch at https://www.twitch.tv/JujocoCS",
				maxTasksAdded:
					"Looks like you've reached the max tasks {user}, try removing old tasks",
				noTaskFound: "Looks like you don't have a task up there {user}",
			},
			ES: {
				addTask: 'La tarea "{message}" ha sido añadida, {user}!',
				noTaskAdded: 'La tarea "{message}" ha sido añadida, {user}!',
				maxTasksAdded:
					"Has alcanzado el número máximo de tareas {user}, usa !delete para borrar y remover las tareas antiguas",
				noTaskContent:
					"Intenta usar !add la-tarea-en-la-que-estás-trabajando {user}",
				noTaskToEdit: "No hay tarea para editar {user}",
			},
			FR: {
				addTask: 'La tâche "{message}" a été ajoutée, {user}!',
				noTaskAdded: 'La tâche "{message}" a été ajoutée, {user}!',
				maxTasksAdded:
					"Vous avez atteint le nombre maximum de tâches {user}, utilisez !delete pour supprimer les anciennes tâches",
				noTaskContent:
					"Essayez d'utiliser !add la-tâche-sur-laquelle-vous-travaillez {user}",
				noTaskToEdit: "Pas de tâche à éditer {user}",
			},
			JP: {
				addTask: 'タスク "{message}" が追加されました、{user}!',
				noTaskAdded: 'タスク "{message}" が追加されました、{user}!',
				maxTasksAdded:
					"最大タスク数に達しました {user}、古いタスクを削除して削除してください",
				noTaskContent: "!add 作業中のタスク {user} を使用してみてください",
				noTaskToEdit: "編集するタスクがありません {user}",
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
