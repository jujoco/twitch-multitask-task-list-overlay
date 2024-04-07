const fs = require("fs");
const { spawn } = require("child_process");

const srcDir = "./src";

console.log(`Watching for file changes on ${srcDir}`);

fs.watch(srcDir, { recursive: true }, (eventType, filename) => {
	if (filename) {
		console.log(`${filename} has been modified. Running build.js...`);

		const buildProcess = spawn("node", ["./scripts/build.js"], {
			stdio: "inherit",
		});

		buildProcess.on("close", (code) => {
			console.log(`build.js completed with code ${code}`);
		});
	} else {
		console.log("Filename not provided or not supported.");
	}
});
