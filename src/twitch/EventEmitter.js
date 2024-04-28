/**
 * @class EventEmitter
 * @property {Map<string, Function[]>} events
 * @method on - Add a listener to an event
 * @method emit - Emit an event
 * @method off - Remove a listener from an event
 * @method once - Add a listener to an event that will only be called once
 */
class EventEmitter {
	constructor() {
		this.events = new Map();
	}

	/**
	 * Add a listener to an event
	 * @param {string} eventName - The name of the event
	 * @param {Function} listener - The listener to add
	 * @returns {void}
	 */
	on(eventName, listener) {
		if (!this.events.has(eventName)) {
			this.events.set(eventName, []);
		}
		this.events.get(eventName).push(listener);
	}

	/**
	 * Emit an event
	 * @param {string} eventName - The name of the event
	 * @param  {...any} args - The arguments to pass to the listeners
	 * @returns {void}
	 */
	emit(eventName, ...args) {
		if (this.events.has(eventName)) {
			this.events.get(eventName).forEach((listener) => listener(...args));
		}
	}

	/**
	 * Remove a listener from an event
	 * @param {string} eventName - The name of the event
	 * @param {Function} listener - The listener to remove
	 * @returns {void}
	 */
	off(eventName, listener) {
		if (this.events.has(eventName)) {
			const listeners = this.events.get(eventName);
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
	 * @param {string} eventName - The name of the event
	 * @param {Function} listener - The listener to add
	 * @returns {void}
	 */
	once(eventName, listener) {
		const onceWrapper = (...args) => {
			listener(...args);
			this.off(eventName, onceWrapper);
		};
		this.on(eventName, onceWrapper);
	}
}

export default EventEmitter;
