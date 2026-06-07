import { beforeEach, describe, expect, test, vi } from 'vitest';
import TimerCommandHandler, { type TimerControls } from '../../src/classes/TimerCommandHandler';

describe('TimerCommandHandler', () => {
	const timer: TimerControls = {
		startTimer: vi.fn(),
		startPomodoro: vi.fn(),
		pause: vi.fn(),
		resume: vi.fn(),
	};
	const handler = new TimerCommandHandler(timer);

	const adminFlags = { broadcaster: true, mod: false };
	const userFlags = { broadcaster: false, mod: false };
	const botResponsePrefix = '🤖💬 ';

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('!timer command', () => {
		test('one value runs a single timer with no break', () => {
			const response = handler.handle('bobTheAdmin', 'timer', '30', adminFlags);
			expect(timer.startTimer).toHaveBeenCalledWith(30, 0);
			expect(timer.startPomodoro).not.toHaveBeenCalled();
			expect(response?.message).toBe(`${botResponsePrefix}Timer has been reset to 30 minutes ⏲️`);
		});

		test('two values set focus and break', () => {
			const response = handler.handle('bobTheAdmin', 'timer', '60/10', adminFlags);
			expect(timer.startTimer).toHaveBeenCalledWith(60, 10);
			expect(timer.startPomodoro).not.toHaveBeenCalled();
			expect(response?.message).toBe(`${botResponsePrefix}Timer has been reset to 60 minutes ⏲️`);
		});

		test('no arguments fall back to the defaults', () => {
			handler.handle('bobTheAdmin', 'timer', '', adminFlags);
			expect(timer.startTimer).toHaveBeenCalledWith(60, 10);
		});
	});

	describe('pomodoro mode (focus/break/sessions)', () => {
		test('runs a pomodoro when a session count of 2 or more is given', () => {
			const response = handler.handle('bobTheAdmin', 'timer', '90/10/2', adminFlags);
			expect(timer.startPomodoro).toHaveBeenCalledWith(90, 10, 2);
			expect(response?.error).toBe(false);
			expect(response?.message).toBe(
				`${botResponsePrefix}Pomodoro session 1/2 started! Focus for 90 minutes 🍅`,
			);
		});

		test('accepts space-separated values too', () => {
			handler.handle('bobTheAdmin', 'pomo', '90 10 2', adminFlags);
			expect(timer.startPomodoro).toHaveBeenCalledWith(90, 10, 2);
		});

		test('a single session runs a normal timer, not a pomodoro', () => {
			handler.handle('bobTheAdmin', 'timer', '60/10/1', adminFlags);
			expect(timer.startPomodoro).not.toHaveBeenCalled();
			expect(timer.startTimer).toHaveBeenCalledWith(60, 10);
		});

		test('errors on a non-positive session count', () => {
			const response = handler.handle('bobTheAdmin', 'timer', '90/10/-2', adminFlags);
			expect(response?.error).toBe(true);
			expect(response?.message).toBe(
				`${botResponsePrefix}Invalid command: Invalid timer duration. Try !help`,
			);
		});
	});

	describe('!pause command', () => {
		test('pauses an active timer', () => {
			(timer.pause as ReturnType<typeof vi.fn>).mockReturnValueOnce('paused');
			const response = handler.handle('bobTheAdmin', 'pause', '', adminFlags);
			expect(timer.pause).toHaveBeenCalled();
			expect(response?.error).toBe(false);
			expect(response?.message).toBe(`${botResponsePrefix}Timer paused ⏸️`);
		});

		test('errors when there is no active timer', () => {
			(timer.pause as ReturnType<typeof vi.fn>).mockReturnValueOnce('none');
			const response = handler.handle('bobTheAdmin', 'pause', '', adminFlags);
			expect(response?.error).toBe(true);
			expect(response?.message).toBe(
				`${botResponsePrefix}Invalid command: No active timer to pause. Try !help`,
			);
		});
	});

	describe('!resume command', () => {
		test('resumes a paused timer', () => {
			(timer.resume as ReturnType<typeof vi.fn>).mockReturnValueOnce('resumed');
			const response = handler.handle('bobTheAdmin', 'resume', '', adminFlags);
			expect(timer.resume).toHaveBeenCalled();
			expect(response?.error).toBe(false);
			expect(response?.message).toBe(`${botResponsePrefix}Timer resumed ▶️`);
		});

		test('errors when there is no active timer', () => {
			(timer.resume as ReturnType<typeof vi.fn>).mockReturnValueOnce('none');
			const response = handler.handle('bobTheAdmin', 'resume', '', adminFlags);
			expect(response?.error).toBe(true);
			expect(response?.message).toBe(
				`${botResponsePrefix}Invalid command: No active timer to resume. Try !help`,
			);
		});
	});

	describe('defers non-timer or unauthorized commands', () => {
		test('returns null for a non-mod timer command', () => {
			expect(handler.handle('joeTheUser', 'timer', '90/10/2', userFlags)).toBeNull();
		});

		test('returns null for a command it does not own', () => {
			expect(handler.handle('bobTheAdmin', 'task', 'wash dishes', adminFlags)).toBeNull();
		});
	});
});
