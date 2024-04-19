export function fadeInOutHelpCommands() {
	const textList = ["!add", "!edit", "!done", "!delete", "!taskhelp"];
	const textElement = document.querySelector(".command-code");
	let index = 0;
	setInterval(() => {
		textElement.style.opacity = 0;
		setTimeout(() => {
			textElement.innerText = textList[index];
			textElement.style.opacity = 1;
			index = (index + 1) % textList.length;
		}, 1000);
	}, 7000);
}
