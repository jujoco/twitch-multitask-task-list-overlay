import { fadeInOutText } from '../animations/fadeCommands.js';
import { timerAudioEl } from '../Timer.js';

enum CountdownPhase {
	Pomo = 'Pomo',
	Break = 'Break',
}

interface PomoMeta {
	total: number; // total number of focus sessions
	current: number; // 1-indexed session currently running
	focusLength: number; // minutes per focus session
	breakLength: number; // minutes per break
}

interface CountdownState {
	remaining: number; // seconds left in the current phase
	phase: CountdownPhase;
	pomo: PomoMeta | null; // null for a plain (non-Pomodoro) countdown
	breakLength: number; // minutes, used to schedule the single break of a plain timer
}

export interface PomodoroEvents {
	onBreak?: (info: { session: number; total: number; breakLength: number }) => void;
	onSessionStart?: (info: { session: number; total: number; focusLength: number }) => void;
	onComplete?: (info: { total: number }) => void;
}

export default class PomodoroTimer {
	#intervalId: number | null = null;
	#state: CountdownState | null = null;
	#events: PomodoroEvents;

	constructor(events: PomodoroEvents = {}) {
		this.#events = events;
	}

	reveal(): void {
		document.querySelector('.timer')?.classList.remove('hidden');
	}

	/** Starts a single Focus -> Break countdown (classic !timer). */
	startTimer(focusDuration: number, breakDuration: number): void {
		this.reveal();
		this.#state = {
			remaining: focusDuration * 60,
			phase: CountdownPhase.Pomo,
			pomo: null,
			breakLength: breakDuration,
		};
		this.#setTitle(CountdownPhase.Pomo);
		this.#renderCountdown();
		this.#startInterval();
	}

	startPomodoro(focusDuration: number, breakDuration: number, sessions: number): void {
		this.reveal();
		this.#state = {
			remaining: focusDuration * 60,
			phase: CountdownPhase.Pomo,
			pomo: { total: sessions, current: 1, focusLength: focusDuration, breakLength: breakDuration },
			breakLength: breakDuration,
		};
		this.#setTitle(`${CountdownPhase.Pomo} 1/${sessions}`);
		this.#renderCountdown();
		this.#startInterval();
	}

	pause(): 'paused' | 'none' {
		if (!this.#state) return 'none';
		if (this.#intervalId) {
			clearInterval(this.#intervalId);
			this.#intervalId = null;
		}
		return 'paused';
	}

	resume(): 'resumed' | 'none' {
		if (!this.#state) return 'none';
		if (!this.#intervalId) {
			this.#startInterval();
		}
		return 'resumed';
	}

	#startInterval(): void {
		if (this.#intervalId) clearInterval(this.#intervalId);
		this.#intervalId = setInterval(() => this.#tick(), 1000);
	}

	#stop(): void {
		if (this.#intervalId) clearInterval(this.#intervalId);
		this.#intervalId = null;
		this.#state = null;
	}

	#tick(): void {
		const state = this.#state;
		if (!state) return;
		this.#renderCountdown();
		if (state.remaining <= 0) {
			this.#advancePhase(state);
			return;
		}
		state.remaining--;
	}

	#advancePhase(state: CountdownState): void {
		timerAudioEl.play();
		if (state.phase === CountdownPhase.Pomo) {
			// Focus block finished -> start the break.
			state.phase = CountdownPhase.Break;
			state.remaining = state.breakLength * 60;
			if (state.pomo) {
				this.#setTitle(`${CountdownPhase.Break} ${state.pomo.current}/${state.pomo.total}`);
				this.#events.onBreak?.({
					session: state.pomo.current,
					total: state.pomo.total,
					breakLength: state.pomo.breakLength,
				});
			} else {
				this.#setTitle(CountdownPhase.Break);
			}
			return;
		}

		// Break finished.
		if (!state.pomo) {
			// A plain timer ends after its single break.
			this.#stop();
			return;
		}
		if (state.pomo.current >= state.pomo.total) {
			// All Pomodoro sessions are done.
			this.#events.onComplete?.({ total: state.pomo.total });
			this.#stop();
			return;
		}
		// Start the next focus session.
		state.pomo.current++;
		state.phase = CountdownPhase.Pomo;
		state.remaining = state.pomo.focusLength * 60;
		this.#setTitle(`${CountdownPhase.Pomo} ${state.pomo.current}/${state.pomo.total}`);
		this.#events.onSessionStart?.({
			session: state.pomo.current,
			total: state.pomo.total,
			focusLength: state.pomo.focusLength,
		});
	}

	#renderCountdown(): void {
		const state = this.#state;
		if (!state) return;
		const countdownEl = document.querySelector('.timer .timer-countdown');
		if (!countdownEl) return;
		const remaining = Math.max(state.remaining, 0);
		const minutes = Math.floor(remaining / 60)
			.toString()
			.padStart(2, '0');
		const seconds = (remaining % 60).toString().padStart(2, '0');
		countdownEl.textContent = `${minutes}:${seconds}`;
	}

	#setTitle(title: string): void {
		const titleEl = document.querySelector<HTMLElement>('.timer .timer-title');
		if (titleEl) fadeInOutText(titleEl, title);
	}
}
