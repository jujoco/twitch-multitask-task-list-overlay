export function fadeInOutText(element: HTMLElement, innerText: string): void {
	if (element.innerText === innerText) return;

	// Create fade out animation
	const fadeOut = element.animate([{ opacity: 1 }, { opacity: 0 }], {
		duration: 350,
		fill: 'forwards',
		easing: 'ease-out',
	});

	// When fade out completes, update text and fade back in
	fadeOut.onfinish = () => {
		element.textContent = innerText;

		element.animate([{ opacity: 0 }, { opacity: 1 }], {
			duration: 350,
			fill: 'forwards',
			easing: 'ease-in',
		});
	};
}
