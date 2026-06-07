export interface CommandFlags {
	broadcaster: boolean;
	mod: boolean;
	[key: string]: unknown;
}

export interface CommandExtra {
	userColor?: string;
	messageId?: string;
	[key: string]: unknown;
}

export interface CommandData {
	user: string;
	command: string;
	message: string;
	flags: CommandFlags;
	extra: CommandExtra;
}
