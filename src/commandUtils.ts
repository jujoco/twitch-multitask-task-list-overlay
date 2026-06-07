import type { CommandFlags } from './twitch/types.js';

export interface ChatResponse {
	error: boolean;
	message: string;
}

export function respondMessage(
	template: string,
	username: string,
	message: string,
	error = false,
): ChatResponse {
	return {
		message:
			_settings.botResponsePrefix +
			template.replace('{user}', username).replace('{message}', message),
		error,
	};
}

export function isMod(flags: CommandFlags): boolean {
	return flags.broadcaster || flags.mod;
}
