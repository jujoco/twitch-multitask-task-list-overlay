const fs = require("node:fs");

const files = fs.readdirSync("src");
console.log(files);

let contents = "";

files.forEach((file) => {
	const fileContent = fs.readFileSync(`src/${file}`, "utf-8");
	const lines = fileContent.split("\n");
	const modifiedContent = lines
		.filter(
			(line) =>
				!line.includes("require") &&
				!line.includes("module.exports") &&
				!line.includes("@typedef {import(")
		)
		.join("\n");

	contents += modifiedContent;
});

fs.writeFileSync("public/bundle.js", contents);
