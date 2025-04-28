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
      timer: "Focus timer set to {message} minutes",
      clearList: "All tasks have been cleared",
      clearDone: "All done tasks have been cleared",
      clearUser: "All tasks for {message} have been cleared",
    },
    ES: {
      timer: "El temporizador se ha restablecido a {message} minutos",
      clearList: "Todas las tareas han sido eliminadas",
      clearDone: "Todas las tareas completadas han sido eliminadas",
      clearUser: "Todas las tareas de {message} han sido eliminadas",
    },
    FR: {
      timer: "Minuteur réglé à {message} minutes",
      clearList: "Toutes les tâches ont été effacées",
      clearDone: "Toutes les tâches terminées ont été effacées",
      clearUser: "Toutes les tâches de {message} ont été effacées",
    },
    JP: {
      timer: "フォーカスタイマーが {message} 分に設定されました",
      clearList: "すべてのタスクがクリアされました",
      clearDone: "完了したすべてのタスクがクリアされました",
      clearUser: "{message} のすべてのタスクがクリアされました",
    },
    UA: {
      timer: "Таймер фокусу встановлено на {message} хвилин",
      clearList: "Усі завдання видалено",
      clearDone: "Усі виконані завдання видалено",
      clearUser: "Усі завдання {message} видалено",
    },
    DE: {
      timer: "Fokus-Timer auf {message} Minuten eingestellt",
      clearList: "Alle Aufgaben wurden gelöscht",
      clearDone: "Alle erledigten Aufgaben wurden gelöscht",
      clearUser: "Alle Aufgaben von {message} wurden gelöscht",
    },
    PT_BR: {
      timer: "Temporizador de foco definido para {message} minutos",
      clearList: "Todas as tarefas foram removidas",
      clearDone: "Todas as tarefas concluídas foram removidas",
      clearUser: "Todas as tarefas de {message} foram removidas",
    }
  },
};
