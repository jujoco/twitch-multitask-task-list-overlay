/** @type {Animation} */
let primaryAnimation;
/** @type {Animation} */
let secondaryAnimation;

/**
 * @param {number} scrollSpeed
 * @returns {void}
 */
export function animateScroll() {
	const wrapper = document.querySelector(".task-wrapper");
	const wrapperHeight = wrapper.clientHeight;

	const containerPrimary = document.querySelector(".task-container.primary");
	const containerHeight = containerPrimary.scrollHeight;

	const containerSecondary = document.querySelector(
		".task-container.secondary"
	);

	// hide 2nd container & cancel animation OR show it & play animation
	if (containerHeight < wrapperHeight) {
		containerSecondary.style.display = "none";
		cancelAnimation();
	} else {
		containerSecondary.style.display = "flex";
		const scrollSpeed = configs.settings.scrollSpeed;
		let parsedSpeed = parseInt(scrollSpeed, 10);
		let duration = (containerHeight / parsedSpeed) * 1000;
		let options = {
			duration: duration,
			iterations: 1,
			easing: "linear",
		};

		const gapSize = getComputedStyle(document.documentElement)
			.getPropertyValue("--card-gap-between")
			.slice(0, -2);
		let adjustedHight = containerHeight + parseInt(gapSize, 10);
		let primaryKeyFrames = [
			{ transform: "translateY(0)" },
			{ transform: `translateY(-${adjustedHight}px)` },
		];
		let secondaryKeyFrames = [
			{ transform: "translateY(0)" },
			{ transform: `translateY(-${adjustedHight}px)` },
		];
		// store and apply animations
		primaryAnimation = containerPrimary.animate(primaryKeyFrames, options);
		secondaryAnimation = containerSecondary.animate(
			secondaryKeyFrames,
			options
		);

		addAnimationListeners();
	}
}

function cancelAnimation() {
	if (primaryAnimation) {
		primaryAnimation.cancel();
	}
	if (secondaryAnimation) {
		secondaryAnimation.cancel();
	}
}

function addAnimationListeners() {
	if (primaryAnimation) {
		primaryAnimation.addEventListener("finish", animationFinished);
		primaryAnimation.addEventListener("cancel", animationFinished);
	}
}

function animationFinished() {
	animateScroll();
}
