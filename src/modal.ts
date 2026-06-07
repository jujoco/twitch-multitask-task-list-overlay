export function openModal(id = 'modal'): void {
	const el = document.getElementById(id);
	el?.classList.remove('hidden');
	el?.classList.add('flex');
}

export function closeModal(id = 'modal'): void {
	const el = document.getElementById(id);
	el?.classList.remove('flex');
	el?.classList.add('hidden');
}
