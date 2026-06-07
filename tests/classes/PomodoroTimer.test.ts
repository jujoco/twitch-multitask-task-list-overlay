import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

// The timer plays an audio cue and animates the title; stub both so the tests
// can focus on the timing state machine and the events it emits.
vi.mock('../../src/Timer.js', () => ({ timerAudioEl: { play: vi.fn() } }));
vi.mock('../../src/animations/fadeCommands.js', () => ({ fadeInOutText: vi.fn() }));

import PomodoroTimer from '../../src/classes/PomodoroTimer';

describe('PomodoroTimer', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		document.body.innerHTML = `
			<div class="timer hidden">
				<span class="timer-title">Break</span>
				<span class="timer-countdown">00:00</span>
			</div>`;
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	const countdownText = () => document.querySelector('.timer .timer-countdown')?.textContent;

	test('reveal() un-hides the timer element', () => {
		const timer = new PomodoroTimer();
		expect(document.querySelector('.timer')?.classList.contains('hidden')).toBe(true);
		timer.reveal();
		expect(document.querySelector('.timer')?.classList.contains('hidden')).toBe(false);
	});

	test('startTimer renders the initial focus countdown', () => {
		const timer = new PomodoroTimer();
		timer.startTimer(25, 5);
		expect(countdownText()).toBe('25:00');
	});

	test('pause / resume report none when nothing is active', () => {
		const timer = new PomodoroTimer();
		expect(timer.pause()).toBe('none');
		expect(timer.resume()).toBe('none');
	});

	test('pause and resume an active timer', () => {
		const timer = new PomodoroTimer();
		timer.startTimer(25, 5);
		expect(timer.pause()).toBe('paused');
		expect(timer.pause()).toBe('paused'); // idempotent
		expect(timer.resume()).toBe('resumed');
		expect(timer.resume()).toBe('resumed'); // idempotent
	});

	test('a plain timer does not emit any pomodoro events', () => {
		const events = { onBreak: vi.fn(), onSessionStart: vi.fn(), onComplete: vi.fn() };
		const timer = new PomodoroTimer(events);
		timer.startTimer(1, 1);
		vi.advanceTimersByTime(5 * 60 * 1000);
		expect(events.onBreak).not.toHaveBeenCalled();
		expect(events.onSessionStart).not.toHaveBeenCalled();
		expect(events.onComplete).not.toHaveBeenCalled();
	});

	test('a Pomodoro emits break, next-session, and complete events in order', () => {
		const events = { onBreak: vi.fn(), onSessionStart: vi.fn(), onComplete: vi.fn() };
		const timer = new PomodoroTimer(events);
		// 2 sessions, 1 min focus / 1 min break.
		timer.startPomodoro(1, 1, 2);
		vi.advanceTimersByTime(10 * 60 * 1000);

		expect(events.onBreak.mock.calls.map((c) => c[0])).toEqual([
			{ session: 1, total: 2, breakLength: 1 },
			{ session: 2, total: 2, breakLength: 1 },
		]);
		expect(events.onSessionStart.mock.calls.map((c) => c[0])).toEqual([
			{ session: 2, total: 2, focusLength: 1 },
		]);
		expect(events.onComplete).toHaveBeenCalledExactlyOnceWith({ total: 2 });
	});

	test('pausing freezes the countdown and resuming continues it', () => {
		const timer = new PomodoroTimer();
		timer.startPomodoro(10, 5, 2);
		vi.advanceTimersByTime(3000); // 3 seconds elapse
		const beforePause = countdownText();
		timer.pause();
		vi.advanceTimersByTime(5000); // time passes while paused
		expect(countdownText()).toBe(beforePause); // unchanged

		timer.resume();
		vi.advanceTimersByTime(2000); // 2 more seconds elapse
		expect(countdownText()).not.toBe(beforePause); // ticking again
	});
});
