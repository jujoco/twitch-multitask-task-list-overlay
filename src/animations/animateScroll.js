/** @type {Animation | null} */
let primaryAnimation = null;
/** @type {Animation | null} */
let secondaryAnimation = null;

const gapSize =
	parseInt(
		getComputedStyle(document.documentElement).getPropertyValue(
			"--card-gap-between"
		),
		10
	) || 0;

/**
 * Animates the task list as a seamless, GPU-composited infinite scroll.
 * @returns {void}
 */
export function animateScroll() {
	const wrapper = document.querySelector(".task-wrapper");
	const wrapperHeight = wrapper.clientHeight;

	const containerPrimary = document.querySelector(".task-container.primary");
	const containerHeight = containerPrimary.scrollHeight;

	/** @type {HTMLElement} */
	const containerSecondary = document.querySelector(
		".task-container.secondary"
	);

	// Content fits the viewport: nothing to scroll. Stop and hide the clone.
	if (containerHeight <= wrapperHeight) {
		containerSecondary.style.display = "none";
		cancelAnimation();
		return;
	}

	containerSecondary.style.display = "block";

	const speed = parseInt(_settings.scrollSpeed.toString(), 10) || 25;
	const scrollDistance = containerHeight + gapSize * 2;
	const duration = (scrollDistance / speed) * 1000;
	const previousTime =
		primaryAnimation && primaryAnimation.currentTime != null
			? Number(primaryAnimation.currentTime) % duration
			: 0;

	cancelAnimation();

	const keyframes = [
		{ transform: "translateY(0)" },
		{ transform: `translateY(-${scrollDistance}px)` },
	];
	const options = {
		duration: duration,
		iterations: Infinity,
		easing: "linear",
	};

	primaryAnimation = containerPrimary.animate(keyframes, options);
	secondaryAnimation = containerSecondary.animate(keyframes, options);
	primaryAnimation.currentTime = previousTime;
	secondaryAnimation.currentTime = previousTime;
}

/**
 * Cancels both animations and clears the references.
 * @returns {void}
 */
function cancelAnimation() {
	if (primaryAnimation) {
		primaryAnimation.cancel();
		primaryAnimation = null;
	}
	if (secondaryAnimation) {
		secondaryAnimation.cancel();
		secondaryAnimation = null;
	}
}
