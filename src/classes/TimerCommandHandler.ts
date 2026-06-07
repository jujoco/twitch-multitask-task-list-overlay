import { type ChatResponse, isMod, respondMessage } from '../commandUtils.js';
import { formatTemplate } from '../format.js';
import type { CommandFlags } from '../twitch/types.js';

export interface TimerControls {
	startTimer(focusDuration: number, breakDuration: number): void;
	startPomodoro(focusDuration: number, breakDuration: number, sessions: number): void;
	pause(): 'paused' | 'none';
	resume(): 'resumed' | 'none';
}

export default class TimerCommandHandler {
	#timer: TimerControls;
	#languageCode: string;
	#headerFeature: string;
	#pomodoroDefaults: PomodoroConfig;

	constructor(timer: TimerControls) {
		this.#timer = timer;
		this.#languageCode = _settings.languageCode;
		this.#headerFeature = _settings.headerFeature;
		this.#pomodoroDefaults = _settings.pomodoro;
	}

	handle(
		username: string,
		command: string,
		message: string,
		flags: CommandFlags,
	): ChatResponse | null {
		command = `!${command.toLowerCase()}`;
		if (!isMod(flags) || this.#headerFeature.toLowerCase() !== 'timer') return null;

		try {
			// POMO COMMAND
			if (_adminConfig.commands.timer.includes(command)) {
				const defaults = this.#pomodoroDefaults;
				const parts = message
					.trim()
					.split(/[\s/]+/)
					.filter(Boolean);
				const focusDuration = parts.length > 0 ? parseInt(parts[0], 10) : defaults.sessionLength;
				const breakDuration = this.#parseBreak(parts, defaults.breakLength);
				const sessions = parts.length > 2 ? parseInt(parts[2], 10) : defaults.sessions;
				if (
					Number.isNaN(focusDuration) ||
					focusDuration <= 0 ||
					Number.isNaN(breakDuration) ||
					breakDuration < 0 ||
					Number.isNaN(sessions) ||
					sessions <= 0
				) {
					throw new Error('Invalid timer duration');
				}
				if (sessions > 1) {
					this.#timer.startPomodoro(focusDuration, breakDuration, sessions);
					const template = formatTemplate(_adminConfig.responseTo[this.#languageCode].pomo, {
						session: 1,
						total: sessions,
						duration: focusDuration,
					});
					return respondMessage(template, username, '');
				}
				this.#timer.startTimer(focusDuration, breakDuration);
				const template = `${_adminConfig.responseTo[this.#languageCode].timer} ⏲️`;
				return respondMessage(template, username, focusDuration.toString());
			}

			// PAUSE COMMAND
			if (_adminConfig.commands.pause.includes(command)) {
				if (this.#timer.pause() === 'none') {
					throw new Error('No active timer to pause');
				}
				return respondMessage(_adminConfig.responseTo[this.#languageCode].pause, username, '');
			}

			// RESUME COMMAND
			if (_adminConfig.commands.resume.includes(command)) {
				if (this.#timer.resume() === 'none') {
					throw new Error('No active timer to resume');
				}
				return respondMessage(_adminConfig.responseTo[this.#languageCode].resume, username, '');
			}

			return null;
		} catch (error) {
			return respondMessage(
				_userConfig.responseTo[this.#languageCode].invalidCommand,
				username,
				error instanceof Error ? error.message : String(error),
				true,
			);
		}
	}

	#parseBreak(parts: string[], fallback: number): number {
		if (parts.length > 1) return parseInt(parts[1], 10);
		if (parts.length === 1) return 0;
		return fallback;
	}
}
