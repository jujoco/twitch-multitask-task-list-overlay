let primaryAnimation: Animation | null = null;
let secondaryAnimation: Animation | null = null;

const gapSize =
	parseInt(getComputedStyle(document.documentElement).getPropertyValue('--card-gap-between'), 10) ||
	0;

export function animateScroll(): void {
	const wrapper = document.querySelector('.task-wrapper');
	const containerPrimary = document.querySelector('.task-container.primary');
	const containerSecondary = document.querySelector<HTMLElement>('.task-container.secondary');
	if (!wrapper || !containerPrimary || !containerSecondary) return;

	const wrapperHeight = wrapper.clientHeight;
	const containerHeight = containerPrimary.scrollHeight;

	// Content fits the viewport: nothing to scroll. Stop and hide the clone.
	if (containerHeight <= wrapperHeight) {
		containerSecondary.style.display = 'none';
		cancelAnimation();
		return;
	}

	containerSecondary.style.display = 'block';

	const speed = parseInt(_settings.scrollSpeed.toString(), 10) || 25;
	const scrollDistance = containerHeight + gapSize * 2;
	const duration = (scrollDistance / speed) * 1000;
	const previousTime =
		primaryAnimation && primaryAnimation.currentTime != null
			? Number(primaryAnimation.currentTime) % duration
			: 0;

	cancelAnimation();

	const keyframes = [
		{ transform: 'translateY(0)' },
		{ transform: `translateY(-${scrollDistance}px)` },
	];
	const options: KeyframeAnimationOptions = {
		duration: duration,
		iterations: Infinity,
		easing: 'linear',
	};

	primaryAnimation = containerPrimary.animate(keyframes, options);
	secondaryAnimation = containerSecondary.animate(keyframes, options);
	primaryAnimation.currentTime = previousTime;
	secondaryAnimation.currentTime = previousTime;
}

function cancelAnimation(): void {
	if (primaryAnimation) {
		primaryAnimation.cancel();
		primaryAnimation = null;
	}
	if (secondaryAnimation) {
		secondaryAnimation.cancel();
		secondaryAnimation = null;
	}
}
