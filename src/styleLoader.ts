export function loadStyles(styles: Record<string, string>): void {
	const root = document.querySelector<HTMLElement>(':root');
	if (!root) return;
	for (const [key, val] of Object.entries(styles)) {
		if (key.includes('FontFamily')) {
			loadGoogleFont(val);
		}
		root.style.setProperty(convertToCSSVar(key), val);
	}
}

function loadGoogleFont(font: string): void {
	// WebFont is provided globally by the webfont loader script in index.html
	(window as unknown as { WebFont: { load: (opts: object) => void } }).WebFont.load({
		google: {
			families: [`${font}:200,300,400,700`],
		},
	});
}

function convertToCSSVar(name: string): string {
	const cssVar = name.replace(/([A-Z])/g, '-$1').toLowerCase();
	return `--${cssVar}`;
}
