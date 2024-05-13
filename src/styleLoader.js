/**
 * Load custom styles from configs.
 * @param {Object} styles - Custom styles.
 * @returns {void}
 */
export function loadStyles(styles) {
	const root = document.querySelector(":root");
	for (let [key, val] of Object.entries(styles)) {
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
