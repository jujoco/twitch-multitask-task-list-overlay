export default class Task {
	description: string;
	id: string;
	completionStatus: boolean;
	focusStatus: boolean;

	constructor(description: string) {
		this.description = this.validateDescription(description);
		this.id = this.#assignId();
		this.completionStatus = false;
		this.focusStatus = false;
	}

	validateDescription(description: string): string {
		if (typeof description !== 'string') {
			throw new Error(`Task description must be of type string`);
		}
		description = description.trim();
		if (description.length === 0) {
			throw new Error('Task description invalid');
		}
		return description;
	}

	#assignId(): string {
		const now = new Date();
		const day = String(now.getDate()).padStart(2, '0');
		const hour = String(now.getHours()).padStart(2, '0');
		const minute = String(now.getMinutes()).padStart(2, '0');
		const second = String(now.getSeconds()).padStart(2, '0');
		const millisecond = String(now.getMilliseconds()).padStart(3, '0');
		const salt = Math.floor(Math.random() * 10000);
		return `${day}${hour}${minute}${second}${millisecond}${salt}`;
	}

	setDescription(description: string): void {
		this.description = this.validateDescription(description);
	}

	isComplete(): boolean {
		return this.completionStatus;
	}

	setCompletionStatus(status: boolean): void {
		if (typeof status !== 'boolean') {
			throw new Error('Completion status must be of type boolean');
		}
		this.completionStatus = status;

		if (this.isFocused() && this.isComplete()) {
			this.setFocusStatus(false);
		}
	}

	isFocused(): boolean {
		return this.focusStatus;
	}

	setFocusStatus(status: boolean): void {
		if (typeof status !== 'boolean') {
			throw new Error('Focus status must be of type boolean');
		}
		this.focusStatus = status;
	}
}
