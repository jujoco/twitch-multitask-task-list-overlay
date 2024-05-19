/**
 * Update the element's text with a fade transition effect
 * @param {HTMLElement} element
 * @param {string} innerText
 * @returns {void}
 */
export function fadeInOutText(element, innerText) {
	if (element.innerText === innerText) return;

	element.style.opacity = "0";
	setTimeout(() => {
		element.textContent = innerText;
		element.style.opacity = "1";
	}, 700);
}
