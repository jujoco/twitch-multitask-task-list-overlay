type Listener = (...args: any[]) => void;

/**
 * Minimal event emitter: register, emit, and remove named listeners.
 */
class EventEmitter {
	events: Map<string, Listener[]>;

	constructor() {
		this.events = new Map();
	}

	/**
	 * Add a listener to an event
	 */
	on(eventName: string, listener: Listener): void {
		if (!this.events.has(eventName)) {
			this.events.set(eventName, []);
		}
		this.events.get(eventName)?.push(listener);
	}

	/**
	 * Emit an event
	 */
	emit(eventName: string, ...args: any[]): void {
		if (this.events.has(eventName)) {
			this.events.get(eventName)?.forEach((listener) => {
				listener(...args);
			});
		}
	}

	/**
	 * Remove a listener from an event
	 */
	off(eventName: string, listener: Listener): void {
		if (this.events.has(eventName)) {
			const listeners = this.events.get(eventName);
			if (!listeners) return;
			const index = listeners.indexOf(listener);
			if (index !== -1) {
				listeners.splice(index, 1);
				// Clean up memory if there's no listener left
				if (listeners.length === 0) {
					this.events.delete(eventName);
				}
			}
		}
	}

	/**
	 * Add a listener to an event that will only be called once
	 */
	once(eventName: string, listener: Listener): void {
		const onceWrapper = (...args: any[]) => {
			listener(...args);
			this.off(eventName, onceWrapper);
		};
		this.on(eventName, onceWrapper);
	}
}

export default EventEmitter;
