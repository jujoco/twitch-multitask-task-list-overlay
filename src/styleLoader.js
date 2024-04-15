/**
 * Load custom styles from configs.
 * @returns {void}
 */
export function loadStyles() {
	const root = document.querySelector(":root");
	for (let [key, val] of Object.entries(configs.styles)) {
		if (key.includes("FontFamily")) {
			loadGoogleFont(val);
		}
		root.style.setProperty(convertToCSSVar(key), val);
	}
}

/**
 * @param {string} font - Font family name.
 * @returns {void}
 */
function loadGoogleFont(font) {
	WebFont.load({
		google: {
			families: [`${font}:100,400,700`],
		},
	});
}

/**
 * @param {string} name - The name of the CSS variable.
 * @returns {string}
 */
function convertToCSSVar(name) {
	let cssVar = name.replace(/([A-Z])/g, "-$1").toLowerCase();
	return `--${cssVar}`;
}
