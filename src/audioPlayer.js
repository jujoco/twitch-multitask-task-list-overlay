// Creates an audio instance to for the Alarm
let endAlarm = new Audio("./audio/alarm.mp3")
endAlarm.volume() = 0.8;

export function playAlarm() {
   endAlarm.play();
}