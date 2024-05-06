/**
 * Update the element's text with a fade transition effect
 * @param {HTMLElement} element
 * @param {string} innerText
 */
export function fadeInOutText(element, innerText) {
	if (element.innerText === innerText) return;

	element.style.opacity = 0;
	setTimeout(() => {
		element.innerText = innerText;
		element.style.opacity = 1;
	}, 1000);
}
