// ===============================
// Admin Command and Response
// ===============================
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
    UA: {
      timer: "Таймер виставлено до {message} хвилин",
      clearList: "Усі завдання видалено",
      clearDone: "Усі виконані завдання видалено",
      clearUser: "Усі завдання {message} видалено",
    },
  },
};
